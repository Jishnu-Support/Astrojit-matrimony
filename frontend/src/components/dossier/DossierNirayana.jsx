import React from 'react';
import {
  DOSSIER_TRANSLATIONS,
  translatePlanet,
  translateRashi,
  translateNakshatra,
  translateDignity
} from './dossierI18n';

export default function DossierNirayana({ nirayanaTable = [], pageNumber = 5, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.nirayanaTitle}
        </h2>
      </div>

      <div className="my-auto py-4 overflow-x-auto">
        <table className="w-full text-xs font-serif border-collapse border border-slate-900">
          <thead>
            <tr className="bg-amber-100 text-slate-950 border-b-2 border-slate-900">
              {t.planetHeaders.map((h, i) => (
                <th key={i} className="py-2.5 px-2 text-center font-black border-r border-slate-900 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nirayanaTable.map((row, idx) => {
              const rawName = row.name || row.planet || '';
              const isLagnaRow = rawName.toLowerCase().includes('lagna') || rawName.includes('லக்னம்');
              const pName = translatePlanet(rawName, lang);
              const longVal = row.longitude || row.fullDegree || row.formattedColonDeg || row.formattedDeg || '---';
              const starVal = translateNakshatra(row.nakshatra || row.star || '', lang) || '---';
              const lordVal = translatePlanet(row.nakLord || row.starLord || '', lang) || '---';
              const signVal = translateRashi(row.rashi || row.sign || '', lang) || '---';
              const rashiDegVal = row.rashiDeg || row.rashiDegree || row.formattedRashiColonDeg || '---';
              const dignityVal = translateDignity(row.dignity, lang);

              return (
                <tr
                  key={idx}
                  className={`border-b border-slate-300 text-center ${
                    isLagnaRow
                      ? 'bg-amber-50 font-black'
                      : idx % 2 === 0
                      ? 'bg-white'
                      : 'bg-slate-50/50'
                  }`}
                >
                  <td className="py-2.5 px-2 font-bold text-slate-950 border-r border-slate-300 text-left pl-3">
                    {pName}
                  </td>
                  <td className="py-2.5 px-2 font-mono border-r border-slate-300 font-bold">
                    {longVal}
                  </td>
                  <td className="py-2.5 px-2 border-r border-slate-300 font-medium">
                    {starVal}
                  </td>
                  <td className="py-2.5 px-2 font-mono font-bold border-r border-slate-300">
                    {row.pada}
                  </td>
                  <td className="py-2.5 px-2 border-r border-slate-300 font-medium">
                    {lordVal}
                  </td>
                  <td className="py-2.5 px-2 border-r border-slate-300 font-bold text-amber-950">
                    {signVal}
                  </td>
                  <td className="py-2.5 px-2 font-mono border-r border-slate-300">
                    {rashiDegVal}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-slate-950">
                    <span className={
                      dignityVal.includes('உச்ச') || dignityVal.includes('Exalted') || dignityVal.includes('ಉಚ್ಚ') || dignityVal.includes('उच्च') || dignityVal.includes('ఉచ్ఛ')
                        ? 'text-emerald-700 font-black'
                        : dignityVal.includes('நீச') || dignityVal.includes('Debilitated') || dignityVal.includes('ನೀಚ') || dignityVal.includes('नीच') || dignityVal.includes('నీచ')
                        ? 'text-rose-700 font-bold'
                        : 'text-slate-800'
                    }>
                      {dignityVal}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.certifiedFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
