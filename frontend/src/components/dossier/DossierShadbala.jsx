import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet } from './dossierI18n';

export default function DossierShadbala({ shadbalaPlanets = [], bhavaBalas = [], pageNumber = 9, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const balaRows = [
    { label: t.sthanaBala, key: 'sthanaBala' },
    { label: t.digBala, key: 'digBala' },
    { label: t.kaalaBala, key: 'kaalaBala' },
    { label: t.chestaBala, key: 'chestaBala' },
    { label: t.naisargikaBala, key: 'naisargikaBala' },
    { label: t.drikBala, key: 'drikBala' },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.shadbalaTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-6">
        {/* Shadbala 6-fold Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-2 border-r border-slate-900 text-left pl-3">{t.shadbalaCol}</th>
                {shadbalaPlanets.map((p, idx) => (
                  <th key={idx} className="py-2 px-2 border-r border-slate-900">{translatePlanet(p.name, lang)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {balaRows.map((r, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-1.5 px-3 font-bold text-slate-700 text-left border-r border-slate-200">{r.label}</td>
                  {shadbalaPlanets.map((p, idx) => (
                    <td key={idx} className="py-1.5 px-2 font-mono border-r border-slate-200">{p[r.key]}</td>
                  ))}
                </tr>
              ))}

              {/* Total Shadbala Row */}
              <tr className="bg-amber-50/70 border-b border-slate-900 font-black text-slate-950">
                <td className="py-2 px-3 text-left border-r border-slate-900">{t.totalShadbala}</td>
                {shadbalaPlanets.map((p, idx) => (
                  <td key={idx} className="py-2 px-2 font-mono text-amber-950 border-r border-slate-900 font-black text-xs sm:text-sm">
                    {p.totalShadbala}
                  </td>
                ))}
              </tr>

              {/* Required & Ratio */}
              <tr className="border-b border-slate-200">
                <td className="py-1.5 px-3 font-medium text-slate-600 text-left border-r border-slate-200">{t.requiredShadbala}</td>
                {shadbalaPlanets.map((p, idx) => (
                  <td key={idx} className="py-1.5 px-2 font-mono text-[11px] border-r border-slate-200">{p.requiredShadbala || 390}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <td className="py-1.5 px-3 font-medium text-slate-600 text-left border-r border-slate-200">{t.rupaMeasure}</td>
                {shadbalaPlanets.map((p, idx) => (
                  <td key={idx} className="py-1.5 px-2 font-mono text-[11px] border-r border-slate-200">{p.rupas}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 px-3 font-bold text-slate-800 text-left border-r border-slate-200">{t.strengthRatio}</td>
                {shadbalaPlanets.map((p, idx) => (
                  <td key={idx} className="py-1.5 px-2 font-mono font-bold text-slate-900 border-r border-slate-200">{p.ratio}%</td>
                ))}
              </tr>
              <tr className="border-b border-slate-900 bg-amber-100/50 font-bold">
                <td className="py-1.5 px-3 text-slate-900 text-left border-r border-slate-900">{t.verdict}</td>
                {shadbalaPlanets.map((p, idx) => {
                  const isStrong = (p.ratio || 100) >= 100;
                  return (
                    <td key={idx} className={`py-1.5 px-2 font-bold border-r border-slate-900 text-[11px] ${isStrong ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {isStrong ? t.strong : t.moderate}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bhava Bala Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.bhavaBalaSub}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-serif border border-slate-900 text-center">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                  <th className="py-1.5 px-2 border-r border-slate-900">{t.houseNum}</th>
                  <th className="py-1.5 px-2 border-r border-slate-900">{t.bhavaLordCol}</th>
                  <th className="py-1.5 px-2 border-r border-slate-900">{t.bhavaBalaCol}</th>
                  <th className="py-1.5 px-2 border-r border-slate-900">{t.adhipatyaBalaCol}</th>
                  <th className="py-1.5 px-2">{t.rankCol}</th>
                </tr>
              </thead>
              <tbody>
                {bhavaBalas.map((bb, idx) => (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-1 px-2 font-bold text-slate-900 border-r border-slate-200">
                      {bb.house} {t.houseNum}
                    </td>
                    <td className="py-1 px-2 font-bold text-slate-800 border-r border-slate-200">{translatePlanet(bb.lord, lang)}</td>
                    <td className="py-1 px-2 font-mono font-bold text-amber-950 border-r border-slate-200">{bb.totalBhavabala}</td>
                    <td className="py-1 px-2 font-mono border-r border-slate-200">{bb.adhipatyaBala}</td>
                    <td className="py-1 px-2 font-mono font-black text-slate-950">{bb.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.certifiedFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
