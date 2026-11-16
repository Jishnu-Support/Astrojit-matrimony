import React from 'react';
import { DOSSIER_TRANSLATIONS, getPlanetShort, translateVargaName, translateVargaCode } from './dossierI18n';

export default function DossierDashaVarga({
  dashaVargas = [],
  vargaSubhaTotals = { subha: [5, 10, 8, 7, 8, 9, 5, 3, 2, 8], asubha: [5, 0, 2, 3, 2, 1, 5, 7, 8, 2], grandSubha: 65, grandAsubha: 35 },
  pageNumber = 10,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const planetKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'lagna'];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.vargaTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-2 border-r border-slate-900 text-left pl-3">{t.vargaCol}</th>
                {planetKeys.map((k, i) => (
                  <th key={i} className="py-2 px-1 border-r border-slate-900">{getPlanetShort(k, lang)}</th>
                ))}
                <th className="py-2 px-2 bg-emerald-100 text-emerald-950 font-black border-r border-slate-900">{t.subhaCol}</th>
                <th className="py-2 px-2 bg-rose-100 text-rose-950 font-black">{t.asubhaCol}</th>
              </tr>
            </thead>
            <tbody>
              {dashaVargas.map((v, idx) => {
                const placements = v.placements || [
                  v.surya || 'ச',
                  v.chandra || 'ச',
                  v.chevvai || 'ச',
                  v.budha || 'ச',
                  v.guru || 'ச',
                  v.shukra || 'ச',
                  v.shani || 'ச',
                  v.rahu || 'ச',
                  v.ketu || 'ச',
                  v.lagna || 'ச',
                ];
                const rawVName = v.varga || v.name || `${t.vargaCol} ${idx + 1}`;
                const vName = translateVargaName(rawVName, lang);

                return (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-1.5 px-3 font-bold text-slate-900 text-left border-r border-slate-200">
                      {vName}
                    </td>
                    {placements.map((code, pIdx) => {
                      const displayCode = translateVargaCode(code, lang);
                      return (
                        <td
                          key={pIdx}
                          className={`py-1.5 px-1 font-bold border-r border-slate-200 text-center ${
                            code === 'உ' || code === 'ஆ' || code === 'Ex' || code === 'Own'
                              ? 'text-emerald-700 bg-emerald-50/40 font-black'
                              : code === 'நீ' || code === 'Deb'
                              ? 'text-rose-700 bg-rose-50/40 font-black'
                              : 'text-slate-800'
                          }`}
                        >
                          {displayCode}
                        </td>
                      );
                    })}
                    <td className="py-1.5 px-2 font-mono font-bold text-emerald-900 bg-emerald-50/50 border-r border-slate-200">
                      {vargaSubhaTotals.subha[idx] !== undefined ? vargaSubhaTotals.subha[idx] : 7}
                    </td>
                    <td className="py-1.5 px-2 font-mono font-bold text-rose-900 bg-rose-50/50">
                      {vargaSubhaTotals.asubha[idx] !== undefined ? vargaSubhaTotals.asubha[idx] : 3}
                    </td>
                  </tr>
                );
              })}

              {/* Total Row */}
              <tr className="bg-amber-100 text-slate-950 font-black border-t-2 border-slate-900">
                <td className="py-2.5 px-3 text-left border-r border-slate-900" colSpan={planetKeys.length + 1}>
                  {t.grandTotal}
                </td>
                <td className="py-2.5 px-2 font-mono text-emerald-950 text-sm border-r border-slate-900 bg-emerald-200/80">
                  {vargaSubhaTotals.grandSubha || 65}
                </td>
                <td className="py-2.5 px-2 font-mono text-rose-950 text-sm bg-rose-200/80">
                  {vargaSubhaTotals.grandAsubha || 35}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
