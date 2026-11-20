import React, { useState } from 'react';
import {
  Printer,
  Eraser,
  Sparkles,
  Eye
} from 'lucide-react';
import {
  CoverPage,
  VinayagarStuthiPage,
  NavagrahaStothramPage,
  JananaVivaramPage25,
  PlanetTableRasiNavamsaPage,
  DasavargaWithChartsPage,
  DivisionalChartsPage1,
  DivisionalChartsPage2,
  ShadbalaPanchaPakshiPage,
  UpagrahasSpecialLagnasPage,
  RelationshipsAvasthasPage,
  AspectAnglesPage,
  CompactDashaPage,
  PasakarTaraSevvaiPage,
  AntaraDatesPage,
  BavPairPage,
  NumerologyPage,
  BookletStylesheet
} from './HoroscopeBookletPages';

export const PAGE_DEFS_25 = [
  { id: 'p1', num: 1, titleTa: '1. முகப்பு அட்டை', titleEn: '1. Cover Page' },
  { id: 'p2', num: 2, titleTa: '2. நவக்கிரக ஸ்தோத்திரம்', titleEn: '2. Navagraha Stothram' },
  { id: 'p3', num: 3, titleTa: '3. விநாயகர் ஸ்துதி', titleEn: '3. Vinayagar Stuthi' },
  { id: 'p4', num: 4, titleTa: '4. ஜனன விவரம் & நட்சத்திர விபரம்', titleEn: '4. Birth & Nakshatra Details' },
  { id: 'p5', num: 5, titleTa: '5. கிரகாதிபத்திய அட்டவணை & ராசி/நவாம்சம்', titleEn: '5. Planet Table & Rasi/Navamsa' },
  { id: 'p6', num: 6, titleTa: '6. தசவர்க்க அட்டவணை & ஸ்ரீபதி பாவகம்', titleEn: '6. Dasavarga & Sripati Bhavas' },
  { id: 'p7', num: 7, titleTa: '7. வர்க்கச் சக்கரங்கள் 1 (D3, D7, D60, D30)', titleEn: '7. Divisional Charts 1' },
  { id: 'p8', num: 8, titleTa: '8. வர்க்கச் சக்கரங்கள் 2 (D10, D16, D4, D12)', titleEn: '8. Divisional Charts 2' },
  { id: 'p9', num: 9, titleTa: '9. ஷட்பலம் & பஞ்ச பட்சி சாஸ்திரம்', titleEn: '9. Shadbala & Pancha Pakshi' },
  { id: 'p10', num: 10, titleTa: '10. உபக்கிரகங்கள் & விசேஷ லக்னங்கள்', titleEn: '10. Upagrahas & Special Lagnas' },
  { id: 'p11', num: 11, titleTa: '11. கிரக மைத்திரி & அவஸ்தைகள்', titleEn: '11. Relationships & Avasthas' },
  { id: 'p12', num: 12, titleTa: '12. திருஷ்டி கோணங்கள் (கிரகம் & பாவம்)', titleEn: '12. Aspect Angles' },
  { id: 'p13', num: 13, titleTa: '13. திசை & புக்தி அட்டவணை 1 (திசை 1,2,3)', titleEn: '13. Mahadashas 1-3' },
  { id: 'p14', num: 14, titleTa: '14. திசை & புக்தி அட்டவணை 2 (திசை 4,5,6)', titleEn: '14. Mahadashas 4-6' },
  { id: 'p15', num: 15, titleTa: '15. திசை & புக்தி அட்டவணை 3 (திசை 7,8,9)', titleEn: '15. Mahadashas 7-9' },
  { id: 'p16', num: 16, titleTa: '16. பாசகர் / தாரா பலம் / செவ்வாய் தோஷம்', titleEn: '16. Pasakar & Sevvai Dosha' },
  { id: 'p17', num: 17, titleTa: '17. அந்தர முடிவு தேதிகள் 1 (திசை 1, 2)', titleEn: '17. Antara Dates 1' },
  { id: 'p18', num: 18, titleTa: '18. அந்தர முடிவு தேதிகள் 2 (திசை 3, 4)', titleEn: '18. Antara Dates 2' },
  { id: 'p19', num: 19, titleTa: '19. அந்தர முடிவு தேதிகள் 3 (திசை 5, 6)', titleEn: '19. Antara Dates 3' },
  { id: 'p20', num: 20, titleTa: '20. அந்தர முடிவு தேதிகள் 4 (திசை 7, 8)', titleEn: '20. Antara Dates 4' },
  { id: 'p21', num: 21, titleTa: '21. அஷ்டகவர்க்க பரல்கள் - சூரியன் & சந்திரன்', titleEn: '21. BAV Sun & Moon' },
  { id: 'p22', num: 22, titleTa: '22. அஷ்டகவர்க்க பரல்கள் - செவ்வாய் & புதன்', titleEn: '22. BAV Mars & Mercury' },
  { id: 'p23', num: 23, titleTa: '23. அஷ்டகவர்க்க பரல்கள் - குரு & சுக்கிரன்', titleEn: '23. BAV Jupiter & Venus' },
  { id: 'p24', num: 24, titleTa: '24. சனி அஷ்டகவர்க்கம் & சர்வ அஷ்டகவர்க்கம் 337', titleEn: '24. Saturn BAV & SAV 337' },
  { id: 'p25', num: 25, titleTa: '25. எண் கணிதம் (நியூமராலஜி)', titleEn: '25. Chaldean Numerology' }
];

