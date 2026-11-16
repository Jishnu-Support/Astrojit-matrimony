import React from 'react';
import { DOSSIER_TRANSLATIONS } from './dossierI18n';

export default function DossierPlanetaryStates({
  sarvashtakavarga = {},
  pageNumber = 32,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const rows = [
    { label: t.kendramLabel, score: sarvashtakavarga.kendram || 107, desc: t.kendramDesc },
    { label: t.panaparamLabel, score: sarvashtakavarga.panaparam || 108, desc: t.panaparamDesc },
    { label: t.apoklimamLabel, score: sarvashtakavarga.apoklimam || 122, desc: t.apoklimamDesc },
    { label: t.upachayamLabel, score: sarvashtakavarga.upachayam || 113, desc: t.upachayamDesc },
    { label: t.trikonamLabel, score: sarvashtakavarga.trikonam || 93, desc: t.trikonamDesc },
  ];

  const directions = [
    { dir: t.eastDir, pts: sarvashtakavarga.directions?.east || 93 },
    { dir: t.southDir, pts: sarvashtakavarga.directions?.south || 83 },
    { dir: t.westDir, pts: sarvashtakavarga.directions?.west || 80 },
    { dir: t.northDir, pts: sarvashtakavarga.directions?.north || 81 },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.planetaryStatesTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-6">
        {/* Sthana Strengths Table */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.quadrantTitle}
          </h3>
          <table className="w-full text-xs font-serif border border-slate-900">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold text-center">
                <th className="py-2 px-3 text-left border-r border-slate-900">{t.quadrantCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.totalPointsCol}</th>
                <th className="py-2 px-3 text-left">{t.primaryResultCol}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-2 px-3 font-bold text-slate-950 border-r border-slate-200">{r.label}</td>
                  <td className="py-2 px-3 font-mono font-black text-amber-950 text-center border-r border-slate-200 text-sm">{r.score}</td>
                  <td className="py-2 px-3 text-slate-700">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4 Directions Strength Cards */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.directionsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
            {directions.map((d, i) => (
              <div key={i} className="p-3 border border-slate-900 rounded-xl bg-amber-50/30 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-950">{d.dir}</h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-amber-950">{d.pts}</span>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.totalPointsCol}</span>
                </div>
              </div>
            ))}
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
