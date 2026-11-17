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
  Check
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

export default function HoroscopeBooklet7PageView({
  data,
  setData,
  isTa,
  onAutoFill,
  onClearAll,
  onPrint
}) {
  const [boxHeight, setBoxHeight] = useState('compact'); // 'compact' (120mm) or 'full' (260mm)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('p1');

  // Handle nested updates
  const updateVal = (page, key, val) => {
    setData(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [key]: val
      }
    }));
  };

  const updateHeader = (key, val) => {
    setData(prev => ({
      ...prev,
      page1: {
        ...prev.page1,
        header: {
          ...prev.page1.header,
          [key]: val
        }
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setData(prev => ({
          ...prev,
          meta: {
            ...prev.meta,
            coverImage: evt.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle underline for dasha matrix cell
  const toggleDashaUnderline = (r, c) => {
    setData(prev => {
      const matrix = prev.page6.matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === r && cIdx === c) {
            return { ...cell, underlined: !cell.underlined };
          }
          return cell;
        })
      );
      return {
        ...prev,
        page6: {
          ...prev.page6,
          matrix
        }
      };
    });
  };

  const updateDashaCellText = (r, c, text) => {
    setData(prev => {
      const matrix = prev.page6.matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === r && cIdx === c) {
            return { ...cell, text };
          }
          return cell;
        })
      );
      return {
        ...prev,
        page6: {
          ...prev.page6,
          matrix
        }
      };
    });
  };

  // Helper to render South Indian 4x4 Chart
  const renderSouthChart = (centerLabel, cellsData) => {
    return (
      <table className="w-full border-collapse border border-black table-fixed">
        <tbody>
          {[0, 1, 2, 3].map(r => (
            <tr key={r}>
              {[0, 1, 2, 3].map(c => {
                const signIdx = SIGN_MAP_GRID[r][c];
                if (signIdx === -1) {
                  if (r === 1 && c === 1) {
                    return (
                      <td
                        key="center"
                        colSpan={2}
                        rowSpan={2}
                        className="border border-black p-0 text-center relative overflow-hidden align-middle"
                        style={{
                          background: 'radial-gradient(circle, #FFFDF5 30%, #F5E8C9 100%)'
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                          <svg viewBox="0 0 100 100" className="w-14 h-14">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="#7A1A22" strokeWidth="2.5" />
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,3" />
                            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#7A1A22" strokeWidth="1.5" transform="rotate(45 50 50)" />
                          </svg>
                        </div>
                        <div className="relative z-10 font-bold text-[#7A1A22] text-xs tracking-wider">
                          {centerLabel}
                        </div>
                      </td>
                    );
                  }
                  return null;
                }

                const raw = cellsData[signIdx] || '';
                const isLagna = raw.includes('1-லக்') || raw.includes('லக்');
                const signName = isTa ? SIGN_NAMES_TA[signIdx] : SIGN_NAMES_EN[signIdx];
                const pills = raw.split(',').map(s => s.trim()).filter(Boolean);

                return (
                  <td
                    key={c}
                    className="border border-black p-1 align-top relative"
                    style={{
                      height: boxHeight === 'compact' ? '15mm' : '18mm',
                      background: 'radial-gradient(circle at center, #FFFDF8 0%, #FFFBEA 100%)',
                      backgroundImage: isLagna
                        ? 'linear-gradient(135deg, transparent 0px, transparent 13px, #000 13px, #000 14.5px, transparent 14.5px)'
                        : undefined
                    }}
                  >
                    <div className="flex justify-between items-center text-[7px] font-bold text-stone-500 leading-none mb-0.5">
                      <span className="truncate">{signName}</span>
                    </div>
                    <div className="text-[8px] font-bold text-black flex flex-col gap-0.5 leading-tight">
                      {pills.map((pill, pIdx) => (
                        <span key={pIdx} className="truncate">{pill}</span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Helper for Mini South Chart (Sarvashtavarga)
  const renderMiniSouthChart = (totalsArray, grandTotal) => {
    return (
      <table className="w-full border-collapse border border-black table-fixed text-center">
        <tbody>
          {[0, 1, 2, 3].map(r => (
            <tr key={r}>
              {[0, 1, 2, 3].map(c => {
                const signIdx = SIGN_MAP_GRID[r][c];
                if (signIdx === -1) {
                  if (r === 1 && c === 1) {
                    return (
                      <td
                        key="center"
                        colSpan={2}
                        rowSpan={2}
                        className="border border-black p-0.5 text-center align-middle bg-[#FDF9EE]"
                      >
                        <div className="text-[7.5px] font-bold text-[#7A1A22]">பரல்கள்</div>
                        <div className="text-[9px] font-mono font-black">{grandTotal}</div>
                      </td>
                    );
                  }
                  return null;
                }
                const val = totalsArray[signIdx] || '';
                return (
                  <td
                    key={c}
                    className="border border-black p-0.5 text-[7.5px] font-mono font-bold bg-[#FFFDF8]"
                    style={{ height: '7.5mm' }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const isCompact = boxHeight === 'compact';

  return (
    <div className="space-y-4">
      {/* 7-PAGE SUB-CONTROLS (Screen only) */}
      <div className="bg-white dark:bg-stone-900 border border-amber-900/15 dark:border-stone-800 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#7A1A22] dark:text-amber-300">
            {isTa ? '📚 7-பக்க ஜாதக புத்தகம் (Booklet)' : '📚 7-Page Horoscope Booklet'}
          </span>
          <span className="text-[11px] text-stone-500">
            {isTa ? 'A4 மேல் அரைப் பகுதி (120mm) அல்லது முழுப் பக்கம்' : 'Top half box (120mm) or full page'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Box Height Toggle */}
          <button
            type="button"
            onClick={() => setBoxHeight(isCompact ? 'full' : 'compact')}
            className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-200 transition-colors cursor-pointer"
          >
            {isCompact
              ? (isTa ? 'அளவு: சிறிய பெட்டி (120mm)' : 'Height: Compact (120mm)')
              : (isTa ? 'அளவு: முழுப் பக்கம்' : 'Height: Full Page')}
          </button>

          {/* Edit Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isEditorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isEditorOpen ? (isTa ? 'திருத்தத்தை மறைக்க' : 'Hide Editor') : (isTa ? 'புத்தக விவரங்களை திருத்த' : 'Edit Booklet')}</span>
          </button>

          {/* Standalone 7-Page HTML Link */}
          <a
            href="/horoscope_booklet_7page.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Open standalone 7-page HTML file in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>{isTa ? 'தனிக் கோப்பு (HTML)' : 'Standalone HTML'}</span>
          </a>
        </div>
      </div>

      {/* COLLAPSIBLE 7-PAGE EDITOR */}
      {isEditorOpen && (
        <div className="bg-white dark:bg-stone-900 border border-amber-900/15 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3 no-print text-xs">
          <div className="flex border-b border-stone-200 dark:border-stone-800 gap-1.5 pb-2 overflow-x-auto no-scrollbar">
            {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].map((tabKey, idx) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveEditorTab(tabKey)}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-all ${
                  activeEditorTab === tabKey
                    ? 'bg-[#7A1A22] text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
          </div>

          {/* TAB 1 */}
          {activeEditorTab === 'p1' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              <div>
                <label className="block font-bold mb-0.5 opacity-80">Header Line 1</label>
                <input
                  type="text"
                  value={data.page1.header.line1}
                  onChange={e => updateHeader('line1', e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 opacity-80">Header Line 2</label>
                <input
                  type="text"
                  value={data.page1.header.line2}
                  onChange={e => updateHeader('line2', e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 opacity-80">Title</label>
                <input
                  type="text"
                  value={data.page1.title}
                  onChange={e => updateVal('page1', 'title', e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 opacity-80">Credit Line</label>
                <input
                  type="text"
                  value={data.page1.credit}
                  onChange={e => updateVal('page1', 'credit', e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 opacity-80">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2 */}
          {activeEditorTab === 'p2' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-0.5 opacity-80">Gender Label</label>
                  <select
                    value={data.page2.genderLabel}
                    onChange={e => updateVal('page2', 'genderLabel', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                  >
                    <option value="ஆண் பெயர்">ஆண் பெயர் (Male)</option>
                    <option value="பெண் பெயர்">பெண் பெயர் (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-0.5 opacity-80">பக்ஷம் & திதி</label>
                  <input
                    type="text"
                    value={data.page2.pakshaTithi}
                    onChange={e => updateVal('page2', 'pakshaTithi', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5 opacity-80">திசை இருப்பு</label>
                  <input
                    type="text"
                    value={data.page2.dashaBalance}
                    onChange={e => updateVal('page2', 'dashaBalance', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Dasha Matrix */}
          {activeEditorTab === 'p6' && (
            <div className="space-y-2">
              <div className="text-[11px] text-stone-500">
                💡 Click any date box to toggle <u>Underline</u> for dasha-end dates.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-stone-300 text-center text-[10px]">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-800">
                      <th className="p-1 border border-stone-300">புக்தி \ திசை</th>
                      {data.page6.dashaLords.map((l, lIdx) => (
                        <th key={lIdx} className="p-1 border border-stone-300">{l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.page6.bhuktiLords.map((bLord, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-1 border border-stone-300 font-bold">{bLord}</td>
                        {data.page6.matrix[rIdx].map((cell, cIdx) => (
                          <td key={cIdx} className="p-1 border border-stone-300 whitespace-nowrap">
                            <input
                              type="text"
                              value={cell.text}
                              onChange={e => updateDashaCellText(rIdx, cIdx, e.target.value)}
                              className={`w-20 text-[10px] font-mono border rounded px-1 py-0.5 text-center ${
                                cell.underlined ? 'underline font-bold text-red-700 border-red-500' : ''
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleDashaUnderline(rIdx, cIdx)}
                              className="ml-1 text-[9px] px-1 py-0.2 rounded border cursor-pointer hover:bg-stone-200"
                              title="Toggle underline"
                            >
                              <u>U</u>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* THE 7-PAGE PRINTABLE BOOKLET WRAPPER                                      */}
      {/* ========================================================================= */}
      <div className="space-y-6 print:space-y-0">

        {/* ------------------------------------------------------------- */}
        {/* PAGE 1: COVER                                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-1-</span>

            <div>
              {/* Header Box */}
              <div className="border border-black p-1.5 text-center w-[90%] mx-auto mb-1">
                <div className="text-sm font-black leading-tight min-h-[16px]">{data.page1.header.line1}</div>
                <div className="text-[10px] font-bold min-h-[12px]">{data.page1.header.line2}</div>
                <div className="text-[8px] leading-tight min-h-[10px]">{data.page1.header.address1} {data.page1.header.address2}</div>
                <div className="text-[7.5px] font-mono font-semibold min-h-[10px]">{data.page1.header.phoneEmail}</div>
              </div>

              {/* Credit Row & Rule */}
              <div className="flex justify-between items-center text-[7.5px] px-1">
                <span>{data.page1.credit}</span>
              </div>
              <hr className="border-0 border-t border-black my-0.5" />

              {/* Title & Verse */}
              <div className="text-center my-1">
                <div className="text-base font-black tracking-wide">{data.page1.title || 'ஜனன ஜாதகம்'}</div>
                <div className="text-[8px] italic leading-tight text-[#7A1A22]">{data.page1.verseLine1}</div>
                <div className="text-[8px] italic leading-tight text-[#7A1A22]">{data.page1.verseLine2}</div>
              </div>

              {/* Body: Left Image Slot (35x55mm) + Right Details */}
              <div className="flex gap-3 items-stretch mt-1">
                <div className="w-[35mm] h-[55mm] border border-dashed border-stone-400 bg-stone-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {data.meta.coverImage ? (
                    <img src={data.meta.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[8px] text-stone-400 text-center p-1">Illustration<br />(35 × 55 mm)</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-0.5 text-[8.5px]">
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">பெயர்</span><span className="mr-1">:</span><span className="font-black text-xs text-[#7A1A22]">{data.page1.name}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">தந்தை</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.father}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">தாய்</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.mother}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">சொந்த ஊர்</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.nativePlace}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">நட்சத்திரம்</span><span className="mr-1">:</span><span className="font-bold">{data.page1.nakshatra}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">ராசி</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.rasi}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">லக்னம்</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.lagna}</span></div>
                  <div className="h-0.5"></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">தேதி</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.dateWeekday}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">நேரம்</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.time}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">தமிழ் தேதி</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.tamilDate}</span></div>
                  <div className="flex items-baseline"><span className="w-20 font-bold shrink-0">இடம்</span><span className="mr-1">:</span><span className="font-semibold">{data.page1.place}</span></div>
                  <div className="flex items-baseline"><span className="w-20 shrink-0"></span><span className="mr-1"></span><span className="text-[7.5px] font-mono text-stone-600">{data.page1.latLonTz}</span></div>
                  <div className="font-black text-[9.5px] text-[#7A1A22] mt-0.5">திருக்கணிதம்</div>
                </div>
              </div>
            </div>

            {/* Bottom Rule */}
            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7px] text-stone-500">
              <span>.</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 2: RASI & NAVAMSA CHARTS                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-2-</span>

            <div>
              {/* Header Grid */}
              <div className="flex justify-between text-[8px] mb-1">
                <div>
                  <span className="font-bold">{data.page2.genderLabel || 'ஆண் பெயர்'}</span>: <b>{data.page2.name}</b> | <span>தேதி</span>: {data.page2.date} | <span>நேரம்</span>: {data.page2.time}
                </div>
                <div>
                  <span>லக்னம்</span>: <b>{data.page2.lagna}</b> | <span>ராசி</span>: <b>{data.page2.rasi}</b> | <span>நட்சத்திரம்</span>: <b>{data.page2.nakshatraPada}</b>
                </div>
              </div>

              {/* Side by Side Charts */}
              <div className="flex gap-2 justify-center my-1">
                <div className="w-[49%]">
                  {renderSouthChart(isTa ? 'ராசி' : 'RASI', data.page2.rasiChart)}
                </div>
                <div className="w-[49%]">
                  {renderSouthChart(isTa ? 'நவாம்சம்' : 'NAVAMSA', data.page2.navamsaChart)}
                </div>
              </div>

              {/* Footer Grid */}
              <div className="flex justify-between text-[8px] mt-1">
                <div>
                  <div><span>இடம்</span>: <b>{data.page2.place}</b> <span className="text-[7px] text-stone-600">({data.page2.latLon})</span></div>
                  <div><span>தமிழ் தேதி</span>: {data.page2.tamilDate}</div>
                </div>
                <div className="text-right">
                  <div><span>பக்ஷம் & திதி</span>: {data.page2.pakshaTithi}</div>
                  <div><span>யோகம்-கரணம்</span>: {data.page2.yogaKarana} | <span>திசை இருப்பு</span>: <b>{data.page2.dashaBalance}</b></div>
                </div>
              </div>
            </div>

            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7px] text-stone-500">
              <span>.</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 3: PLANET TABLE                                          */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-3-</span>

            <div>
              <div className="text-center font-black text-[10px] mb-1">
                {data.page3.heading || (isTa ? 'துல்லியமான நிராயன கிரக நிலைகள்' : 'ACCURATE NIRAYANA PLANETARY POSITIONS')}
              </div>

              <table className="w-full border-collapse text-[8px] leading-tight">
                <thead>
                  <tr className="border-b-[1.5px] border-black text-left">
                    <th className="py-0.5 px-1 w-[14%]">கிரகம்</th>
                    <th className="py-0.5 px-1 w-[13%] text-center">பாகை-கலை</th>
                    <th className="py-0.5 px-1 w-[15%]">நட்சத்திரம்</th>
                    <th className="py-0.5 px-1 w-[8%] text-center">பாதம்</th>
                    <th className="py-0.5 px-1 w-[14%]">நட்-அதிபதி</th>
                    <th className="py-0.5 px-1 w-[13%]">ராசி</th>
                    <th className="py-0.5 px-1 w-[13%] text-center">பாகை-கலை</th>
                    <th className="py-0.5 px-1 w-[10%] text-center">நிலை</th>
                  </tr>
                </thead>
                <tbody>
                  {data.page3.planetRows.map((r, idx) => (
                    <tr key={idx} className="border-b border-stone-200">
                      <td className="py-0.5 px-1 font-bold">{r.planet}</td>
                      <td className="py-0.5 px-1 font-mono font-bold text-center">{r.degMin1}</td>
                      <td className="py-0.5 px-1">{r.nakshatra}</td>
                      <td className="py-0.5 px-1 text-center font-bold">{r.pada}</td>
                      <td className="py-0.5 px-1">{r.lord}</td>
                      <td className="py-0.5 px-1">{r.rasi}</td>
                      <td className="py-0.5 px-1 font-mono font-bold text-center">{r.degMin2}</td>
                      <td className="py-0.5 px-1 text-center font-bold">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center text-[8px] font-bold mt-1.5 px-1">
                <div><span>பெயர்</span> : {data.page3.footerName}</div>
                <div><span>தேதி</span> : {data.page3.footerDate}</div>
                <div><span>அயனாம்சம்</span> : {data.page3.footerAyanamsha}</div>
              </div>
            </div>

            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7px] text-stone-500">
              <span>.</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 4: DASAVARGA AND STRENGTH                                */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-4-</span>

            <div>
              <div className="text-center font-black text-[9.5px] mb-1">
                {data.page4.heading || 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்'}
              </div>

              {/* Table A */}
              <table className="w-full border-collapse border border-stone-400 text-[7px] text-center mb-1">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-400 font-bold">
                    <th className="border border-stone-400 p-0.5 w-[16%] text-left">வர்க்கம்</th>
                    {['சூரி','சந்','செவ்','புத','குரு','சுக்','சனி','ராகு','கேது','லக்'].map((h, i) => (
                      <th key={i} className="border border-stone-400 p-0.5">{h}</th>
                    ))}
                    <th className="border border-stone-400 p-0.5 bg-emerald-50 text-emerald-800">சுப</th>
                    <th className="border border-stone-400 p-0.5 bg-rose-50 text-rose-800">அசுப</th>
                  </tr>
                </thead>
                <tbody>
                  {data.page4.tableA.map((row, rIdx) => {
                    const isTotal = rIdx >= 10;
                    return (
                      <tr key={rIdx} className={isTotal ? 'font-black bg-stone-50' : ''}>
                        <td className="border border-stone-400 p-0.5 text-left font-bold">{row.varga}</td>
                        {row.planets.map((pVal, pIdx) => (
                          <td key={pIdx} className="border border-stone-400 p-0.5">{pVal}</td>
                        ))}
                        <td className="border border-stone-400 p-0.5 font-bold text-emerald-800">{row.subha}</td>
                        <td className="border border-stone-400 p-0.5 font-bold text-rose-800">{row.asubha}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-[7px] text-center text-stone-600 mb-1">{data.page4.legend}</div>

              {/* Table B */}
              <table className="w-full border-collapse border border-stone-400 text-[7px] text-center">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-400 font-bold">
                    <th className="border border-stone-400 p-0.5 w-[16%] text-left">வர்க்கம்</th>
                    {['சூரி','சந்','செவ்','புத','குரு','சுக்','சனி','ராகு','கேது','லக்'].map((h, i) => (
                      <th key={i} className="border border-stone-400 p-0.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.page4.tableB.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-stone-400 p-0.5 text-left font-bold">{row.varga}</td>
                      {row.planets.map((pVal, pIdx) => (
                        <td key={pIdx} className="border border-stone-400 p-0.5">{pVal}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7px] text-stone-500">
              <span>.</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 5: SARVASHTAVARGA                                        */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-5-</span>

            <div>
              <div className="text-center font-black text-[9.5px] border-b border-black pb-0.5 mb-1">
                {data.page5.heading || 'சர்வாஷ்டவர்க்க பரல்கள் விவரம்..'}
              </div>

              {/* Sarvashtavarga Table */}
              <table className="w-full border-collapse border border-stone-400 text-[7px] text-center mb-1.5">
                <thead>
                  <tr className="bg-stone-100 font-bold border-b border-stone-400">
                    <th className="border border-stone-400 p-0.5 w-[14%] text-left">கிரகம்</th>
                    {['மேஷ','ரிஷ','மிது','கட','சிம்','கன்','துல','விரு','தனு','மக','கும்','மீன'].map((s, i) => (
                      <th key={i} className="border border-stone-400 p-0.5">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.page5.sarvaTable.map((row, idx) => {
                    const isTotal = idx === data.page5.sarvaTable.length - 1;
                    return (
                      <tr key={idx} className={isTotal ? 'font-black border-t-2 border-black bg-stone-50' : ''}>
                        <td className="border border-stone-400 p-0.5 text-left font-bold">{row.planet}</td>
                        {row.values.map((v, cIdx) => (
                          <td key={cIdx} className="border border-stone-400 p-0.5 font-mono">{v}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Bottom: Mini chart, strengths, directions */}
              <div className="grid grid-cols-[55mm_1fr_1fr] gap-2 items-start text-[7.5px]">
                <div>
                  {renderMiniSouthChart(data.page5.chartTotals, data.page5.grandTotal)}
                </div>
                <div className="space-y-0.5">
                  <div><span>கேந்திரம்</span>: <b>{data.page5.kendra}</b></div>
                  <div><span>பணபரம்</span>: <b>{data.page5.panaphara}</b></div>
                  <div><span>ஆபோக்லீயம்</span>: <b>{data.page5.apoklima}</b></div>
                  <div><span>உபசெயம்</span>: <b>{data.page5.upachaya}</b></div>
                  <div><span>திரிகோணம்</span>: <b>{data.page5.trikona}</b></div>
                  <div className="h-0.5"></div>
                  <div><span>வரவினம்</span>: <b>{data.page5.varavina}</b></div>
                  <div><span>செலவினம்</span>: <b>{data.page5.selavina}</b></div>
                </div>
                <div className="space-y-0.5">
                  <div><span>கிழக்கு</span>: <b>{data.page5.kizhakku}</b></div>
                  <div><span>மேற்கு</span>: <b>{data.page5.merku}</b></div>
                  <div><span>தெற்கு</span>: <b>{data.page5.therku}</b></div>
                  <div><span>வடக்கு</span>: <b>{data.page5.vadakku}</b></div>
                </div>
              </div>
            </div>

            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7px] text-stone-500">
              <span>.</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 6: DASHA-BHUKTI MATRIX                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-6-</span>

            <div>
              <div className="flex justify-between text-[8px] mb-0.5">
                <b>{data.page6.name}</b>
                <span></span>
              </div>
              <div className="text-center font-black text-[9px] mb-0.5">
                {data.page6.name} ஜாதகத்தில் திசை-புக்தி முடிவு விவரம்.
              </div>
              <div className="text-center text-[7.5px] font-semibold mb-1">
                ஜனன கால இருப்பு திசை: {data.page6.dashaBalanceText}
              </div>

              {/* 9x8 Matrix Table */}
              <table className="w-full border-collapse border border-stone-400 text-[6.5px] text-center font-mono">
                <thead>
                  <tr className="bg-stone-100 font-sans font-bold border-b border-stone-400">
                    <th className="border border-stone-400 p-0.5 text-left font-bold">புக்தி \ திசை</th>
                    {data.page6.dashaLords.map((l, lIdx) => (
                      <th key={lIdx} className="border border-stone-400 p-0.5">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.page6.bhuktiLords.map((bLord, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-stone-400 p-0.5 font-sans font-bold text-left bg-stone-50">{bLord}</td>
                      {data.page6.matrix[rIdx].map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`border border-stone-400 p-0.5 ${
                            cell.underlined ? 'underline font-bold text-[#7A1A22]' : ''
                          }`}
                        >
                          {cell.text}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-[6.5px] text-stone-600 space-y-0.5 mt-1 leading-tight">
                <div>1. அடிக்கோடிட்ட தேதிகள் யாவும் கிரகங்களின் திசை முடிவு தேதிகள் ஆகும்.</div>
                <div>2. தேதிகள் யாவும் ஒரு வருடத்திற்கு 365.25 நாட்களாக கணிதம் செய்யப்பட்டது.</div>
                <div>3. இடமிருந்து வலமாக திசை கிரகங்களும், மேலிருந்து கீழாக புத்தி கிரகங்களும் குறிக்கப்பட்டுள்ளது.</div>
              </div>
            </div>

            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7px] text-stone-500">
              <span>.</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 7: NUMEROLOGY                                            */}
        {/* ------------------------------------------------------------- */}
        <div className="a4-booklet-page bg-white text-black p-4 sm:p-6 print:p-0 shadow-lg print:shadow-none mx-auto max-w-[195mm] min-h-[275mm] box-border">
          <div
            className={`border-[3px] border-double border-black p-3 relative flex flex-col justify-between ${
              isCompact ? 'h-[120mm] max-h-[120mm] overflow-hidden' : 'min-h-[255mm]'
            }`}
          >
            <span className="absolute top-2 right-3 font-sans text-xs font-bold text-black">-7-</span>

            <div>
              <div className="text-center font-black text-[10px] mb-1.5">
                {data.page7.heading || 'எண் கணிதம் (நியூமராலஜி)'}
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8px] mb-2">
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">பெயர்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.name}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">ஆங்கில எழுத்து கூட்டல்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.englishLetterSum}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">பிறந்த தேதி</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.dobWeekday}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">தேதி (உடல்) எண்</span><span className="mr-1">:</span><span className="font-bold">{data.page7.bodyNumber}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">வருஷ (உயிர்) எண்</span><span className="mr-1">:</span><span className="font-bold">{data.page7.lifeNumber}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">அதிர்ஷ்ட எண்கள்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.luckyNumbers}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">அதிர்ஷ்ட தேதிகள்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.luckyDates}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">அதிர்ஷ்ட நிறங்கள்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.luckyColors}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">அதிர்ஷ்ட கற்கள்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.luckyGems}</span></div>
                <div className="flex items-baseline"><span className="w-24 font-bold shrink-0">மேன்மை தரும் தெய்வம்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.favorableDeity}</span></div>
                <div className="col-span-2 flex items-baseline"><span className="w-24 font-bold shrink-0">ஸ்தலங்கள்</span><span className="mr-1">:</span><span className="font-semibold">{data.page7.templesSouthIndia}</span></div>
              </div>

              {/* 2-Row Letter Table A to Z */}
              <table className="w-full border-collapse border border-stone-400 text-[7px] text-center font-mono">
                <thead>
                  <tr className="bg-stone-100 font-bold border-b border-stone-400">
                    {ALPHABETS.map((char, i) => (
                      <th key={i} className="border border-stone-400 p-0.5">{char}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {ALPHABETS.map((char, i) => (
                      <td key={i} className="border border-stone-400 p-0.5">{data.page7.letterNumbers[i] || ''}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-black pt-0.5 flex justify-between items-center text-[7.5px]">
              <span className="font-black text-[#7A1A22]">{data.page7.subham || 'சுபம்.'}</span>
              <span className="text-stone-500">.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Print Stylesheet for 7 Pages */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 6mm;
          }
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-booklet-page {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            max-width: 195mm !important;
            width: 100% !important;
            min-height: 275mm !important;
            break-after: page !important;
            page-break-after: always !important;
          }
        }
      `}</style>
    </div>
  );
}
