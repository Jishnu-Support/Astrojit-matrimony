import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet, translateRashi } from './dossierI18n';

export default function DossierFriendships({
  friendshipData = {},
  pageNumber = 16,
  showPanchadha = false,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const corePlanets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

  const naisargika = friendshipData?.naisargika || {};
  const tatkalika = friendshipData?.tatkalika || {};
  const panchadha = friendshipData?.panchadha || {};
  const avastheList = friendshipData?.avastheList || [];

  return (
    <div className="bg-white border-2 border-slate-900 p-3 sm:p-6 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break font-serif">
      <div className="text-center border-b-2 border-slate-900 pb-2">
        <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wide">
          {showPanchadha
            ? (lang === 'ta' ? 'கிரகங்களின் சத்து - மித்து & அவஸ்தை நிலைகள்' : 'Panchadha Maitri & Planetary Avasthas')
            : (lang === 'ta' ? 'நைசர்கிக & தற்காலிக நட்பு விவரங்கள்' : 'Naisargika & Tatkalika Planetary Friendships')}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-5">
        {!showPanchadha ? (
          <>
            {/* 1. Naisargika (Natural) Friendship Table (Page 16) */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1">
                {lang === 'ta' ? 'நைசர்கிக (இயற்கை) நட்பு விவரங்கள்' : 'Naisargika (Natural) Friendships'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border border-slate-900 text-center">
                  <thead>
                    <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                      <th className="py-1 px-2 border-r border-slate-900 text-left pl-3">{t.planetCol}</th>
                      {corePlanets.map((p, i) => (
                        <th key={i} className="py-1 px-1 border-r border-slate-900">{translatePlanet(p, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {corePlanets.map((p1, i) => {
                      const p1Key = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][i];
                      return (
                        <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                            {translatePlanet(p1, lang)}
                          </td>
                          {corePlanets.map((p2, j) => {
                            const p2Key = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][j];
                            if (i === j) {
                              return <td key={j} className="py-1.5 px-1 border-r border-slate-200 text-slate-400">--</td>;
                            }
                            const isM = naisargika[p1Key]?.mitra?.includes(p2Key);
                            const isS = naisargika[p1Key]?.shatru?.includes(p2Key);
                            const label = isM
                              ? (lang === 'ta' ? 'நட்பு' : 'Friend')
                              : isS
                              ? (lang === 'ta' ? 'பகை' : 'Enemy')
                              : (lang === 'ta' ? 'சமம்' : 'Neutral');
                            return (
                              <td
                                key={j}
                                className={`py-1.5 px-1 font-bold border-r border-slate-200 ${
                                  isM ? 'text-emerald-800 bg-emerald-50/40' : isS ? 'text-rose-800 bg-rose-50/40' : 'text-slate-700'
                                }`}
                              >
                                {label}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Tatkalika (Temporal) Friendship Table (Page 16) */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1">
                {lang === 'ta' ? 'தற்காலிக நட்பு விவரங்கள்' : 'Tatkalika (Temporal) Friendships'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border border-slate-900 text-center">
                  <thead>
                    <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                      <th className="py-1 px-2 border-r border-slate-900 text-left pl-3">{t.planetCol}</th>
                      {corePlanets.map((p, i) => (
                        <th key={i} className="py-1 px-1 border-r border-slate-900">{translatePlanet(p, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {corePlanets.map((p1, i) => {
                      const p1Key = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][i];
                      return (
                        <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                            {translatePlanet(p1, lang)}
                          </td>
                          {corePlanets.map((p2, j) => {
                            const p2Key = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][j];
                            if (i === j) {
                              return <td key={j} className="py-1.5 px-1 border-r border-slate-200 text-slate-400">--</td>;
                            }
                            const val = tatkalika[p1Key]?.[p2Key];
                            const isM = val === 'Mitra' || val === 'நட்பு' || val === 'Friend';
                            const label = isM
                              ? (lang === 'ta' ? 'நட்பு' : 'Friend')
                              : (lang === 'ta' ? 'பகை' : 'Enemy');
                            return (
                              <td
                                key={j}
                                className={`py-1.5 px-1 font-bold border-r border-slate-200 ${
                                  isM ? 'text-emerald-800 bg-emerald-50/40' : 'text-rose-800 bg-rose-50/40'
                                }`}
                              >
                                {label}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 3. Panchadha (5-Fold Compound) Maitri Table (Page 17) */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1">
                {lang === 'ta' ? 'கிரகங்களின் சத்து - மித்து நிலைகள்' : 'Panchadha Maitri (5-Fold Compound Relationship)'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border border-slate-900 text-center">
                  <thead>
                    <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                      <th className="py-1 px-2 border-r border-slate-900 text-left pl-3">{t.planetCol}</th>
                      {corePlanets.map((p, i) => (
                        <th key={i} className="py-1 px-1 border-r border-slate-900">{translatePlanet(p, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {corePlanets.map((p1, i) => {
                      const p1Key = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][i];
                      return (
                        <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                            {translatePlanet(p1, lang)}
                          </td>
                          {corePlanets.map((p2, j) => {
                            const p2Key = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][j];
                            if (i === j) {
                              return <td key={j} className="py-1.5 px-1 border-r border-slate-200 text-slate-400">--</td>;
                            }
                            const val = panchadha[p1Key]?.[p2Key] || 'Neutral';
                            let label = lang === 'ta' ? 'சமம்' : 'Neutral';
                            let style = 'text-slate-800';
                            if (val === 'Adhi Mitra' || val.includes('Adhi Mitra') || val === 'அதிமித்ரு' || val === 'அதி நட்பு') {
                              label = lang === 'ta' ? 'அதி நட்பு' : 'Great Friend';
                              style = 'text-emerald-900 bg-emerald-100 font-black';
                            } else if (val === 'Mitra' || val.includes('Mitra') || val === 'நட்பு' || val === 'Friend') {
                              label = lang === 'ta' ? 'நட்பு' : 'Friend';
                              style = 'text-emerald-800 font-bold';
                            } else if (val === 'Sama' || val.includes('Sama') || val.includes('Neutral') || val === 'சமம்') {
                              label = lang === 'ta' ? 'சமம்' : 'Neutral';
                              style = 'text-slate-700';
                            } else if (val === 'Shatru' || val.includes('Shatru') || val === 'பகை' || val === 'Enemy') {
                              label = lang === 'ta' ? 'பகை' : 'Enemy';
                              style = 'text-rose-800 font-bold';
                            } else if (val === 'Adhi Shatru' || val.includes('Adhi Shatru') || val === 'அதிசத்ரு' || val === 'அதி பகை') {
                              label = lang === 'ta' ? 'அதி பகை' : 'Great Enemy';
                              style = 'text-rose-950 bg-rose-100 font-black';
                            }
                            return (
                              <td key={j} className={`py-1.5 px-1 border-r border-slate-200 ${style}`}>
                                {label}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Planetary Avasthas, Mandalam & Dasa Samayam Table (Page 17 Bottom) */}
            <div className="space-y-1.5 border-t-2 border-slate-900 pt-3">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1">
                {lang === 'ta'
                  ? 'கிரகங்களின் அவஸ்தை - மண்டலம் - தசா சமய நிலைகள்'
                  : 'Planetary Avasthas, Mandalam & Dasa Samayam'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-900 text-center">
                  <thead>
                    <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                      <th className="py-1.5 px-2 border-r border-slate-900 text-left pl-3">{lang === 'ta' ? 'கிரகம்' : 'Planet'}</th>
                      <th className="py-1.5 px-2 border-r border-slate-900">{lang === 'ta' ? 'ராசி' : 'Rashi'}</th>
                      <th className="py-1.5 px-2 border-r border-slate-900">{lang === 'ta' ? 'பாகை' : 'Degree'}</th>
                      <th className="py-1.5 px-2 border-r border-slate-900 bg-amber-200/50">{lang === 'ta' ? 'அவஸ்தை நிலை' : 'Avastha'}</th>
                      <th className="py-1.5 px-2 border-r border-slate-900">{lang === 'ta' ? 'தசா மண்டலம்' : 'Dasa Mandalam'}</th>
                      <th className="py-1.5 px-2">{lang === 'ta' ? 'தசா சமயம்' : 'Dasa Samayam'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avastheList.map((av, idx) => (
                      <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                          {translatePlanet(av.tamilPlanet || av.planet, lang)}
                        </td>
                        <td className="py-1.5 px-2 font-bold text-slate-900 border-r border-slate-200">
                          {translateRashi(av.tamilSign || av.sign, lang)}
                        </td>
                        <td className="py-1.5 px-2 font-mono font-bold text-slate-900 border-r border-slate-200">
                          {av.deg}
                        </td>
                        <td className="py-1.5 px-2 font-bold text-amber-950 bg-amber-50/50 border-r border-slate-200">
                          {lang === 'ta' ? `${av.avasthe} அவஸ்தை` : av.avastheEn}
                        </td>
                        <td className="py-1.5 px-2 text-slate-800 border-r border-slate-200">
                          {lang === 'ta' ? av.mandalamTa : av.mandalamEn}
                        </td>
                        <td className="py-1.5 px-2 font-bold text-slate-900">
                          {av.samayamTa || 'போஜனம் (மத்திமம்)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-slate-900 pt-2 text-[11px] text-slate-600 flex justify-between items-center">
        <span>{t.shodashavargaFooter || 'Certified Classical Thirukanitha Ephemeris'}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
