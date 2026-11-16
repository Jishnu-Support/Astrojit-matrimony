import React from 'react';
import { DOSSIER_TRANSLATIONS } from './dossierI18n';

export default function DossierChevvaiDosha({
  chevvaiDoshaAnalysis = {},
  pageNumber = 33,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const { hasDosha = false, isCancelled = true, houses = { lagna: 8, moon: 2, venus: 10 } } = chevvaiDoshaAnalysis;

  const exemptionRulesByLang = {
    ta: [
      { rule: 'விதி 1: மிதுனம் - கன்னி 2-ம் இடமாகி அதில் செவ்வாய் இருந்தாலும் தோஷமில்லை.', applied: true },
      { rule: 'விதி 2: மேஷம் - விருச்சிகம் 4-ம் இடமாகி அதில் செவ்வாய் இருந்தாலும் தோஷமில்லை.', applied: false },
      { rule: 'விதி 3: மகரம் - கடகம் 7-ம் இடமாகி அதில் செவ்வாய் இருந்தாலும் தோஷமில்லை.', applied: false },
      { rule: 'விதி 4: தனுசு - மீனம் 8-ம் இடமாகி அதில் செவ்வாய் இருந்தாலும் தோஷமில்லை.', applied: true },
      { rule: 'விதி 5: செவ்வாய் சிம்மம், மேஷம், விருச்சிகம், மகரம், கும்பம் இவைகளில் இருந்தால் செவ்வாயினால் ஏற்படும் எந்த தோஷமும் இல்லை.', applied: true },
      { rule: 'விதி 6: செவ்வாய் இருக்கும் ராசிநாதன் செவ்வாய்க்கு கேந்திர திரிகோணங்களில் இருந்தாலும், புதன், சந்திரன், சுக்கிரன், குரு ஆகியவர்களோடு கூடினாலும் தோஷப் பரிகாரம்.', applied: true },
      { rule: 'விதி 7: கடக, சிம்ம லக்கினங்களில் பிறந்தவர்களுக்கு செவ்வாயினால் வரும் எவ்வகை தோஷமும் இல்லை.', applied: false },
    ],
    kn: [
      { rule: 'ನಿಯಮ 1: ಮಿಥುನ ಅಥವಾ ಕನ್ಯಾ 2ನೇ ಮನೆಯಾಗಿ ಅಲ್ಲಿ ಕುಜ ಸ್ಥಿತನಿದ್ದರೂ ದೋಷವಿಲ್ಲ.', applied: true },
      { rule: 'ನಿಯಮ 2: ಮೇಷ ಅಥವಾ ವೃಶ್ಚಿಕ 4ನೇ ಮನೆಯಾಗಿ ಅಲ್ಲಿ ಕುಜ ಸ್ಥಿತನಿದ್ದರೂ ದೋಷವಿಲ್ಲ.', applied: false },
      { rule: 'ನಿಯಮ 3: ಮಕರ ಅಥವಾ ಕರ್ಕಾಟಕ 7ನೇ ಮನೆಯಾಗಿ ಅಲ್ಲಿ ಕುಜ ಸ್ಥಿತನಿದ್ದರೂ ದೋಷವಿಲ್ಲ.', applied: false },
      { rule: 'ನಿಯಮ 4: ಧನುಸ್ಸು ಅಥವಾ ಮೀನ 8ನೇ ಮನೆಯಾಗಿ ಅಲ್ಲಿ ಕುಜ ಸ್ಥಿತನಿದ್ದರೂ ದೋಷವಿಲ್ಲ.', applied: true },
      { rule: 'ನಿಯಮ 5: ಕುಜನು ಸಿಂಹ, ಮೇಷ, ವೃಶ್ಚಿಕ, ಮಕರ, ಕುಂಭ ರಾಶಿಗಳಲ್ಲಿದ್ದರೆ ಯಾವುದೇ ಕುಜ ದೋಷ ಉಂಟಾಗುವುದಿಲ್ಲ.', applied: true },
      { rule: 'ನಿಯಮ 6: ಕುಜ ಸ್ಥಿತ ರಾಶ್ಯಾಧಿಪತಿಯು ಕೇಂದ್ರ ಅಥವಾ ತ್ರಿಕೋಣದಲ್ಲಿದ್ದರೂ, ಗುರು, ಬುಧ, ಚಂದ್ರ, ಶುಕ್ರರ ಯುತಿ ಅಥವಾ ದೃಷ್ಟಿ ಇದ್ದರೂ ದೋಷ ನಿವೃತ್ತಿಯಾಗುತ್ತದೆ.', applied: true },
      { rule: 'ನಿಯಮ 7: ಕರ್ಕಾಟಕ ಮತ್ತು ಸಿಂಹ ಲಗ್ನದಲ್ಲಿ ಜನಿಸಿದವರಿಗೆ ಕುಜ ದೋಷವಿರುವುದಿಲ್ಲ.', applied: false },
    ],
    hi: [
      { rule: 'नियम 1: मिथुन या कन्या द्वितीय भाव में हो और मंगल वहाँ स्थित हो तो मांगलिक दोष नहीं होता।', applied: true },
      { rule: 'नियम 2: मेष या वृश्चिक चतुर्थ भाव में हो और मंगल वहाँ स्थित हो तो दोष नहीं होता।', applied: false },
      { rule: 'नियम 3: मकर या कर्क सप्तम भाव में हो और मंगल स्थित हो तो दोष नहीं होता।', applied: false },
      { rule: 'नियम 4: धनु या मीन अष्टम भाव में हो और मंगल स्थित हो तो दोष नहीं होता।', applied: true },
      { rule: 'नियम 5: सिंह, मेष, वृश्चिक, मकर, कुंभ राशियों में मंगल के स्थित होने पर भौम दोष नहीं लगता।', applied: true },
      { rule: 'नियम 6: मंगल के राशि स्वामी यदि केंद्र या त्रिकोण में हों, अथवा गुरु, बुध, शुक्र, चंद्र की दृष्टि या युति हो तो दोष शांत हो जाता है।', applied: true },
      { rule: 'नियम 7: कर्क एवं सिंह लग्न में उत्पन्न जातकों को मंगल से कोई दोष नहीं होता।', applied: false },
    ],
    te: [
      { rule: 'నియమం 1: మిథునం లేదా కన్య 2వ స్థానమై అందులో కుజుడు ఉన్నా దోషం లేదు.', applied: true },
      { rule: 'నియమం 2: మేషం లేదా వృశ్చికం 4వ స్థానమై అందులో కుజుడు ఉన్నా దోషం లేదు.', applied: false },
      { rule: 'నియమం 3: మకరం లేదా కర్కాటకం 7వ స్థానమై అందులో కుజుడు ఉన్నా దోషం లేదు.', applied: false },
      { rule: 'నియమం 4: ధనుస్సు లేదా మీనం 8వ స్థానమై అందులో కుజుడు ఉన్నా దోషం లేదు.', applied: true },
      { rule: 'నియమం 5: కుజుడు సింహం, మేషం, వృశ్చికం, మకరం, కుంభ రాశులలో ఉంటే ఎలాంటి కుజ దోషం ఉండదు.', applied: true },
      { rule: 'నియమం 6: కుజుడు ఉన్న రాశ్యాధిపతి కేంద్ర, త్రికోణాలలో ఉన్నా, గురు, బుధ, చంద్ర, శుక్రుల కలయిక లేదా దృష్టి ఉన్నా దోష నివృత్తి.', applied: true },
      { rule: 'నియమం 7: కర్కాటక, సింహ లగ్నాలలో జన్మించిన వారికి కుజ దోషం వర్తించదు.', applied: false },
    ],
    en: [
      { rule: 'Rule 1: If Gemini or Virgo falls in the 2nd house and Mars is placed therein, no dosha arises.', applied: true },
      { rule: 'Rule 2: If Aries or Scorpio falls in the 4th house and Mars is placed therein, no dosha arises.', applied: false },
      { rule: 'Rule 3: If Capricorn or Cancer falls in the 7th house and Mars is placed therein, no dosha arises.', applied: false },
      { rule: 'Rule 4: If Sagittarius or Pisces falls in the 8th house and Mars is placed therein, no dosha arises.', applied: true },
      { rule: 'Rule 5: When Mars is posited in Leo, Aries, Scorpio, Capricorn, or Aquarius, it causes no adverse affliction.', applied: true },
      { rule: 'Rule 6: If the dispositor of Mars is in a Kendra or Trikona, or conjoined/aspected by Jupiter, Mercury, Venus, or Moon, the affliction is cancelled.', applied: true },
      { rule: 'Rule 7: For natives born in Cancer or Leo Ascendant, Mars acts as a Yogakaraka and causes no dosha.', applied: false },
    ]
  };

  const exemptionRules = exemptionRulesByLang[lang] || exemptionRulesByLang.en;

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.chevvaiDoshaTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-5">
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-300 text-xs font-serif text-slate-800 leading-relaxed">
          <p>
            {t.chevvaiIntro}
          </p>
        </div>

        {/* Mars Positions Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-serif">
          <div className="p-3 border border-slate-900 rounded-xl bg-slate-50">
            <span className="text-slate-500 font-bold block">{t.marsFromLagna}:</span>
            <span className="text-lg font-black text-slate-950 font-mono">{houses.lagna} {t.houseNum}</span>
          </div>
          <div className="p-3 border border-slate-900 rounded-xl bg-slate-50">
            <span className="text-slate-500 font-bold block">{t.marsFromMoon}:</span>
            <span className="text-lg font-black text-slate-950 font-mono">{houses.moon} {t.houseNum}</span>
          </div>
          <div className="p-3 border border-slate-900 rounded-xl bg-slate-50">
            <span className="text-slate-500 font-bold block">{t.marsFromVenus}:</span>
            <span className="text-lg font-black text-slate-950 font-mono">{houses.venus} {t.houseNum}</span>
          </div>
        </div>

        {/* Classical Exemptions List */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.exemptionSastrasTitle}
          </h3>
          <div className="space-y-1.5 text-xs font-serif">
            {exemptionRules.map((er, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border ${
                  er.applied
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>{er.rule}</span>
                {er.applied && (
                  <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-mono uppercase">
                    {t.appliedTag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="border-2 border-emerald-600 bg-emerald-50/60 p-4 rounded-xl text-center font-serif space-y-1">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest block">
            {t.doshaVerdictTitle}
          </span>
          <h4 className="text-base sm:text-lg font-black text-emerald-950">
            {isCancelled || !hasDosha ? t.doshaCancelledMsg : t.doshaPresentMsg}
          </h4>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
