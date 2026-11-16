import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet, translateRashi, translateUpagraha } from './dossierI18n';

export default function DossierUpagrahas({ upagrahasData = {}, pageNumber = 14, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const mandhyadhi = upagrahasData?.mandhyadhi || [];
  const dhumyadhi = upagrahasData?.dhumyadhi || [];

  return (
    <div className="bg-white border-2 border-slate-900 p-3 sm:p-6 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break font-serif">
      {/* Top Header */}
      <div className="text-center border-b-2 border-slate-900 pb-2">
        <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wide">
          {lang === 'ta' ? 'உபகிரகங்கள் - குளிகன் ஐவர் விவரங்கள்.' : 'Upagrahas - Mandhyadhi Five Details'}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-5">
        {/* Intro description */}
        <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
          {lang === 'ta'
            ? 'ஒவ்வொரு கிரகத்திற்கும் உபகிரகங்கள் உண்டு. ஒரு தினத்தின் ஜனன அடிப்படையில் பகல் அல்லது இரவு அகஸ் காலத்தை எட்டு பங்குகளாக்கி ஒவ்வொரு பங்கும் ஒரு உபகிரகத்திற்கான காலமாக கணிக்கப்படுகிறது. உபகிரகத்தின் ஆரம்ப காலம் அல்லது முடிவு காலத்தை உதய நேரமாகக் கொண்டு உபகிரக ஸ்புடங்கள் கணிக்கப்பட்டு இங்கே தரப்பட்டுள்ளன.'
            : 'Each celestial body has its subtler counterpart known as Upagraha. The diurnal or nocturnal arc is divided into eight equal segments according to classical Dinamana / Ratrimana. Both Parashara (segment inception) and Kalidasa (segment conclusion) methods are presented side-by-side.'}
        </p>

        {/* 1. Mandhyadhi 5 Upagrahas (Parashara vs Kalidasa) */}
        <div>
          <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-1.5 flex items-center justify-between border-b border-slate-300 pb-1">
            <span>{lang === 'ta' ? 'குளிகன் ஐவர் ஆரம்ப & முடிவு நேர ஸ்புடங்கள்' : 'Mandhyadhi Sphutas (Parashara & Kalidasa)'}</span>
            <span className="text-[10px] text-amber-800 font-normal">8-Part Dinamana Division</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-[10.5px] border border-slate-900 text-center">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                  <th rowSpan="2" className="py-1 px-1.5 border-r border-slate-900 text-left pl-2">
                    {lang === 'ta' ? 'உப கிரகம்' : 'Upagraha'}
                  </th>
                  <th rowSpan="2" className="py-1 px-1 border-r border-slate-900">
                    {lang === 'ta' ? 'அதிபதி' : 'Lord'}
                  </th>
                  <th colSpan="2" className="py-1 px-1 border-r border-slate-900 bg-amber-200/50">
                    {lang === 'ta' ? 'உப கிரக காலம்' : 'Upagraha Time Arc'}
                  </th>
                  <th colSpan="4" className="py-1 px-1 border-r border-slate-900 bg-amber-50">
                    {lang === 'ta' ? 'பராசரர் முறை (ஆரம்பம்)' : 'Parashara (Start Sphuta)'}
                  </th>
                  <th colSpan="4" className="py-1 px-1 bg-amber-100/80">
                    {lang === 'ta' ? 'காளிதாசர் முறை (முடிவு)' : 'Kalidasa (End Sphuta)'}
                  </th>
                </tr>
                <tr className="bg-amber-50/80 text-slate-900 border-b border-slate-900 font-bold text-[10px]">
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'ஆரம்பம்' : 'Start'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'முடிவு' : 'End'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'ராசி' : 'Rashi'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'பாகை' : 'Deg'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'நட்சத்திரம்' : 'Star'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'பாதம்' : 'P'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'ராசி' : 'Rashi'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'பாகை' : 'Deg'}</th>
                  <th className="py-0.5 px-1 border-r border-slate-900">{lang === 'ta' ? 'நட்சத்திரம்' : 'Star'}</th>
                  <th className="py-0.5 px-1">{lang === 'ta' ? 'பாதம்' : 'P'}</th>
                </tr>
              </thead>
              <tbody>
                {mandhyadhi.map((u, i) => (
                  <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-1.5 px-2 font-bold text-slate-950 text-left border-r border-slate-200">
                      {translateUpagraha(u.tamil || u.name, lang)}
                    </td>
                    <td className="py-1.5 px-1 font-bold text-amber-950 border-r border-slate-200">
                      {translatePlanet(u.lord, lang)}
                    </td>
                    <td className="py-1.5 px-1 font-mono text-[10px] text-slate-700 border-r border-slate-200">
                      {u.startTime || '--:--'}
                    </td>
                    <td className="py-1.5 px-1 font-mono text-[10px] text-slate-700 border-r border-slate-200">
                      {u.endTime || '--:--'}
                    </td>
                    {/* Parashara Method */}
                    <td className="py-1.5 px-1 font-bold text-slate-900 border-r border-slate-200">
                      {translateRashi(u.parashara?.tamilSign || u.parashara?.signName, lang)}
                    </td>
                    <td className="py-1.5 px-1 font-mono font-bold text-slate-950 border-r border-slate-200">
                      {u.parashara?.rashiColonDeg || u.parashara?.colonDeg}
                    </td>
                    <td className="py-1.5 px-1 text-[10px] text-slate-800 border-r border-slate-200">
                      {u.parashara?.tamilNakshatra || u.parashara?.nakshatra}
                    </td>
                    <td className="py-1.5 px-1 font-mono font-bold border-r border-slate-200">
                      {u.parashara?.pada}
                    </td>
                    {/* Kalidasa Method */}
                    <td className="py-1.5 px-1 font-bold text-slate-900 border-r border-slate-200 bg-amber-50/30">
                      {translateRashi(u.kalidasa?.tamilSign || u.kalidasa?.signName, lang)}
                    </td>
                    <td className="py-1.5 px-1 font-mono font-bold text-amber-950 border-r border-slate-200 bg-amber-50/30">
                      {u.kalidasa?.rashiColonDeg || u.kalidasa?.colonDeg}
                    </td>
                    <td className="py-1.5 px-1 text-[10px] text-slate-800 border-r border-slate-200 bg-amber-50/30">
                      {u.kalidasa?.tamilNakshatra || u.kalidasa?.nakshatra}
                    </td>
                    <td className="py-1.5 px-1 font-mono font-bold bg-amber-50/30">
                      {u.kalidasa?.pada}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Dhumyadhi 5 Upagrahas */}
        <div>
          <div className="border-t-2 border-slate-900 pt-3 mb-1.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wide">
              {lang === 'ta' ? 'உபகிரகங்கள் - தூமாதி ஐவர் ஸ்புடங்கள்.' : 'Upagrahas - Dhumyadhi Five Sphutas'}
            </h3>
            <p className="text-[11px] text-slate-600 italic mt-0.5">
              {lang === 'ta'
                ? 'சூரியன் பாகையைக் கொண்டு தூமாதி ஐவர் ஸ்புடங்கள் கணிக்கப் பெறுகின்றன.'
                : 'Computed precisely from Sun longitude using classical Parashari mathematical equations.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-900 text-center">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                  <th className="py-1.5 px-3 border-r border-slate-900 text-left pl-3">
                    {lang === 'ta' ? 'உப கிரகம்' : 'Upagraha'}
                  </th>
                  <th className="py-1.5 px-2 border-r border-slate-900">
                    {lang === 'ta' ? 'அதிபதி' : 'Lord'}
                  </th>
                  <th className="py-1.5 px-2 border-r border-slate-900">
                    {lang === 'ta' ? 'ராசி' : 'Rashi'}
                  </th>
                  <th className="py-1.5 px-2 border-r border-slate-900">
                    {lang === 'ta' ? 'பாகை-கலை' : 'Deg:Min'}
                  </th>
                  <th className="py-1.5 px-2 border-r border-slate-900">
                    {lang === 'ta' ? 'நட்சத்திரம்' : 'Nakshatra'}
                  </th>
                  <th className="py-1.5 px-2">
                    {lang === 'ta' ? 'பாதம்' : 'Pada'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dhumyadhi.map((d, i) => (
                  <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                      {translateUpagraha(d.tamil || d.name, lang)}
                    </td>
                    <td className="py-1.5 px-2 font-bold text-amber-950 border-r border-slate-200">
                      {translatePlanet(d.lord, lang)}
                    </td>
                    <td className="py-1.5 px-2 font-bold text-slate-900 border-r border-slate-200">
                      {translateRashi(d.tamilSign, lang)}
                    </td>
                    <td className="py-1.5 px-2 font-mono font-bold text-slate-950 border-r border-slate-200">
                      {d.rashiColonDeg || d.colonDeg}
                    </td>
                    <td className="py-1.5 px-2 text-slate-800 border-r border-slate-200">
                      {d.tamilNakshatra || d.nakshatra}
                    </td>
                    <td className="py-1.5 px-2 font-mono font-bold text-amber-950">
                      {d.pada}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
