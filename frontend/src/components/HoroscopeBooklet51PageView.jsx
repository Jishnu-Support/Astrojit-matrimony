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
  JananaVivaramPage,
  JananaNakshatraPage,
  RasiNavamsaPage,
  PlanetTablePage,
  FourChartsBhavaPage,
  Divisional2ChartPage,
  HoraChartPage,
  ShadbalaPage,
  UpagrahasTablePage14,
  SpecialLagnasPage15,
  RelationshipsPage16,
  PanchadhaAvasthasPage17,
  AspectAnglesMatrixPage18,
  BhavaAspectAnglesMatrixPage19,
  DasavargaPage,
  PanchaPakshiPage21,
  MahadashaPage,
  PasakarTaraPage31,
  PlanetaryDignitiesAspectsPage,
  SevvaiDoshaPage33,
  FullDashaAntaraPage,
  BavSingleFullPage,
  SarvashtavargaPage,
  NumerologyPage,
  BookletStylesheet
} from './HoroscopeBookletPages';

export const PAGE_DEFS_51 = [
  { id: 'p1', num: 1, titleTa: '1. முகப்பு & மூல விவரங்கள்', titleEn: '1. Cover Page' },
  { id: 'p2', num: 2, titleTa: '2. விநாயகர் ஸ்துதி', titleEn: '2. Vinayagar Stuthi' },
  { id: 'p3', num: 3, titleTa: '3. ஜனன விபரம் - பஞ்சாங்கம்', titleEn: '3. Birth Details & Panchangam' },
  { id: 'p4', num: 4, titleTa: '4. ஜனன விபரம் - கணித நுணுக்கங்கள்', titleEn: '4. Extended Computations' },
  { id: 'p5', num: 5, titleTa: '5. ராசி & நவாம்ச சக்கரங்கள்', titleEn: '5. Rasi & Navamsa Charts' },
  { id: 'p6', num: 6, titleTa: '6. துல்லியமான நிராயன கிரக நிலைகள்', titleEn: '6. Planet Longitudes Table' },
  { id: 'p7', num: 7, titleTa: '7. பாவ ஸ்புடம் (ஸ்ரீபதி) & பாவக சக்கரம்', titleEn: '7. Sripati Bhavas & 4 Charts' },
  { id: 'p8', num: 8, titleTa: '8. வர்க்கச் சக்கரங்கள்: திரேக்காணம் & சப்தாம்சம்', titleEn: '8. D3 & D7 Charts' },
  { id: 'p9', num: 9, titleTa: '9. வர்க்கச் சக்கரங்கள்: சஷ்டியாம்சம் & திரிம்சாம்சம்', titleEn: '9. D60 & D30 Charts' },
  { id: 'p10', num: 10, titleTa: '10. வர்க்கச் சக்கரங்கள்: தசாம்சம் & சோடசாம்சம்', titleEn: '10. D10 & D16 Charts' },
  { id: 'p11', num: 11, titleTa: '11. வர்க்கச் சக்கரங்கள்: சதுராம்சம் & துவாதசாம்சம்', titleEn: '11. D4 & D12 Charts' },
  { id: 'p12', num: 12, titleTa: '12. வர்க்கச் சக்கரம்: ஓரை (D2 Hora Chart)', titleEn: '12. D2 Hora Chart' },
  { id: 'p13', num: 13, titleTa: '13. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு', titleEn: '13. Shadbala & Bhava Bala' },
  { id: 'p14', num: 14, titleTa: '14. உபகிரகங்கள் - குளிகாதி & தூமாதி ஸ்புடங்கள்', titleEn: '14. Upagrahas Tables' },
  { id: 'p15', num: 15, titleTa: '15. உப கிரகங்கள் - முக்கிய லக்னங்கள் & சக்கரம்', titleEn: '15. Special Lagnas & Upagraha Chart' },
  { id: 'p16', num: 16, titleTa: '16. நைசர்கிக & தற்கால நட்பு அட்டவணைகள்', titleEn: '16. Naisargika & Tatkalika Friendship' },
  { id: 'p17', num: 17, titleTa: '17. பஞ்சதா மைத்ரி & கிரக அவஸ்தைகள்', titleEn: '17. Panchadha Maitri & Avasthas' },
  { id: 'p18', num: 18, titleTa: '18. கிரகங்களுக்கிடையேயான பார்வை கோணங்கள்', titleEn: '18. Graha Aspect Matrix 9x9' },
  { id: 'p19', num: 19, titleTa: '19. பாவக-கிரகங்களிடையே பார்வை கோணங்கள்', titleEn: '19. Bhava Aspect Matrix 12x9' },
  { id: 'p20', num: 20, titleTa: '20. தசவர்க்கமும் பலமும் (அட்டவணை)', titleEn: '20. Dasavarga Table' },
  { id: 'p21', num: 21, titleTa: '21. பஞ்ச பட்சி விவரம் & ஆளும் தன்மைகள்', titleEn: '21. Pancha Pakshi Shastra Full Page' },
  { id: 'p22', num: 22, titleTa: '22. ராகு திசை - புக்தி & பரிகாரங்கள்', titleEn: '22. Rahu Mahadasha' },
  { id: 'p23', num: 23, titleTa: '23. குரு திசை - புக்தி & பரிகாரங்கள்', titleEn: '23. Jupiter Mahadasha' },
  { id: 'p24', num: 24, titleTa: '24. சனி திசை - புக்தி & பரிகாரங்கள்', titleEn: '24. Saturn Mahadasha' },
  { id: 'p25', num: 25, titleTa: '25. புதன் திசை - புக்தி & பரிகாரங்கள்', titleEn: '25. Mercury Mahadasha' },
  { id: 'p26', num: 26, titleTa: '26. கேது திசை - புக்தி & பரிகாரங்கள்', titleEn: '26. Ketu Mahadasha' },
  { id: 'p27', num: 27, titleTa: '27. சுக்கிரன் திசை - புக்தி & பரிகாரங்கள்', titleEn: '27. Venus Mahadasha' },
  { id: 'p28', num: 28, titleTa: '28. சூரியன் திசை - புக்தி & பரிகாரங்கள்', titleEn: '28. Sun Mahadasha' },
  { id: 'p29', num: 29, titleTa: '29. சந்திரன் திசை - புக்தி & பரிகாரங்கள்', titleEn: '29. Moon Mahadasha' },
  { id: 'p30', num: 30, titleTa: '30. செவ்வாய் திசை - புக்தி & பரிகாரங்கள்', titleEn: '30. Mars Mahadasha' },
  { id: 'p31', num: 31, titleTa: '31. பாசகர், போதகர், காரகர், வேதகர் & தாரா பலம்', titleEn: '31. Pasakar & Tara Balam' },
  { id: 'p32', num: 32, titleTa: '32. கிரகங்களின் நிலை, பார்வை, சேர்க்கை', titleEn: '32. Dignities & Aspects' },
  { id: 'p33', num: 33, titleTa: '33. செவ்வாய் தோஷ ஆய்வு', titleEn: '33. Sevvai Dosha Comprehensive Analysis' },
  { id: 'p34', num: 34, titleTa: '34. ராகு திசை: அந்தரம் முடிவு விபரம்', titleEn: '34. Rahu Antaras Schedule' },
  { id: 'p35', num: 35, titleTa: '35. குரு திசை: அந்தரம் முடிவு விபரம்', titleEn: '35. Jupiter Antaras Schedule' },
  { id: 'p36', num: 36, titleTa: '36. சனி திசை: அந்தரம் முடிவு விபரம்', titleEn: '36. Saturn Antaras Schedule' },
  { id: 'p37', num: 37, titleTa: '37. புதன் திசை: அந்தரம் முடிவு விபரம்', titleEn: '37. Mercury Antaras Schedule' },
  { id: 'p38', num: 38, titleTa: '38. கேது திசை: அந்தரம் முடிவு விபரம்', titleEn: '38. Ketu Antaras Schedule' },
  { id: 'p39', num: 39, titleTa: '39. சுக்கிரன் திசை: அந்தரம் முடிவு விபரம்', titleEn: '39. Venus Antaras Schedule' },
  { id: 'p40', num: 40, titleTa: '40. சூரியன் திசை: அந்தரம் முடிவு விபரம்', titleEn: '40. Sun Antaras Schedule' },
  { id: 'p41', num: 41, titleTa: '41. சந்திரன் திசை: அந்தரம் முடிவு விபரம்', titleEn: '41. Moon Antaras Schedule' },
  { id: 'p42', num: 42, titleTa: '42. செவ்வாய் திசை: அந்தரம் முடிவு விபரம்', titleEn: '42. Mars Antaras Schedule' },
  { id: 'p43', num: 43, titleTa: '43. சூரியன் அஷ்டவர்க்கச் சோதனை', titleEn: '43. Sun Ashtakavarga' },
  { id: 'p44', num: 44, titleTa: '44. சந்திரன் அஷ்டவர்க்கச் சோதனை', titleEn: '44. Moon Ashtakavarga' },
  { id: 'p45', num: 45, titleTa: '45. செவ்வாய் அஷ்டவர்க்கச் சோதனை', titleEn: '45. Mars Ashtakavarga' },
  { id: 'p46', num: 46, titleTa: '46. புதன் அஷ்டவர்க்கச் சோதனை', titleEn: '46. Mercury Ashtakavarga' },
  { id: 'p47', num: 47, titleTa: '47. குரு அஷ்டவர்க்கச் சோதனை', titleEn: '47. Jupiter Ashtakavarga' },
  { id: 'p48', num: 48, titleTa: '48. சுக்கிரன் அஷ்டவர்க்கச் சோதனை', titleEn: '48. Venus Ashtakavarga' },
  { id: 'p49', num: 49, titleTa: '49. சனி அஷ்டவர்க்கச் சோதனை', titleEn: '49. Saturn Ashtakavarga' },
  { id: 'p50', num: 50, titleTa: '50. சர்வ அஷ்டவர்க்க பரல்கள் விவரம் (337)', titleEn: '50. Sarvashtavarga Table' },
  { id: 'p51', num: 51, titleTa: '51. எண் கணிதம் (நியூமராலஜி - சாலடியன்)', titleEn: '51. Chaldean Numerology' }
];

