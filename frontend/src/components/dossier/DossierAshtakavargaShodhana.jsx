import React from 'react';
import SouthIndianChart from '../SouthIndianChart';
import { DOSSIER_TRANSLATIONS, translatePlanet, getShortRashiHeaders } from './dossierI18n';

export default function DossierAshtakavargaShodhana({
  planetShodhana = {},
  pageNumber = 43,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const rashiHeaders = getShortRashiHeaders(lang);

  const {
    name = 'Sun',
    tamil = 'சூரியன்',
    gunakara = 5,
    contributionGrid = [],
    bindus = [4, 5, 3, 4, 6, 3, 4, 3, 5, 4, 4, 3],
    trikona = [1, 2, 0, 1, 3, 0, 1, 0, 2, 1, 1, 0],
    ekadhipatya = [1, 1, 0, 1, 3, 0, 1, 0, 2, 1, 1, 0],
    bavGrid = {},
    trikonaGrid = {},
    ekadhipatyaGrid = {},
    shodhyaPinda = { rashiPinda: 134, grahaPinda: 130, totalShodhyaPinda: 264 }
  } = planetShodhana || {};

  const localizedPlanet = translatePlanet(tamil || name, lang);

  const safeBindus = Array.isArray(bindus) ? bindus : [];
  const safeTrikona = Array.isArray(trikona) ? trikona : [];
  const safeEkadhipatya = Array.isArray(ekadhipatya) ? ekadhipatya : [];
  const safeShodhya = shodhyaPinda || { rashiPinda: 0, grahaPinda: 0, totalShodhyaPinda: 0 };

  const totalBindus = safeBindus.reduce((a, b) => a + b, 0);
  const totalTrikona = safeTrikona.reduce((a, b) => a + b, 0);
  const totalEkadhipatya = safeEkadhipatya.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border-2 border-slate-900 p-3 sm:p-6 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break font-serif">
      {/* Title */}
      <div className="text-center border-b-2 border-slate-900 pb-2">
        <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wide">
          {localizedPlanet} {lang === 'ta' ? 'அஷ்டகவர்க்கச் சோதனை.' : 'Ashtakavarga Shodhana'}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-4">
        {/* 1. Full 8x12 Contribution Matrix (Matching Classical Thirukanitha Page 43) */}
        <div>
          <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">
            {lang === 'ta' ? 'அஷ்டகவர்க்க பரல்கள் விரிவு அட்டவணை' : '8-Fold Ashtakavarga Contribution Grid'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10.5px] border border-slate-900 text-center">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                  <th className="py-1 px-2 border-r border-slate-900 text-left pl-2">
                    {lang === 'ta' ? 'கிரகம்' : 'Contributor'}
                  </th>
                  {rashiHeaders.map((r, i) => (
                    <th key={i} className="py-1 px-1 border-r border-slate-900">{r}</th>
                  ))}
                  <th className="py-1 px-1.5 bg-amber-200 text-slate-950 font-black">
                    {lang === 'ta' ? 'மொ' : 'Tot'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {contributionGrid && contributionGrid.length > 0 ? (
                  contributionGrid.map((row, rIdx) => {
                    const pointsArr = Array.isArray(row.points) ? row.points : (Array.isArray(row.bindus) ? row.bindus : []);
                    const rowSum = pointsArr.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={rIdx} className={`border-b border-slate-200 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="py-1 px-2 font-bold text-slate-900 text-left border-r border-slate-200">
                          {translatePlanet(row.tamilContributor || row.contributor, lang)}
                        </td>
                        {pointsArr.map((pt, cIdx) => (
                          <td key={cIdx} className="py-1 px-1 font-mono border-r border-slate-200">
                            {pt}
                          </td>
                        ))}
                        <td className="py-1 px-1.5 font-mono font-bold text-slate-900 bg-amber-50/30">
                          {rowSum}
                        </td>
                      </tr>
                    );
                  })
                ) : null}

                {/* Total BAV Bindus Row */}
                <tr className="bg-amber-200/80 border-t-2 border-slate-900 font-black text-slate-950">
                  <td className="py-1 px-2 text-left border-r border-slate-900">
                    {lang === 'ta' ? 'மொத்தம்' : 'Total (BAV)'}
                  </td>
                  {safeBindus.map((b, i) => (
                    <td key={i} className="py-1 px-1 font-mono font-black border-r border-slate-900">
                      {b}
                    </td>
                  ))}
                  <td className="py-1 px-1.5 font-mono font-black text-amber-950 bg-amber-300">
                    {totalBindus}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Three South Indian Chakras Side-by-Side: BAV, Trikona, Ekadhipatya */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border border-slate-900 rounded-xl p-3 bg-amber-50/20 items-center text-center">
          {/* Chart 1: BAV */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-900 mb-0.5">
              {localizedPlanet} {lang === 'ta' ? 'பின்னஷ்டகவர்க்கம்' : 'BAV'}
            </span>
            <span className="text-[10px] text-amber-900 font-mono font-bold mb-1">
              ({totalBindus} {lang === 'ta' ? 'பரல்கள்' : 'Bindus'})
            </span>
            <div className="w-full max-w-[200px]">
              <SouthIndianChart gridData={bavGrid} chartType="ashtakavarga" lang={lang} title="" />
            </div>
          </div>

          {/* Chart 2: Trikona Shodhana */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-900 mb-0.5">
              {localizedPlanet} {lang === 'ta' ? 'திரிகோண சோதனை' : 'Trikona Shodhana'}
            </span>
            <span className="text-[10px] text-emerald-900 font-mono font-bold mb-1">
              ({totalTrikona} {lang === 'ta' ? 'பரல்கள்' : 'Bindus'})
            </span>
            <div className="w-full max-w-[200px]">
              <SouthIndianChart gridData={trikonaGrid} chartType="ashtakavarga" lang={lang} title="" />
            </div>
          </div>

          {/* Chart 3: Ekadhipatya Shodhana */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-900 mb-0.5">
              {localizedPlanet} {lang === 'ta' ? 'ஏகாதிபத்ய சோதனை' : 'Ekadhipatya Shodhana'}
            </span>
            <span className="text-[10px] text-rose-900 font-mono font-bold mb-1">
              ({totalEkadhipatya} {lang === 'ta' ? 'பரல்கள்' : 'Bindus'})
            </span>
            <div className="w-full max-w-[200px]">
              <SouthIndianChart gridData={ekadhipatyaGrid} chartType="ashtakavarga" lang={lang} title="" />
            </div>
          </div>
        </div>

        {/* 3. Bottom Summary Strip (Matching Exact Reference PDF Page 43) */}
        <div className="border-2 border-slate-900 rounded-xl p-3 bg-amber-50/70 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-white border border-slate-300 rounded-lg">
              <span className="text-[11px] text-slate-600 block">
                {lang === 'ta' ? 'கிரக குணாகாரம்' : 'Graha Gunakara'}
              </span>
              <strong className="text-base font-black text-slate-950 font-mono">
                {gunakara}
              </strong>
            </div>

            <div className="p-2 bg-white border border-slate-300 rounded-lg">
              <span className="text-[11px] text-slate-600 block">
                {lang === 'ta' ? 'ராசி பிண்டம்' : 'Rashi Pinda'}
              </span>
              <strong className="text-base font-black text-slate-950 font-mono">
                {safeShodhya.rashiPinda ?? 0}
              </strong>
            </div>

            <div className="p-2 bg-white border border-slate-300 rounded-lg">
              <span className="text-[11px] text-slate-600 block">
                {lang === 'ta' ? 'கிரகப் பிண்டம்' : 'Graha Pinda'}
              </span>
              <strong className="text-base font-black text-slate-950 font-mono">
                {safeShodhya.grahaPinda ?? 0}
              </strong>
            </div>

            <div className="p-2 bg-amber-100 border border-amber-400 rounded-lg">
              <span className="text-[11px] text-amber-950 block font-bold">
                {lang === 'ta' ? 'சோத்ய பிண்டம்' : 'Shodhya Pinda'}
              </span>
              <strong className="text-lg font-black text-amber-950 font-mono">
                {safeShodhya.totalShodhyaPinda ?? 0}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-slate-900 pt-2 text-[11px] text-slate-600 flex justify-between items-center">
        <span>{t.shodashavargaFooter || 'Certified Classical Thirukanitha Ephemeris'}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
