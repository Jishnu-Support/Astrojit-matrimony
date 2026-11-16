import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet, translateRashi, getShortRashiHeaders } from './dossierI18n';

export default function DossierSarvashtakavarga({
  sarvashtakavarga = {},
  pageNumber = 20,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const rashiHeaders = getShortRashiHeaders(lang);
  const rows = sarvashtakavarga.planets || [];
  const totals = sarvashtakavarga.totals || [28, 35, 25, 28, 36, 23, 27, 23, 29, 25, 28, 30];

  const rashiKeys = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.sarvashtakavargaTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-6">
        <p className="text-xs font-serif text-slate-700 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-200">
          {t.sarvashtakavargaIntro}
        </p>

        {/* 7 Planets x 12 Signs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-3 border-r border-slate-900 text-left pl-3">{t.planetCol}</th>
                {rashiHeaders.map((r, i) => (
                  <th key={i} className="py-2 px-1 border-r border-slate-900 text-[11px]">{r}</th>
                ))}
                <th className="py-2 px-2 bg-amber-200 text-slate-950 font-black">{t.totalCol}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => {
                const pTotal = r.points.reduce((a, b) => a + b, 0);
                return (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                      {translatePlanet(r.name, lang)}
                    </td>
                    {r.points.map((pt, pIdx) => (
                      <td
                        key={pIdx}
                        className={`py-1.5 px-1 font-mono text-xs border-r border-slate-200 ${
                          pt >= 5 ? 'font-black text-emerald-700 bg-emerald-50/30' : pt <= 2 ? 'font-bold text-rose-700' : 'text-slate-800'
                        }`}
                      >
                        {pt}
                      </td>
                    ))}
                    <td className="py-1.5 px-2 font-mono font-black text-amber-950 bg-amber-50/50">
                      {pTotal}
                    </td>
                  </tr>
                );
              })}

              {/* Totals Row */}
              <tr className="bg-amber-100 text-slate-950 font-black border-t-2 border-slate-900">
                <td className="py-2 px-3 text-left border-r border-slate-900">
                  {t.totalPointsCol}
                </td>
                {totals.map((tot, i) => (
                  <td
                    key={i}
                    className={`py-2 px-1 font-mono text-xs border-r border-slate-900 ${
                      tot >= 28 ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-50 text-amber-950'
                    }`}
                  >
                    {tot}
                  </td>
                ))}
                <td className="py-2 px-2 font-mono text-sm bg-amber-300 text-slate-950">
                  337
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Auspicious Signs Summary */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.sarvashtakavargaTitle} (Totals)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-serif">
            {rashiKeys.map((key, i) => {
              const signName = translateRashi(key, lang);
              const score = totals[i];
              const isHigh = score >= 28;
              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border flex justify-between items-center ${
                    isHigh
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-bold">{signName}</span>
                  <span className={`font-mono font-black text-sm ${isHigh ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