export default function HoroscopeBooklet51PageView({
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
    PAGE_DEFS_51.forEach(p => { map[p.id] = true; });
    return map;
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const togglePage = (id) => {
    setSelectedPages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllPages = (status) => {
    const next = {};
    PAGE_DEFS_51.forEach(p => { next[p.id] = status; });
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

  const activeCount = Object.values(selectedPages).filter(Boolean).length;

  return (
    <div className="booklet-wrapper">
      <BookletStylesheet />

      {/* Screen Toolbar */}
      <div className="booklet-toolbar no-print">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-bold text-sm text-[#7A1A22] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7A1A22] inline-block animate-pulse" />
            <span>{isTa ? 'ஜாதக ஏடு (A4 - 51 பக்க முழு புத்தக வடிவம்)' : 'Janana Jathagam Booklet (51 Pages Complete Master Edition)'}</span>
          </div>
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
            {isTa ? `${activeCount} / 51 பக்கங்கள் அச்சிட தயாராக உள்ளது` : `${activeCount} of 51 pages queued`}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Box Height Toggle */}
          <div className="flex items-center bg-stone-100 rounded p-0.5 border border-stone-300 text-xs">
            <button
              type="button"
              onClick={() => setBoxHeightMode('compact')}
              className={`px-2 py-1 rounded font-semibold transition-colors ${
                boxHeightMode === 'compact' ? 'bg-[#7A1A22] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
              title="Classic ~120mm Box Height matching traditional horoscope leaflets"
            >
              {isTa ? 'அளவான கட்டம் (~120மிமீ)' : 'Compact Box (~120mm)'}
            </button>
            <button
              type="button"
              onClick={() => setBoxHeightMode('full')}
              className={`px-2 py-1 rounded font-semibold transition-colors ${
                boxHeightMode === 'full' ? 'bg-[#7A1A22] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
              title="Full A4 page height border (edge-to-edge frame)"
            >
              {isTa ? 'முழு பக்க கட்டம்' : 'Full Page Height'}
            </button>
          </div>

          {/* Filter Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="px-2.5 py-1 text-xs border border-stone-300 rounded bg-white hover:bg-stone-50 text-stone-800 font-medium flex items-center gap-1 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#7A1A22]" />
            <span>{isTa ? 'பக்கங்கள் தேர்வு' : 'Filter Pages'}</span>
          </button>

          {/* Auto Fill / Re-calc */}
          {onAutoFill && (
            <button
              type="button"
              onClick={onAutoFill}
              className="px-2.5 py-1 text-xs border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded font-medium flex items-center gap-1 shadow-xs"
              title="Re-compute all 51 pages live with exact Thirukanitha planetary algorithms"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{isTa ? 'மீண்டும் கணிக்க' : 'Re-calculate'}</span>
            </button>
          )}

          {/* Clear Form */}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-2 py-1 text-xs border border-stone-300 bg-white hover:bg-rose-50 text-rose-800 rounded font-medium flex items-center gap-1 shadow-xs"
              title="Clear all fields to blank template"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{isTa ? 'படிவம் அழிக்க' : 'Clear Form'}</span>
            </button>
          )}

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={onPrint || (() => window.print())}
            className="px-3.5 py-1 text-xs font-bold bg-[#7A1A22] hover:bg-[#60141A] text-white rounded flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isTa ? 'அச்சு / PDF (51-பக்கம்)' : 'Save as PDF / Print'}</span>
          </button>
        </div>
      </div>

      {/* Page Filter Drawer */}
      {showFilterDrawer && (
        <div className="no-print bg-amber-50/70 border border-amber-200 rounded-lg p-3 mb-4 text-xs">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-amber-200">
            <span className="font-bold text-[#7A1A22]">
              {isTa ? 'அச்சிட வேண்டிய பக்கங்களை தேர்வு செய்க (மொத்தம் 51):' : 'Select Pages to Print (Total 51):'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectAllPages(true)}
                className="underline text-emerald-800 hover:text-emerald-950 font-semibold"
              >
                {isTa ? 'அனைத்தும்' : 'Select All'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => selectAllPages(false)}
                className="underline text-rose-800 hover:text-rose-950 font-semibold"
              >
                {isTa ? 'நீக்குக' : 'Deselect All'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {PAGE_DEFS_51.map(p => (
              <label
                key={p.id}
                className={`flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer border transition-colors ${
                  selectedPages[p.id] ? 'bg-white border-amber-400 font-medium' : 'bg-transparent border-transparent opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selectedPages[p.id]}
                  onChange={() => togglePage(p.id)}
                  className="rounded text-[#7A1A22] focus:ring-0"
                />
                <span className="truncate">{isTa ? p.titleTa : p.titleEn}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* RENDER PAGES 1 TO 51 */}
      <div className="booklet-pages-container">
        {selectedPages.p1 && <CoverPage pageNum="-1-" data={data.p1} isTa={isTa} onImageUpload={(e) => handleImageUpload('p1', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p2 && <VinayagarStuthiPage pageNum="-2-" data={data.p2} isTa={isTa} onImageUpload={(e) => handleImageUpload('p2', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p3 && <JananaVivaramPage pageNum="-3-" data={data.p3} isTa={isTa} onImageUpload={(e) => handleImageUpload('p3', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p4 && <JananaNakshatraPage pageNum="-4-" data={data.p4} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p5 && <RasiNavamsaPage pageNum="-5-" data={data.p5} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p6 && <PlanetTablePage pageNum="-6-" data={data.p6} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p7 && <FourChartsBhavaPage pageNum="-7-" data={data.p7} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p8 && <Divisional2ChartPage pageNum="-8-" data={data.p8} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p9 && <Divisional2ChartPage pageNum="-9-" data={data.p9} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p10 && <Divisional2ChartPage pageNum="-10-" data={data.p10} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p11 && <Divisional2ChartPage pageNum="-11-" data={data.p11} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p12 && <HoraChartPage pageNum="-12-" data={data.p12} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p13 && <ShadbalaPage pageNum="-13-" data={data.p13} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p14 && <UpagrahasTablePage14 pageNum="-14-" data={data.p14} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p15 && <SpecialLagnasPage15 pageNum="-15-" data={data.p15} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p16 && <RelationshipsPage16 pageNum="-16-" data={data.p16} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p17 && <PanchadhaAvasthasPage17 pageNum="-17-" data={data.p17} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p18 && <AspectAnglesMatrixPage18 pageNum="-18-" data={data.p18} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p19 && <BhavaAspectAnglesMatrixPage19 pageNum="-19-" data={data.p19} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p20 && <DasavargaPage pageNum="-20-" data={data.p20} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p21 && <PanchaPakshiPage21 pageNum="-21-" data={data.p21} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p22 && <MahadashaPage pageNum="-22-" pageKey="p22" data={data.p22} isTa={isTa} onImageUpload={(e) => handleImageUpload('p22', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p23 && <MahadashaPage pageNum="-23-" pageKey="p23" data={data.p23} isTa={isTa} onImageUpload={(e) => handleImageUpload('p23', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p24 && <MahadashaPage pageNum="-24-" pageKey="p24" data={data.p24} isTa={isTa} onImageUpload={(e) => handleImageUpload('p24', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p25 && <MahadashaPage pageNum="-25-" pageKey="p25" data={data.p25} isTa={isTa} onImageUpload={(e) => handleImageUpload('p25', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p26 && <MahadashaPage pageNum="-26-" pageKey="p26" data={data.p26} isTa={isTa} onImageUpload={(e) => handleImageUpload('p26', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p27 && <MahadashaPage pageNum="-27-" pageKey="p27" data={data.p27} isTa={isTa} onImageUpload={(e) => handleImageUpload('p27', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p28 && <MahadashaPage pageNum="-28-" pageKey="p28" data={data.p28} isTa={isTa} onImageUpload={(e) => handleImageUpload('p28', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p29 && <MahadashaPage pageNum="-29-" pageKey="p29" data={data.p29} isTa={isTa} onImageUpload={(e) => handleImageUpload('p29', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p30 && <MahadashaPage pageNum="-30-" pageKey="p30" data={data.p30} isTa={isTa} onImageUpload={(e) => handleImageUpload('p30', e)} boxHeightMode={boxHeightMode} />}
        {selectedPages.p31 && <PasakarTaraPage31 pageNum="-31-" data={data.p31} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p32 && <PlanetaryDignitiesAspectsPage pageNum="-32-" data={data.p32} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p33 && <SevvaiDoshaPage33 pageNum="-33-" data={data.p33} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p34 && <FullDashaAntaraPage pageNum="-34-" data={data.p34} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p35 && <FullDashaAntaraPage pageNum="-35-" data={data.p35} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p36 && <FullDashaAntaraPage pageNum="-36-" data={data.p36} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p37 && <FullDashaAntaraPage pageNum="-37-" data={data.p37} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p38 && <FullDashaAntaraPage pageNum="-38-" data={data.p38} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p39 && <FullDashaAntaraPage pageNum="-39-" data={data.p39} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p40 && <FullDashaAntaraPage pageNum="-40-" data={data.p40} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p41 && <FullDashaAntaraPage pageNum="-41-" data={data.p41} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p42 && <FullDashaAntaraPage pageNum="-42-" data={data.p42} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p43 && <BavSingleFullPage pageNum="-43-" bav={data.p43} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p44 && <BavSingleFullPage pageNum="-44-" bav={data.p44} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p45 && <BavSingleFullPage pageNum="-45-" bav={data.p45} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p46 && <BavSingleFullPage pageNum="-46-" bav={data.p46} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p47 && <BavSingleFullPage pageNum="-47-" bav={data.p47} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p48 && <BavSingleFullPage pageNum="-48-" bav={data.p48} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p49 && <BavSingleFullPage pageNum="-49-" bav={data.p49} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p50 && <SarvashtavargaPage pageNum="-50-" data={data.p50} isTa={isTa} boxHeightMode={boxHeightMode} />}
        {selectedPages.p51 && <NumerologyPage pageNum="-51-" data={data.p51} isTa={isTa} boxHeightMode={boxHeightMode} />}
      </div>
    </div>
  );
}
