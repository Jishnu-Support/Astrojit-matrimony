import React from 'react';
import {
  DOSSIER_TRANSLATIONS,
  translatePlanet,
  translateRashi,
  translateNakshatra,
  translateGana,
  translateYoni,
  translateNadi,
  translateRajju,
  translateElement,
  translateBird,
  translateTree,
  translateVaara,
  translatePaksha,
  translateRitu,
  formatLocalizedDashaBalance
} from './dossierI18n';

export function DossierJananaVivaramPart1({ client = {}, astrologicalDetails = {}, pageNumber = 2, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const nakName = translateNakshatra(astrologicalDetails.nakshatra || 'Ardra', lang);
  const rashiName = translateRashi(astrologicalDetails.moonSign || 'Mithuna', lang);
  const lagnaName = translateRashi(astrologicalDetails.lagna?.signName || 'Dhanu', lang);

  const udayaNazhigaiVal = astrologicalDetails.udayathiNazhikai || '11:37:12';
  const ganaVal = translateGana(astrologicalDetails.ganam || astrologicalDetails.gana || 'Manushya', lang);
  const yoniVal = translateYoni(astrologicalDetails.yoni || 'Dog', astrologicalDetails.yoniSex || 'Male', lang);
  const birdVal = translateBird(astrologicalDetails.pakshi || 'Sparrow', lang);
  const treeVal = translateTree(astrologicalDetails.tree || 'Red Cutch', lang);
  const nadiVal = translateNadi(astrologicalDetails.nadi || 'Adi', lang);
  const rajjuVal = translateRajju(astrologicalDetails.rajju || 'Kantha', lang);
  const elementVal = translateElement(astrologicalDetails.element || astrologicalDetails.lagna?.element || 'Air', lang);
  const vaaraVal = translateVaara(astrologicalDetails.weekday || astrologicalDetails.panchangam?.day || 'Friday', lang);

  const starBasisLabel = (astrologicalDetails.isSunBasis || client.starBasis === 'sun')
    ? (lang === 'ta' ? 'சூரிய நட்சத்திரம் (Sun Star)' : lang === 'kn' ? 'ಸೂರ್ಯ ನಕ್ಷತ್ರ (Sun Star)' : lang === 'hi' ? 'सूर्य नक्षत्र (Sun Star)' : lang === 'te' ? 'సూర్య నక్షత్రం (Sun Star)' : 'Sun Star (Surya Nakshatra)')
    : (lang === 'ta' ? 'சந்திர நட்சத்திரம் (Moon Star)' : lang === 'kn' ? 'ಚಂದ್ರ ನಕ್ಷತ್ರ (Moon Star)' : lang === 'hi' ? 'चंद्र नक्षत्र (Moon Star)' : lang === 'te' ? 'చంద్ర నక్షత్రం (Moon Star)' : 'Moon Star (Chandra Nakshatra)');

  const rows = [
    { label: t.native, val: client.name || 'Sample' },
    { label: t.gender, val: ['female', 'பெண்', 'f', 'woman', 'girl', 'महिला', 'ಮಹಿಳೆ'].includes((client.gender || '').toString().toLowerCase().trim()) ? t.female : t.male },
    { label: t.father, val: client.fatherName || 'Sample Father' },
    { label: t.mother, val: client.motherName || 'Sample Mother' },
    { label: t.birthPlace, val: client.dobPlace || client.nativePlace || 'Hosur (Tamil Nadu, India)' },
    { label: lang === 'ta' ? 'அட்சரேகை / தீர்க்கரேகை' : lang === 'kn' ? 'ಅಕ್ಷಾಂಶ / ರೇಖಾಂಶ' : lang === 'hi' ? 'अक्षांश / देशांतर' : lang === 'te' ? 'అక్షాంశం / రేఖాంశం' : 'Latitude & Longitude', val: client.coordinates || (client.latitude && client.longitude ? `${client.latitude} , ${client.longitude}` : "12° 44' N , 77° 49' E") },
    { label: t.birthDate, val: client.dob || '30-10-2026' },
    { label: t.vaara, val: vaaraVal },
    { label: t.birthTime, val: client.dobTime12 || client.dobTime || '10:55:08 AM' },
    { label: t.udayaNazhigai, val: udayaNazhigaiVal },
    { label: lang === 'ta' ? 'ராசி கணக்கீட்டு நட்சத்திரம்' : lang === 'kn' ? 'ರಾಶಿ ಗಣನೆ ಆಧಾರ' : lang === 'hi' ? 'राशि गणना आधार' : lang === 'te' ? 'రాశి లెక్కించే ఆధారం' : 'Rasi Calculation Basis', val: starBasisLabel },
    { label: t.nakshatra, val: `${nakName} (${astrologicalDetails.pada || 1} ${t.pada})` },
    { label: t.rashi, val: rashiName },
    { label: t.lagna, val: lagnaName },
    { label: t.gana, val: ganaVal },
    { label: t.yoni, val: yoniVal },
    { label: t.bird, val: birdVal },
    { label: t.tree, val: treeVal },
    { label: t.nadi, val: nadiVal },
    { label: t.rajju, val: rajjuVal },
    { label: t.element, val: elementVal },
    { label: t.gotra, val: client.gotra || 'Vishwamitra' },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.jananaTitle}
        </h2>
      </div>

      <div className="my-auto py-4">
        <div className="border border-slate-900 overflow-hidden rounded-xl">
          <table className="w-full text-xs sm:text-sm font-serif">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-amber-50/20' : 'bg-white'}`}>
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-200 w-1/2">
                    {r.label}
                  </td>
                  <td className="py-2.5 px-4 font-black text-slate-950">
                    {r.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.certifiedFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}

export function DossierJananaVivaramPart2({ astrologicalDetails = {}, pageNumber = 3, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const yearLabel = lang === 'ta' ? 'வருடம்' : lang === 'kn' ? 'ಸಂವತ್ಸರ' : lang === 'hi' ? 'संवत्सर' : lang === 'te' ? 'సంవత్సరం' : 'Samvatsara';
  const tamilYearStr = astrologicalDetails.tamilYear ? `${astrologicalDetails.tamilYear} ${yearLabel}` : (lang === 'ta' ? 'பராபவ வருடம்' : 'Parabhava Samvatsara');
  const tamilMonthStr = astrologicalDetails.tamilMonth ? `${astrologicalDetails.tamilMonth} ${astrologicalDetails.tamilDay || 1}` : (lang === 'ta' ? 'ஐப்பசி மாதம் 13-ம் நாள்' : 'Aippasi Month 13');
  const ayanaStr = astrologicalDetails.ayana === 'Uttarayana' ? t.uttarayana : t.dakshinayana;
  const pakshaVal = translatePaksha(astrologicalDetails.paksha, lang);
  const tithiStr = `${astrologicalDetails.tithi || astrologicalDetails.panchangam?.tithi || 'Chaturthi'} (${pakshaVal})`;
  const yogaStr = `${astrologicalDetails.yoga || astrologicalDetails.panchangam?.yoga || 'Parigha'}`;
  const karanaStr = `${astrologicalDetails.karana || astrologicalDetails.panchangam?.karana || 'Bava'}`;
  const sunriseStr = astrologicalDetails.sunriseSunset?.split('/')[0]?.trim() || '06:16:15 AM';
  const sunsetStr = astrologicalDetails.sunriseSunset?.split('/')[1]?.trim() || '05:50:22 PM';
  const ayanamshaStr = astrologicalDetails.ayanamshaColon || astrologicalDetails.ayanamsha || '24° 14\' 02" (Lahiri)';

  const rows = [
    { label: t.tamilYear, val: tamilYearStr },
    { label: t.tamilMonth, val: tamilMonthStr },
    { label: t.ayana, val: ayanaStr },
    { label: t.ritu, val: translateRitu(astrologicalDetails.ritu, lang) },
    { label: t.tithi, val: tithiStr },
    { label: t.yoga, val: yogaStr },
    { label: t.karana, val: karanaStr },
    { label: t.sunrise, val: sunriseStr },
    { label: t.sunset, val: sunsetStr },
    { label: t.dayDuration, val: astrologicalDetails.dayDuration || `29 ${t.days === 'நாள்' ? 'நாழிகை 25 விநாழிகை' : 'Ghati 25 Vighati'}` },
    { label: t.nightDuration, val: astrologicalDetails.nightDuration || `30 ${t.days === 'நாள்' ? 'நாழிகை 35 விநாழிகை' : 'Ghati 35 Vighati'}` },
    { label: t.ayanamsha, val: ayanamshaStr },
    { label: t.balanceDasha, val: formatLocalizedDashaBalance(astrologicalDetails.dashaBalance, lang) },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.panchangamTitle}
        </h2>
      </div>

      <div className="my-auto py-4">
        <div className="border border-slate-900 overflow-hidden rounded-xl">
          <table className="w-full text-xs sm:text-sm font-serif">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-amber-50/20' : 'bg-white'}`}>
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-200 w-1/2">
                    {r.label}
                  </td>
                  <td className="py-2.5 px-4 font-black text-slate-950 font-mono">
                    {r.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.certifiedFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}

export function DossierCombinedJananaVivaram({ client = {}, astrologicalDetails = {}, pageNumber = 4, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const nakName = translateNakshatra(astrologicalDetails.nakshatra || 'Ardra', lang);
  const rashiName = translateRashi(astrologicalDetails.moonSign || 'Mithuna', lang);
  const lagnaName = translateRashi(astrologicalDetails.lagna?.signName || 'Dhanu', lang);
  const vaaraVal = translateVaara(astrologicalDetails.weekday || astrologicalDetails.panchangam?.day || 'Friday', lang);
  const pakshaVal = translatePaksha(astrologicalDetails.paksha, lang);
  const tithiStr = `${astrologicalDetails.tithi || astrologicalDetails.panchangam?.tithi || 'Chaturthi'} (${pakshaVal})`;
  const yogaStr = `${astrologicalDetails.yoga || astrologicalDetails.panchangam?.yoga || 'Parigha'}`;
  const karanaStr = `${astrologicalDetails.karana || astrologicalDetails.panchangam?.karana || 'Bava'}`;
  const sunriseStr = astrologicalDetails.sunriseSunset?.split('/')[0]?.trim() || '06:16:15 AM';
  const ayanamshaStr = astrologicalDetails.ayanamshaColon || astrologicalDetails.ayanamsha || '24° 14\' 02"';

  const combinedRows = [
    { label: t.native, val: client.name || 'Sample' },
    { label: t.gender, val: ['female', 'பெண்', 'f', 'woman', 'girl', 'महिला', 'ಮಹಿಳೆ'].includes((client.gender || '').toString().toLowerCase().trim()) ? t.female : t.male },
    { label: t.birthDate, val: client.dob || '30-10-2026' },
    { label: t.birthTime, val: client.dobTime12 || client.dobTime || '10:55:08 AM' },
    { label: t.birthPlace, val: client.dobPlace || client.nativePlace || 'Hosur (Tamil Nadu, India)' },
    { label: lang === 'ta' ? 'அட்சரேகை / தீர்க்கரேகை' : lang === 'kn' ? 'ಅಕ್ಷಾಂಶ / ರೇಖಾಂಶ' : lang === 'hi' ? 'अक्षांश / देशांतर' : lang === 'te' ? 'అక్షాంశం / రేఖాంశం' : 'Latitude & Longitude', val: client.coordinates || (client.latitude && client.longitude ? `${client.latitude} , ${client.longitude}` : "12° 44' N , 77° 49' E") },
    { label: t.vaara, val: vaaraVal },
    { label: lang === 'ta' ? 'ராசி கணக்கீட்டு நட்சத்திரம்' : lang === 'kn' ? 'ರಾಶಿ ಗಣನೆ ಆಧಾರ' : lang === 'hi' ? 'राशि गणना आधार' : lang === 'te' ? 'రాశి లెక్కించే ఆధారం' : 'Rasi Calculation Basis', val: (astrologicalDetails.isSunBasis || client.starBasis === 'sun') ? (lang === 'ta' ? 'சூரிய நட்சத்திரம் (Sun Star)' : 'Sun Star (Surya Nakshatra)') : (lang === 'ta' ? 'சந்திர நட்சத்திரம் (Moon Star)' : 'Moon Star (Chandra Nakshatra)') },
    { label: t.nakshatra, val: `${nakName} (${astrologicalDetails.pada || 1} ${t.pada})` },
    { label: t.rashi, val: rashiName },
    { label: t.lagna, val: lagnaName },
    { label: t.tithi, val: tithiStr },
    { label: t.yoga, val: yogaStr },
    { label: t.karana, val: karanaStr },
    { label: t.sunrise, val: sunriseStr },
    { label: t.ayanamsha, val: ayanamshaStr },
    { label: t.balanceDasha, val: formatLocalizedDashaBalance(astrologicalDetails.dashaBalance, lang) },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.jananaTitle}
        </h2>
      </div>

      <div className="my-auto py-2">
        <div className="border border-slate-900 overflow-hidden rounded-xl">
          <table className="w-full text-xs font-serif">
            <tbody>
              {combinedRows.map((r, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-amber-50/20' : 'bg-white'}`}>
                  <td className="py-2 px-4 font-bold text-slate-700 border-r border-slate-200 w-1/2">
                    {r.label}
                  </td>
                  <td className="py-2 px-4 font-black text-slate-950 font-mono">
                    {r.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.certifiedFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