export default function HoroscopeBooklet25PageView({
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
    PAGE_DEFS_25.forEach(p => { map[p.id] = true; });
    return map;
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const togglePage = (id) => {
    setSelectedPages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllPages = (status) => {
    const next = {};
    PAGE_DEFS_25.forEach(p => { next[p.id] = status; });
    setSelectedPages(next);
  };

  const handleImageUpload = (pageKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (setData) {
        setData(prev => {
          const copy = { ...prev };
          if (!copy[pageKey]) copy[pageKey] = {};
          copy[pageKey] = { ...copy[pageKey], img: evt.target.result };
          return copy;
        });
      }
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
            className="px-3 py-1 rounded-md border border-stone-300 font-semibold bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {boxHeightMode === 'compact'
              ? (isTa ? 'சுருக்கமான வடிவம் (~120 mm)' : 'Compact Box (~120 mm)')
              : (isTa ? 'முழு பக்க வடிவம் (A4 Full)' : 'Full Page Box')}
          </button>

          <button
            type="button"
            onClick={() => setShowFilterDrawer(s => !s)}
            className={`px-3 py-1 rounded-md border transition-colors flex items-center gap-1 font-semibold cursor-pointer ${
              showFilterDrawer ? 'bg-[#7A1A22] text-white border-[#7A1A22]' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isTa ? 'பக்கங்கள் தேர்வு (25)' : 'Page Filter (25)'}</span>
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
            <span>{isTa ? 'அச்சு / PDF (25-பக்கம்)' : 'Print / Save PDF (25 P)'}</span>
          </button>
        </div>
      </div>

      {/* Page Selection Drawer */}
      {showFilterDrawer && (
        <div className="bg-white border border-stone-300 p-4 rounded-xl shadow-md no-print mb-4 mx-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-[#7A1A22]">
              {isTa ? 'அச்சிட வேண்டிய பக்கங்களைத் தேர்ந்தெடுக்கவும் (மொத்தம் 25 பக்கங்கள்):' : 'Select Pages to Include in 25-Page Booklet:'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectAllPages(true)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs cursor-pointer"
              >
                {isTa ? 'அனைத்தும்' : 'Select All'}
              </button>
              <button
                type="button"
                onClick={() => selectAllPages(false)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs cursor-pointer"
              >
                {isTa ? 'நீக்கு' : 'Deselect All'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
            {PAGE_DEFS_25.map(p => (
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
        {/* Page 1: Cover */}
        {selectedPages['p1'] && (
          <CoverPage
            pageNum="-1-"
            data={data.p1}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 2: Navagraha Stothram */}
        {selectedPages['p2'] && (
          <NavagrahaStothramPage
            pageNum="-2-"
            data={data.p2}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 3: Vinayagar Stuthi */}
        {selectedPages['p3'] && (
          <VinayagarStuthiPage
            pageNum="-3-"
            data={data.p3}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 4: Janana Vivaram & Nakshatra */}
        {selectedPages['p4'] && (
          <JananaVivaramPage25
            pageNum="-4-"
            data={data.p4}
            isTa={isTa}
            onImageUpload={(e) => handleImageUpload('p4', e)}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 5: Planet Table & Rasi / Navamsa */}
        {selectedPages['p5'] && (
          <PlanetTableRasiNavamsaPage
            pageNum="-5-"
            data={data.p5}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 6: Dasavarga & Sripati Bhavas */}
        {selectedPages['p6'] && (
          <DasavargaWithChartsPage
            pageNum="-6-"
            data={data.p6}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 7: Divisional Charts 1 (D3, D7, D60, D30) */}
        {selectedPages['p7'] && (
          <DivisionalChartsPage1
            pageNum="-7-"
            data={data.p7}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 8: Divisional Charts 2 (D10, D16, D4, D12) */}
        {selectedPages['p8'] && (
          <DivisionalChartsPage2
            pageNum="-8-"
            data={data.p8}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 9: Shadbala & Pancha Pakshi */}
        {selectedPages['p9'] && (
          <ShadbalaPanchaPakshiPage
            pageNum="-9-"
            data={data.p9}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 10: Upagrahas & Special Lagnas */}
        {selectedPages['p10'] && (
          <UpagrahasSpecialLagnasPage
            pageNum="-10-"
            data={data.p10}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 11: Relationships & Avasthas */}
        {selectedPages['p11'] && (
          <RelationshipsAvasthasPage
            pageNum="-11-"
            data={data.p11}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 12: Aspect Angles */}
        {selectedPages['p12'] && (
          <AspectAnglesPage
            pageNum="-12-"
            data={data.p12}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 13: Mahadashas 1-3 */}
        {selectedPages['p13'] && (
          <CompactDashaPage
            pageNum="-13-"
            data={data.p13}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 14: Mahadashas 4-6 */}
        {selectedPages['p14'] && (
          <CompactDashaPage
            pageNum="-14-"
            data={data.p14}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 15: Mahadashas 7-9 */}
        {selectedPages['p15'] && (
          <CompactDashaPage
            pageNum="-15-"
            data={data.p15}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 16: Pasakar / Tara Balam / Sevvai Dosha */}
        {selectedPages['p16'] && (
          <PasakarTaraSevvaiPage
            pageNum="-16-"
            data={data.p16}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 17: Antara Dates 1 (D1 & D2) */}
        {selectedPages['p17'] && (
          <AntaraDatesPage
            pageNum="-17-"
            data={data.p17}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 18: Antara Dates 2 (D3 & D4) */}
        {selectedPages['p18'] && (
          <AntaraDatesPage
            pageNum="-18-"
            data={data.p18}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 19: Antara Dates 3 (D5 & D6) */}
        {selectedPages['p19'] && (
          <AntaraDatesPage
            pageNum="-19-"
            data={data.p19}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 20: Antara Dates 4 (D7 & D8) */}
        {selectedPages['p20'] && (
          <AntaraDatesPage
            pageNum="-20-"
            data={data.p20}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 21: BAV Sun & Moon */}
        {selectedPages['p21'] && (
          <BavPairPage
            pageNum="-21-"
            topData={data.p21?.top}
            bottomData={data.p21?.bottom}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 22: BAV Mars & Mercury */}
        {selectedPages['p22'] && (
          <BavPairPage
            pageNum="-22-"
            topData={data.p22?.top}
            bottomData={data.p22?.bottom}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 23: BAV Jupiter & Venus */}
        {selectedPages['p23'] && (
          <BavPairPage
            pageNum="-23-"
            topData={data.p23?.top}
            bottomData={data.p23?.bottom}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 24: Saturn BAV & SAV 337 */}
        {selectedPages['p24'] && (
          <BavPairPage
            pageNum="-24-"
            topData={data.p24?.top}
            bottomData={data.p24?.bottom}
            isSaturnSav={true}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 25: Numerology */}
        {selectedPages['p25'] && (
          <NumerologyPage
            pageNum="-25-"
            data={data.p25}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}
      </div>
    </div>
  );
}
