import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet, getPlanetShort } from './dossierI18n';

export default function DossierAspectAngles({
  aspectAnglesData = {},
  isBhava = false,
  pageNumber = 18,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const matrix = aspectAnglesData?.matrix || [];
  const bhavaAngles = aspectAnglesData?.bhavaAngles || [];
  const planetKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {isBhava ? t.bhavaAspectsTitle : t.aspectAnglesTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-4">
        {!isBhava ? (
          <>
            <p className="text-xs font-serif text-slate-700 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-200">
              {t.aspectIntro}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-serif border border-slate-900 text-center">
                <thead>
                  <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                    <th className="py-2 px-2 border-r border-slate-900 text-left pl-3">{t.planetCol}</th>
                    <th className="py-2 px-2 border-r border-slate-900 font-mono">{t.degCol}</th>
                    {planetKeys.map((p, i) => (
                      <th key={i} className="py-2 px-1 border-r border-slate-900 text-[11px]">{getPlanetShort(p, lang)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="py-2 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                        {translatePlanet(row.planet, lang)}
                      </td>
                      <td className="py-2 px-2 font-mono text-[11px] border-r border-slate-200 font-bold">
                        {row.deg}
                      </td>
                      {row.angles.map((ang, j) => (
                        <td
                          key={j}
                          className={`py-2 px-1 font-mono text-xs border-r border-slate-200 ${
                            ang === '--'
                              ? 'text-slate-300'
                              : ang >= 170 && ang <= 190
                              ? 'font-black text-rose-700 bg-rose-50/50'
                              : ang >= 110 && ang <= 130
                              ? 'font-bold text-amber-800 bg-amber-50/40'
                              : 'text-slate-800'
                          }`}
                        >
                          {ang}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-serif border border-slate-900 text-center">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                  <th className="py-2 px-2 border-r border-slate-900 text-left pl-3">{t.houseNum}</th>
                  <th className="py-2 px-2 border-r border-slate-900 font-mono">{t.midDegCol}</th>
                  {planetKeys.map((p, i) => (
                    <th key={i} className="py-2 px-1 border-r border-slate-900 text-[11px]">{getPlanetShort(p, lang)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bhavaAngles.map((b, i) => (
                  <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-2 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                      {b.house || (i + 1)} {t.houseNum}
                    </td>
                    <td className="py-2 px-2 font-mono text-[11px] border-r border-slate-200 font-bold">
                      {b.mid || b.midDeg || '---'}
                    </td>
                    {b.angles.map((ang, j) => (
                      <td
                        key={j}
                        className={`py-2 px-1 font-mono text-xs border-r border-slate-200 ${
                          ang === '--'
                            ? 'text-slate-300'
                            : ang >= 170 && ang <= 190
                            ? 'font-black text-rose-700 bg-rose-50/50'
                            : ang >= 110 && ang <= 130
                            ? 'font-bold text-amber-800 bg-amber-50/40'
                            : 'text-slate-800'
                        }`}
                      >
                        {ang}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
