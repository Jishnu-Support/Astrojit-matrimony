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
  JananaVivaramPage,
  JananaNakshatraPage,
  RasiNavamsaPage,
  PlanetTablePage,
  FourChartsBhavaPage,
  Divisional2ChartPage,
  HoraChartPage,
  DasavargaPage,
  PlanetaryDignitiesAspectsPage,
  FullDashaAntaraPage,
  BavSingleFullPage,
  SarvashtavargaPage,
  NumerologyPage,
  BookletStylesheet
} from './HoroscopeBookletPages';

export const PAGE_DEFS_33 = [
  { id: 'p1', num: 1, titleTa: '1. முகப்பு & மூல விவரங்கள்', titleEn: '1. Cover Page' },
  { id: 'p2', num: 2, titleTa: '2. விநாயகர் ஸ்துதி', titleEn: '2. Vinayagar Stuthi' },
  { id: 'p3', num: 3, titleTa: '3. நவக்கிரக ஸ்தோத்திரம்', titleEn: '3. Navagraha Stothram' },
  { id: 'p4', num: 4, titleTa: '4. ஜனன விபரம் - பஞ்சாங்கம்', titleEn: '4. Birth Details & Panchangam' },
  { id: 'p5', num: 5, titleTa: '5. கணித விபரம் & லக்ன சுப/பாவர்கள்', titleEn: '5. Extended Computations' },
  { id: 'p6', num: 6, titleTa: '6. ராசி & நவாம்ச சக்கரங்கள்', titleEn: '6. Rasi & Navamsa Charts' },
  { id: 'p7', num: 7, titleTa: '7. துல்லியமான நிராயன கிரக நிலைகள்', titleEn: '7. Planet Longitudes Table' },
  { id: 'p8', num: 8, titleTa: '8. பாவ ஸ்புடம் (ஸ்ரீபதி) & பாவக சக்கரம்', titleEn: '8. Sripati Bhavas & 4 Charts' },
  { id: 'p9', num: 9, titleTa: '9. வர்க்கச் சக்கரங்கள்: திரேக்காணம் & சப்தாம்சம்', titleEn: '9. D3 & D7 Charts' },
  { id: 'p10', num: 10, titleTa: '10. வர்க்கச் சக்கரங்கள்: சஷ்டியாம்சம் & திரிம்சாம்சம்', titleEn: '10. D60 & D30 Charts' },
  { id: 'p11', num: 11, titleTa: '11. வர்க்கச் சக்கரங்கள்: தசாம்சம் & சோடசாம்சம்', titleEn: '11. D10 & D16 Charts' },
  { id: 'p12', num: 12, titleTa: '12. வர்க்கச் சக்கரங்கள்: சதுராம்சம் & துவாதசாம்சம்', titleEn: '12. D4 & D12 Charts' },
  { id: 'p13', num: 13, titleTa: '13. ஓரை சக்கரம் (D2 Hora Chart)', titleEn: '13. D2 Hora Chart' },
  { id: 'p14', num: 14, titleTa: '14. தசவர்க்கமும் பலமும் (அட்டவணை)', titleEn: '14. Dasavarga Strength Matrix' },
  { id: 'p15', num: 15, titleTa: '15. கிரகங்களின் நிலை, பார்வை, சேர்க்கை', titleEn: '15. Dignities & Aspects' },
  { id: 'p16', num: 16, titleTa: '16. திசை 1: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '16. 1st Dasa Anthara Schedule' },
  { id: 'p17', num: 17, titleTa: '17. திசை 2: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '17. 2nd Dasa Anthara Schedule' },
  { id: 'p18', num: 18, titleTa: '18. திசை 3: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '18. 3rd Dasa Anthara Schedule' },
  { id: 'p19', num: 19, titleTa: '19. திசை 4: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '19. 4th Dasa Anthara Schedule' },
  { id: 'p20', num: 20, titleTa: '20. திசை 5: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '20. 5th Dasa Anthara Schedule' },
  { id: 'p21', num: 21, titleTa: '21. திசை 6: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '21. 6th Dasa Anthara Schedule' },
  { id: 'p22', num: 22, titleTa: '22. திசை 7: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '22. 7th Dasa Anthara Schedule' },
  { id: 'p23', num: 23, titleTa: '23. திசை 8: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '23. 8th Dasa Anthara Schedule' },
  { id: 'p24', num: 24, titleTa: '24. திசை 9: புக்தி & அந்தரம் முடிவு விபரம்', titleEn: '24. 9th Dasa Anthara Schedule' },
  { id: 'p25', num: 25, titleTa: '25. சூரியன் அஷ்டவர்க்கச் சோதனை', titleEn: '25. Sun Ashtakavarga' },
  { id: 'p26', num: 26, titleTa: '26. சந்திரன் அஷ்டவர்க்கச் சோதனை', titleEn: '26. Moon Ashtakavarga' },
  { id: 'p27', num: 27, titleTa: '27. செவ்வாய் அஷ்டவர்க்கச் சோதனை', titleEn: '27. Mars Ashtakavarga' },
  { id: 'p28', num: 28, titleTa: '28. புதன் அஷ்டவர்க்கச் சோதனை', titleEn: '28. Mercury Ashtakavarga' },
  { id: 'p29', num: 29, titleTa: '29. குரு அஷ்டவர்க்கச் சோதனை', titleEn: '29. Jupiter Ashtakavarga' },
  { id: 'p30', num: 30, titleTa: '30. சுக்கிரன் அஷ்டவர்க்கச் சோதனை', titleEn: '30. Venus Ashtakavarga' },
  { id: 'p31', num: 31, titleTa: '31. சனி அஷ்டவர்க்கச் சோதனை', titleEn: '31. Saturn Ashtakavarga' },
  { id: 'p32', num: 32, titleTa: '32. சர்வ அஷ்டவர்க்க பரல்கள் விவரம் (337)', titleEn: '32. Sarvashtavarga Table' },
  { id: 'p33', num: 33, titleTa: '33. எண் கணிதம் (நியூமராலஜி)', titleEn: '33. Chaldean Numerology' }
];

export default function HoroscopeBooklet33PageView({
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
    PAGE_DEFS_33.forEach(p => { map[p.id] = true; });
    return map;
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const togglePage = (id) => {
    setSelectedPages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllPages = (status) => {
    const next = {};
    PAGE_DEFS_33.forEach(p => { next[p.id] = status; });
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
            <span>{isTa ? 'பக்கங்கள் தேர்வு (33)' : 'Page Filter (33)'}</span>
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
            <span>{isTa ? 'அச்சு / PDF (33-பக்கம்)' : 'Print / Save PDF (33 P)'}</span>
          </button>
        </div>
      </div>

      {/* Page Selection Drawer */}
      {showFilterDrawer && (
        <div className="bg-white border border-stone-300 p-4 rounded-xl shadow-md no-print mb-4 mx-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-[#7A1A22]">
              {isTa ? 'அச்சிட வேண்டிய பக்கங்களைத் தேர்ந்தெடுக்கவும் (மொத்தம் 33 பக்கங்கள்):' : 'Select Pages to Include in 33-Page Booklet:'}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            {PAGE_DEFS_33.map(p => (
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

        {/* Page 2: Vinayagar Stuthi */}
        {selectedPages['p2'] && (
          <VinayagarStuthiPage
            pageNum="-2-"
            data={data.p2}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 3: Navagraha Stothram */}
        {selectedPages['p3'] && (
          <NavagrahaStothramPage
            pageNum="-3-"
            data={data.p3}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 4: Janana Vivaram & Panchangam */}
        {selectedPages['p4'] && (
          <JananaVivaramPage
            pageNum="-4-"
            data={data.p4}
            isTa={isTa}
            onImageUpload={(e) => handleImageUpload('p4', e)}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 5: Extended Computations */}
        {selectedPages['p5'] && (
          <JananaNakshatraPage
            pageNum="-5-"
            data={data.p5}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 6: Rasi & Navamsa Charts */}
        {selectedPages['p6'] && (
          <RasiNavamsaPage
            pageNum="-6-"
            data={data.p6}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 7: Precise Planetary Longitudes */}
        {selectedPages['p7'] && (
          <PlanetTablePage
            pageNum="-7-"
            data={data.p7}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 8: Sripati Bhavas & 4 Charts */}
        {selectedPages['p8'] && (
          <FourChartsBhavaPage
            pageNum="-8-"
            data={data.p8}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 9: Divisional Charts D3 & D7 */}
        {selectedPages['p9'] && (
          <Divisional2ChartPage
            pageNum="-9-"
            data={data.p9}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 10: Divisional Charts D60 & D30 */}
        {selectedPages['p10'] && (
          <Divisional2ChartPage
            pageNum="-10-"
            data={data.p10}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 11: Divisional Charts D10 & D16 */}
        {selectedPages['p11'] && (
          <Divisional2ChartPage
            pageNum="-11-"
            data={data.p11}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 12: Divisional Charts D4 & D12 */}
        {selectedPages['p12'] && (
          <Divisional2ChartPage
            pageNum="-12-"
            data={data.p12}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 13: D2 Hora Chart */}
        {selectedPages['p13'] && (
          <HoraChartPage
            pageNum="-13-"
            data={data.p13}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 14: Dasavarga Strength Matrix */}
        {selectedPages['p14'] && (
          <DasavargaPage
            pageNum="-14-"
            data={data.p14}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 15: Planetary Dignities & Aspects */}
        {selectedPages['p15'] && (
          <PlanetaryDignitiesAspectsPage
            pageNum="-15-"
            data={data.p15}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Pages 16 to 24: 9 Vimshottari Mahadasha Full Antara Schedules */}
        {[16, 17, 18, 19, 20, 21, 22, 23, 24].map((pNum) => {
          const pKey = `p${pNum}`;
          if (!selectedPages[pKey] || !data[pKey]) return null;
          return (
            <FullDashaAntaraPage
              key={pKey}
              pageNum={`-${pNum}-`}
              data={data[pKey]}
              isTa={isTa}
              boxHeightMode={boxHeightMode}
            />
          );
        })}

        {/* Pages 25 to 31: 7 Individual Ashtakavarga Full Pages */}
        {[25, 26, 27, 28, 29, 30, 31].map((pNum) => {
          const pKey = `p${pNum}`;
          if (!selectedPages[pKey] || !data[pKey]) return null;
          return (
            <BavSingleFullPage
              key={pKey}
              pageNum={`-${pNum}-`}
              bav={data[pKey]}
              isTa={isTa}
              boxHeightMode={boxHeightMode}
            />
          );
        })}

        {/* Page 32: Sarvashtavarga Summary & SAV 337 Chart */}
        {selectedPages['p32'] && (
          <SarvashtavargaPage
            pageNum="-32-"
            data={data.p32}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}

        {/* Page 33: Chaldean Numerology */}
        {selectedPages['p33'] && (
          <NumerologyPage
            pageNum="-33-"
            data={data.p33}
            isTa={isTa}
            boxHeightMode={boxHeightMode}
          />
        )}
      </div>
    </div>
  );
}
