import React, { useState } from 'react';
import {
  Printer,
  Eraser,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  BookOpen,
  Check,
  Eye,
  Settings
} from 'lucide-react';
import {
  CoverPage,
  VinayagarStuthiPage,
  NavagrahaStothramPage,
  JananaVivaramPage,
  JananaNakshatraPage,
  RasiNavamsaPage,
  PlanetTablePage,
  FourChartsBhavaPage,
  ShadbalaPage,
  DasavargaPage,
  MahadashaPage,
  SarvashtavargaPage,
  NumerologyPage,
  BookletStylesheet
} from './HoroscopeBookletPages';

const PAGE_DEFS = [
  { id: 'p1', num: 1, titleTa: '1. முகப்பு அட்டை', titleEn: '1. Cover Page' },
  { id: 'p2', num: 2, titleTa: '2. விநாயகர் ஸ்துதி', titleEn: '2. Vinayagar Stuthi' },
  { id: 'p3', num: 3, titleTa: '3. நவக்கிரஹ ஸ்தோத்ரம்', titleEn: '3. Navagraha Stothram' },
  { id: 'p4', num: 4, titleTa: '4. ஜனன விவரம்', titleEn: '4. Birth Details' },
  { id: 'p5', num: 5, titleTa: '5. ஜனன நட்சத்திர விவரம்', titleEn: '5. Nakshatra Details' },
  { id: 'p6', num: 6, titleTa: '6. ராசி & நவாம்சக் கட்டங்கள்', titleEn: '6. Rasi & Navamsa Charts' },
  { id: 'p7', num: 7, titleTa: '7. நிராயன கிரக நிலைகள்', titleEn: '7. Planet Table' },
  { id: 'p8', num: 8, titleTa: '8. பாவ ஸ்புடம் (ஸ்ரீபதி முறை) & கட்டங்கள்', titleEn: '8. Sripati Bhavas & 4 Charts' },
  { id: 'p9', num: 9, titleTa: '9. ஜாதகத்தில் ஷட்பலம் ஆய்வு', titleEn: '9. Shadbala Analysis' },
  { id: 'p10', num: 10, titleTa: '10. தசவர்க்க அட்டவணை & பலம்', titleEn: '10. Dasavarga Table' },
  { id: 'p11', num: 11, titleTa: '11. திசை 1 - புக்திகள் & பரிகாரம்', titleEn: '11. 1st Mahadasha' },
  { id: 'p12', num: 12, titleTa: '12. திசை 2 - புக்திகள் & பரிகாரம்', titleEn: '12. 2nd Mahadasha' },
  { id: 'p13', num: 13, titleTa: '13. திசை 3 - புக்திகள் & பரிகாரம்', titleEn: '13. 3rd Mahadasha' },
  { id: 'p14', num: 14, titleTa: '14. திசை 4 - புக்திகள் & பரிகாரம்', titleEn: '14. 4th Mahadasha' },
  { id: 'p15', num: 15, titleTa: '15. திசை 5 - புக்திகள் & பரிகாரம்', titleEn: '15. 5th Mahadasha' },
  { id: 'p16', num: 16, titleTa: '16. திசை 6 - புக்திகள் & பரிகாரம்', titleEn: '16. 6th Mahadasha' },
  { id: 'p17', num: 17, titleTa: '17. திசை 7 - புக்திகள் & பரிகாரம்', titleEn: '17. 7th Mahadasha' },
  { id: 'p18', num: 18, titleTa: '18. திசை 8 - புக்திகள் & பரிகாரம்', titleEn: '18. 8th Mahadasha' },
  { id: 'p19', num: 19, titleTa: '19. திசை 9 - புக்திகள் & பரிகாரம்', titleEn: '19. 9th Mahadasha' },
  { id: 'p20', num: 20, titleTa: '20. சர்வாஷ்டவர்க்க பரல்கள் விவரம் (337)', titleEn: '20. Sarvashtavarga Table' },
  { id: 'p21', num: 21, titleTa: '21. எண் கணிதம் (நியூமராலஜி)', titleEn: '21. Chaldean Numerology' }
];

