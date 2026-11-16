import React from 'react';
import SouthIndianChart from '../SouthIndianChart';
import { DOSSIER_TRANSLATIONS, translatePlanet, translateRashi, translateSpecialLagna } from './dossierI18n';

export default function DossierSpecialLagnas({ upagrahasData = {}, pageNumber = 15, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const specialLagnas = upagrahasData?.specialLagnas || [];
  const upagrahaChartGrid = upagrahasData?.upagrahaChartGrid || {};

  return (
    <div className="bg-white border-2 border-slate-900 p-3 sm:p-6 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break font-serif">
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-2">
        <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wide">
          {lang === 'ta'
            ? 'உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்.'
            : 'Upagrahas - Significant Sphutas & Special Lagnas'}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-4">
        {/* Top Split: Upagraha Chakra Chart + Key Special Lagnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* South Indian Upagraha Chart */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-900 mb-1">
              {lang === 'ta' ? 'உபகிரக சக்கரம்' : 'Upagraha Chakra'}
            </span>
            <div className="w-full max-w-[280px]">
              <SouthIndianChart
                gridData={upagrahaChartGrid}
                chartType="upagraha"
                lang={lang}
                title=""
              />
            </div>
          </div>

          {/* Quick Special Points Highlights */}
          <div className="space-y-2 border border-slate-300 rounded-xl p-3 bg-amber-50/40 text-xs">
            <h4 className="font-black text-slate-950 border-b border-amber-300 pb-1 uppercase tracking-wider text-[11px]">
              {lang === 'ta' ? 'விசேஷ லக்ன விவரங்கள்' : 'Key Special Lagnas'}
            </h4>
            <div className="space-y-1.5">
              {specialLagnas.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-200/80 pb-1 text-[11.5px]">
                  <span className="font-bold text-slate-900">
                    {translateSpecialLagna(item, lang)} :
                  </span>
                  <span className="font-mono font-bold text-amber-950">
                    {translateRashi(item.val?.tamilSign || item.val?.signName || '', lang)}{' '}
                    {item.val?.rashiColonDeg || item.val?.colonDeg || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Classical Sensitive Sphutas List Table */}
        <div className="border border-slate-900 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-1.5 px-3 text-left border-r border-slate-900">{t.specialPointCol}</th>
                <th className="py-1.5 px-3 border-r border-slate-900">{t.rashiCol}</th>
                <th className="py-1.5 px-3 border-r border-slate-900">{t.degreeDetailCol}</th>
                <th className="py-1.5 px-3">{t.lordCol}</th>
              </tr>
            </thead>
            <tbody>
              {specialLagnas.map((item, idx) => (
                <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                    {translateSpecialLagna(item, lang)}
                  </td>
                  <td className="py-1.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                    {translateRashi(item.val?.tamilSign || item.val?.signName || '', lang) || '---'}
                  </td>
                  <td className="py-1.5 px-3 font-mono font-bold text-amber-950 border-r border-slate-200">
                    {item.val?.rashiColonDeg || item.val?.colonDeg || '---'}
                  </td>
                  <td className="py-1.5 px-3 font-bold text-slate-950">
                    {translatePlanet(item.val?.lord || item.val?.lords || '', lang) || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Classical Metrics (Andhakaksha, Kuttakamsha, etc.) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-300">
          <div>
            <strong className="text-slate-900 block font-bold">
              {lang === 'ta' ? 'அந்தகாம்சத்தில் உள்ள கிரகங்கள் :' : 'Planets in Andhakaksha :'}
            </strong>
            <span className="text-slate-600 font-mono">ராகு (Rahu)</span>
          </div>
          <div>
            <strong className="text-slate-900 block font-bold">
              {lang === 'ta' ? 'குட்டகாம்சத்தில் உள்ள கிரகங்கள் :' : 'Planets in Kuttakamsha :'}
            </strong>
            <span className="text-slate-600 font-mono">---</span>
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