export default function HoroscopeBooklet21PageView({
  data = {},
  setData,
  isTa = true,
  onAutoFill,
  onClearAll,
  onPrint
}) {
  const [boxHeightMode, setBoxHeightMode] = useState('compact');
  const [selectedPages, setSelectedPages] = useState(() => {
    const map = {};
    PAGE_DEFS.forEach(p => { map[p.id] = true; });
    return map;
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editActiveTab, setEditActiveTab] = useState('p1');

  const togglePage = (id) => {
    setSelectedPages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllPages = (status) => {
    const next = {};
    PAGE_DEFS.forEach(p => { next[p.id] = status; });
    setSelectedPages(next);
  };

  const handleImageUpload = (pageKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setData(prev => {
        const copy = { ...prev };
        if (!copy[pageKey]) copy[pageKey] = {};
        copy[pageKey] = { ...copy[pageKey], img: evt.target.result };
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="booklet-container">
      <BookletStylesheet />

      {/* Screen Controls & Toolbar */}
      <div className="bg-white border-b border-stone-200 px-4 py-2.5 shadow-sm no-print mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-stone-600">
            {isTa ? 'அளவு:' : 'Height:'}
          </span>
          <button
            type="button"
            onClick={() => setBoxHeightMode(m => m === 'compact' ? 'full' : 'compact')}
            className="px-3 py-1 rounded-md border border-stone-300 font-semibold bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            {boxHeightMode === 'compact'
              ? (isTa ? 'சுருக்கமான வடிவம் (~120 mm)' : 'Compact Box (~120 mm)')
              : (isTa ? 'முழு பக்க வடிவம் (A4 Full)' : 'Full Page Box')}
          </button>

          <button
            type="button"
            onClick={() => setShowFilterDrawer(s => !s)}
            className={`px-3 py-1 rounded-md border transition-colors flex items-center gap-1 font-semibold ${
              showFilterDrawer ? 'bg-[#7A1A22] text-white border-[#7A1A22]' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isTa ? 'பக்கங்கள் தேர்வு (21)' : 'Page Filter (21)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEditDrawer(s => !s)}
            className={`px-3 py-1 rounded-md border transition-colors flex items-center gap-1 font-semibold ${
              showEditDrawer ? 'bg-[#7A1A22] text-white border-[#7A1A22]' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isTa ? 'விவரங்களை திருத்த' : 'Edit Booklet'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onAutoFill && (
            <button
              type="button"
              onClick={onAutoFill}
              className="px-3 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTa ? 'மறு கணிப்பு' : 'Re-calculate'}</span>
            </button>
          )}

          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-1 rounded-md bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5 text-stone-500" />
              <span>{isTa ? 'வெற்று படிவம்' : 'Clear Form'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onPrint || (() => window.print())}
            className="px-4 py-1.5 rounded-md bg-[#7A1A22] text-white font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#5C1017] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isTa ? 'அச்சு / PDF (21-பக்கம்)' : 'Print / Save PDF (21 P)'}</span>
          </button>
        </div>
      </div>

      {/* Page Selection Drawer */}
      {showFilterDrawer && (
        <div className="bg-white border border-stone-300 p-4 rounded-xl shadow-md no-print mb-4 mx-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-[#7A1A22]">
              {isTa ? 'அச்சிட வேண்டிய பக்கங்களைத் தேர்ந்தெடுக்கவும் (மொத்தம் 21 பக்கங்கள்):' : 'Select Pages to Include in 21-Page Booklet:'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectAllPages(true)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs"
              >
                {isTa ? 'அனைத்தும்' : 'Select All'}
              </button>
              <button
                type="button"
                onClick={() => selectAllPages(false)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs"
              >
                {isTa ? 'நீக்கு' : 'Deselect All'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
            {PAGE_DEFS.map(p => (
              <label key={p.id} className="flex items-center gap-1.5 cursor-pointer p-1 rounded hover:bg-stone-50">
                <input
                  type="checkbox"
                  checked={!!selectedPages[p.id]}
                  onChange={() => togglePage(p.id)}
                  className="rounded text-[#7A1A22] focus:ring-[#7A1A22]"
                />
                <span className={selectedPages[p.id] ? 'font-semibold text-stone-900' : 'text-stone-400'}>
                  {isTa ? p.titleTa : p.titleEn}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Pages Container */}
      <div className="pages-flow">
        {selectedPages['p1'] && (
          <CoverPage
            pageNum="-1-"
            data={data.p1}
            isTa={isTa}
            onImageUpload={(e) => handleImageUpload('p1', e)}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p2'] && (
          <VinayagarStuthiPage
            pageNum="-2-"
            data={data.p2}
            isTa={isTa}
            onImageUpload={(e) => handleImageUpload('p2', e)}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p3'] && (
          <NavagrahaStothramPage
            pageNum="-3-"
            data={data.p3}
            isTa={isTa}
            onImageUpload={(e) => handleImageUpload('p3', e)}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p4'] && (
          <JananaVivaramPage
            pageNum="-4-"
            data={data.p4}
            isTa={isTa}
            onImageUpload={(e) => handleImageUpload('p4', e)}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p5'] && (
          <JananaNakshatraPage
            pageNum="-5-"
            data={data.p5}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p6'] && (
          <RasiNavamsaPage
            pageNum="-6-"
            data={data.p6}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p7'] && (
          <PlanetTablePage
            pageNum="-7-"
            data={data.p7}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p8'] && (
          <FourChartsBhavaPage
            pageNum="-8-"
            data={data.p8}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p9'] && (
          <ShadbalaPage
            pageNum="-9-"
            data={data.p9}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p10'] && (
          <DasavargaPage
            pageNum="-10-"
            data={data.p10}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* 9 Mahadasha Pages (p11 to p19) */}
        {[11, 12, 13, 14, 15, 16, 17, 18, 19].map((pNum) => {
          const pKey = `p${pNum}`;
          if (!selectedPages[pKey] || !data[pKey]) return null;
          return (
            <MahadashaPage
              key={pKey}
              pageNum={`-${pNum}-`}
              pageKey={pKey}
              data={data[pKey]}
              isTa={isTa}
              onImageUpload={(e) => handleImageUpload(pKey, e)}
              boxHeightMode={boxHeightMode}
            />
          );
        })}

        {selectedPages['p20'] && (
          <SarvashtavargaPage
            pageNum="-20-"
            data={data.p20}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {selectedPages['p21'] && (
          <NumerologyPage
            pageNum="-21-"
            data={data.p21}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}
      </div>
    </div>
  );
}
