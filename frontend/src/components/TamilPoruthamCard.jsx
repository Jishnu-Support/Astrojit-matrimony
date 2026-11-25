import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Compass,
  Heart,
  Info,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { useLang } from '../i18n';
import { MATCH_I18N, getMatchText, translateEntity } from '../matchmakingI18n';
import GujaDashaChart from './GujaDashaChart';
import RahuKetuChart from './RahuKetuChart';

/**
 * Astrojit Classical 10 & 12 Vivaha Porutham Card
 * STRICT MULTI-LANGUAGE COMPLIANCE:
 * - If Kannada is selected, EVERYTHING renders in pure Kannada.
 * - If Tamil is selected, EVERYTHING renders in pure Tamil.
 * - If English is selected, EVERYTHING renders in pure English.
 * - Never show two languages mixed together.
 */
export default function TamilPoruthamCard({ matchReport }) {
  const { lang } = useLang();
  const [expandedPorutham, setExpandedPorutham] = useState(null);
  const [showAllPoruthams, setShowAllPoruthams] = useState(false);
  const [showGujaChart, setShowGujaChart] = useState(false);
  const [showRahuKetuChart, setShowRahuKetuChart] = useState(false);

  if (!matchReport) return null;

  const { tamilPorutham, chevvaiAnalysis, boy, girl } = matchReport;

  if (!tamilPorutham) return null;

  const {
    poruthams = [],
    totalScore = 0,
    maxScore = 10,
    rajjuAnalysis = {},
    vedhaAnalysis = {},
    subhaShashtashtakam = {},
    boyDetails = {},
    girlDetails = {},
  } = tamilPorutham;

  // Decide overall verdict text strictly in the active language
  const getOverallVerdict = () => {
    if (totalScore >= 7) {
      return MATCH_I18N.verdicts.uttamam[lang] || MATCH_I18N.verdicts.uttamam.en;
    }
    if (totalScore >= 5) {
      return MATCH_I18N.verdicts.madhyamam[lang] || MATCH_I18N.verdicts.madhyamam.en;
    }
    return MATCH_I18N.verdicts.adhama[lang] || MATCH_I18N.verdicts.adhama.en;
  };

  // Status badge strictly in active language
  const getStatusBadge = (status) => {
    if (status === 'Uttamam') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[11px] border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{MATCH_I18N.statusUttamam[lang] || MATCH_I18N.statusUttamam.en}</span>
        </span>
      );
    }
    if (status === 'Madhyamam') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[11px] border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>{MATCH_I18N.statusMadhyamam[lang] || MATCH_I18N.statusMadhyamam.en}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[11px] border border-rose-300">
        <XCircle className="w-3 h-3 text-rose-600" />
        <span>{MATCH_I18N.statusPorunthathu[lang] || MATCH_I18N.statusPorunthathu.en}</span>
      </span>
    );
  };

  // Map Porutham item key to MATCH_I18N.poruthams
  const getPoruthamKey = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('dina')) return 'dina';
    if (n.includes('gana')) return 'gana';
    if (n.includes('mahendra')) return 'mahendra';
    if (n.includes('stree')) return 'streeDeergham';
    if (n.includes('yoni')) return 'yoni';
    if (n.includes('adhipathi')) return 'rasiAdhipathi';
    if (n.includes('rasi') || n.includes('rashi')) return 'rasi';
    if (n.includes('vashya')) return 'vashya';
    if (n.includes('rajju')) return 'rajju';
    if (n.includes('vedha')) return 'vedha';
    if (n.includes('nadi')) return 'nadi';
    if (n.includes('vriksha')) return 'vriksha';
    return 'dina';
  };

  // Get localized rule explanation
  const getLocalizedRule = (item, pKey) => {
    // If language is Tamil, use item.rule which has Tamil panchang quotes
    if (lang === 'ta') return item.rule;

    // Localized rule description for other languages
    if (pKey === 'dina') {
      if (item.status === 'Uttamam') {
        if (lang === 'kn') return 'ದಿನ ಹೊಂದಾಣಿಕೆ ಶುಭ ತಾರಾಬಲದಲ್ಲಿದೆ. ದೀರ್ಘಾಯುಷ್ಯ ಮತ್ತು ನಿರಂತರ ಕ್ಷೇಮವನ್ನು ನೀಡುತ್ತದೆ.';
        if (lang === 'hi') return 'दिन कूट शुभ ताराबल में स्थित है। यह दीर्घायु और आरोग्य प्रदान करता है।';
        if (lang === 'te') return 'దిన కూటం శుభ తారాబలంలో ఉన్నది. ఆయురారోగ్యాలు ప్రసాదిస్తుంది.';
        if (lang === 'bn') return 'দিন কূট শুভ তারাফলে অবস্থিত। দীর্ঘায়ু ও সুস্বাস্থ্য প্রদান করে।';
        return 'Auspicious Tarabalam count. Bestows robust vitality and health.';
      }
      if (lang === 'kn') return 'ದಿನ ಸಂಖ್ಯೆಯು ಅಶುಭ ತಾರಾಬಲದಲ್ಲಿದೆ. ಶಾಸ್ತ್ರೋಕ್ತ ದೋಷವಿರುವುದರಿಂದ ಅಂಕವಿಲ್ಲ.';
      if (lang === 'hi') return 'दिन संख्या अशुभ ताराबल में है। कोई अंक नहीं मिला।';
      if (lang === 'te') return 'దిన సంఖ్య అశుభ తారాబలంలో ఉన్నది.';
      if (lang === 'bn') return 'দিন সংখ্যাটি অশুভ তারাফলে রয়েছে।';
      return 'Inauspicious Tarabalam count.';
    }

    if (pKey === 'gana') {
      if (item.status === 'Uttamam') {
        if (lang === 'kn') return 'ಇಬ್ಬರಿಗೂ ಒಂದೇ ಗಣ ಬಂದಿರುವುದರಿಂದ ಪರಸ್ಪರ ಪ್ರೀತಿ ಮತ್ತು ಮನೋಭಾವದ ಸಾಮರಸ್ಯವಿರುತ್ತದೆ.';
        if (lang === 'hi') return 'दोनों का एक ही गण होने से परस्पर स्वाभाविक प्रेम एवं मानसिक सामंजस्य रहेगा।';
        if (lang === 'te') return 'ఇద్దరిదీ ఒకే గణం అయినందున సంపూర్ణ ప్రేమానురాగాలు ఉంటాయి.';
        if (lang === 'bn') return 'উভয়ের একই গণ হওয়ার কারণে মানসিক ঐক্য ও প্রীতি বজায় থাকবে।';
        return 'Both belong to the same Gana, ensuring temperamental harmony.';
      }
      if (item.status === 'Madhyamam') {
        if (lang === 'kn') return 'ವರ ಮತ್ತು ವಧುವಿನ ಗಣಗಳು ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆಯಲ್ಲಿವೆ ಅಥವಾ 14 ನಕ್ಷತ್ರಗಳ ಅಂತರದ ವಿನಾಯಿತಿ ಲಭಿಸಿದೆ.';
        if (lang === 'hi') return 'वर-कन्या के गणों में मध्यम सामंजस्य है या १४ नक्षत्रों से अधिक दूरी का शास्त्रीय परिहार प्राप्त है।';
        if (lang === 'te') return 'గణాల్లో మధ్యమ పొంతన లేదా 14 నక్షత్రాల దూరం వల్ల శాస్త్ర మినహాయింపు లభించింది.';
        if (lang === 'bn') return 'মধ্যম গণ মিলন অথবা ১৪ নক্ষত্রের অধিক দূরত্বের শাস্ত্রীয় খণ্ডন নিয়ম প্রযোজ্য।';
        return 'Moderate Gana compatibility or >14 stars distance cancellation applies.';
      }
      if (lang === 'kn') return 'ರಾಕ್ಷಸ ಗಣದ ವಧು ಮತ್ತು ಮನುಷ್ಯ/ದೇವ ಗಣದ ವರನಿಗೆ 14 ನಕ್ಷತ್ರಗಳ ಅಂತರವಿಲ್ಲದ ಕಾರಣ ಗಣ ದೋಷವಿದೆ.';
      if (lang === 'hi') return 'राक्षस गण की कन्या और देव/मनुष्य वर में १४ नक्षत्र से कम दूरी होने पर गण दोष है।';
      return 'Gana incompatibility without classical cancellation.';
    }

    if (pKey === 'rajju') {
      if (rajjuAnalysis?.isArohaAvarohaException) {
        if (lang === 'kn') return 'ಇಬ್ಬರಿಗೂ ಒಂದೇ ರಜ್ಜು ಇದ್ದರೂ ಒಬ್ಬರಿಗೆ ಏರುಮುಖ ಮತ್ತು ಇನ್ನೊಬ್ಬರಿಗೆ ಇಳಿಮುಖವಾಗಿರುವುದರಿಂದ ರಜ್ಜು ದೋಷ ನಿವಾರಣೆಯಾಗಿ ಉತ್ತಮವಾಗಿದೆ!';
        if (lang === 'hi') return 'समान रज्जु होने पर भी एक का आरोह एवं दूसरे का अवरोह होने से रज्जु दोष का पूर्ण परिहार होकर उत्तम फल है!';
        if (lang === 'te') return 'ఒకే రజ్జు అయినా ఒకరికి ఏరుముఖం, మరొకరికి దిగుడుముఖం కావడంతో రజ్జు దోషం తొలగి ఉత్తమమైంది!';
        if (lang === 'bn') return 'একই রজ্জু হলেও একজনের আরোহ এবং অন্যজনের অবরোহ হওয়ার কারণে রজ্জু দোষ খণ্ডিত হয়ে উত্তম হয়েছে!';
        return 'Both share the same Rajju limb, but opposite Aroha/Avaroha directions cancel the dosha into Uttamam!';
      }
      if (item.status === 'Uttamam') {
        if (lang === 'kn') return 'ವಿಭಿನ್ನ ರಜ್ಜುಗಳಲ್ಲಿ ನಕ್ಷತ್ರಗಳು ಇರುವುದರಿಂದ ದೀರ್ಘ ಸುಮಂಗಲೀ ಯೋಗ ಮತ್ತು ಪರಿಪೂರ್ಣ ಸೌಭಾಗ್ಯ.';
        if (lang === 'hi') return 'परस्पर भिन्न रज्जु होने से अखण्ड सौभाग्य एवं दीर्घायु का वरदान प्राप्त है।';
        if (lang === 'te') return 'వేర్వేరు రజ్జులు కావడంతో దీర్ಘ సుమంగళీ యోగం లభిస్తుంది.';
        if (lang === 'bn') return 'ভিন্ন ভিন্ন রজ্জু হওয়ায় অখণ্ড সৌভাগ্য ও দীর্ঘ দাম্পত্য জীবন নিশ্চিত হয়।';
        return 'Different Rajju limbs guarantee lifelong Mangalya strength.';
      }
      if (lang === 'kn') return 'ಒಂದೇ ರಜ್ಜು ಮತ್ತು ಒಂದೇ ಮುಖದಲ್ಲಿ ಬಂದಿರುವುದರಿಂದ ರಜ್ಜು ತಟ್ಟುವಿಕೆ (ದೋಷ) ಉಂಟಾಗಿದೆ. ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ಅಗತ್ಯ.';
      if (lang === 'hi') return 'एक ही रज्जु व समान गति होने से रज्जु दोष है। उपाय एवं विचार आवश्यक है।';
      return 'Same Rajju limb with identical motion creates Rajju Dosha affliction.';
    }

    if (pKey === 'rasi') {
      if (subhaShashtashtakam?.isSubhaShashtashtakam) {
        if (lang === 'kn') return 'ದೇವಕೇರಳಂ ಶಾಸ್ತ್ರದ ಪ್ರಕಾರ ರಾಶ್ಯಾಧಿಪತಿಗಳ ಸ್ನೇಹದಿಂದಾಗಿ 6-8 ರಾಶಿ ದೂರವಿದ್ದರೂ ಶುಭ ಶಷ್ಠಾಷ್ಟಕವೆಂದು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ!';
        if (lang === 'hi') return 'देवकेरलम् ग्रंथानुसार राशीशों की परस्पर मित्रता के कारण ६-८ अंतर होने पर भी शुभ षष्ठाष्टक मान्य है!';
        if (lang === 'te') return 'దేవకేరళం గ్రంథం ప్రకారం రాశ్యాధిపతుల మైత్రి వల్ల 6-8 దూరం ఉన్నా శుభ షష్టాష్టకంగా అంగీకరించబడింది!';
        if (lang === 'bn') return 'দেবকেরলম শাস্ত্রানুযায়ী অধিপতিদের মিত্রতার ফলে ৬-৮ ব্যবধান হলেও শুভ ষষ্ঠাষ্টক হিসেবে গ্রাহ্য!';
        return 'Deva Keralam classical exemption: Lords are mutual friends, deemed Subha Shashtashtakam!';
      }
    }

    return item.rule;
  };

  // Aroha/Avaroha special banner text
  const getArohaBannerText = () => {
    const limbName = translateEntity('rajjuLimbs', rajjuAnalysis.boyRajju, lang);
    const boyDir = translateEntity('rajjuDirections', rajjuAnalysis.boyDirection, lang);
    const girlDir = translateEntity('rajjuDirections', rajjuAnalysis.girlDirection, lang);

    if (lang === 'kn') {
      return `ಇಬ್ಬರಿಗೂ ಒಂದೇ ಶಾಖೆಯಾದ ${limbName} ರಜ್ಜು ಬಂದಿದ್ದರೂ, ವರನಿಗೆ ${boyDir} ಮತ್ತು ವಧುವಿಗೆ ${girlDir} ಚಲನೆ ಇರುವುದರಿಂದ, ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ರಜ್ಜು ದೋಷ ಸಂಪೂರ್ಣವಾಗಿ ನಿವಾರಣೆಯಾಗಿ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ.`;
    }
    if (lang === 'ta') {
      return `இருவரும் ஒரே ${limbName} ரஜ்ஜுவில் அமைந்திருந்தாலும், வரன் ${boyDir} மற்றும் பெண் ${girlDir} என மாறி அமைந்ததால், சுத்த திருக்கணித நூல் விதிப்படி ரஜ்ஜு தோஷம் முற்றிலுமாக நீங்கி உத்தமப் பொருத்தமாகிறது.`;
    }
    if (lang === 'hi') {
      return `यद्यपि दोनों का एक ही ${limbName} रज्जु है, किंतु वर का ${boyDir} और कन्या का ${girlDir} होने से शास्त्रीय नियमानुसार रज्जु दोष पूर्णतः समाप्त होकर उत्तम मिलान सिद्ध होता है।`;
    }
    if (lang === 'te') {
      return `ఇద్దరిదీ ఒకే ${limbName} రజ్జు అయినప్పటికీ, వరునికి ${boyDir} మరియు వధువుకు ${girlDir} కావడంతో రజ్జు దోషం తొలగి ఉత్తమ పొంతనగా మారుతుంది.`;
    }
    if (lang === 'bn') {
      return `উভয়ের একই ${limbName} রজ্জু হলেও, বরের ${boyDir} এবং কনের ${girlDir} গতির কারণে শাস্ত্রীয় বিধিমতে রজ্জু দোষ দূরীভূত হয়ে উত্তম মিলন হয়।`;
    }
    return `Although both belong to the ${limbName} limb, Groom has ${boyDir} and Bride has ${girlDir}. As per classical Sastra, the Rajju affliction is fully cancelled into Uttamam.`;
  };

  // Chevvai Dosha summary text
  const getChevvaiStatusText = (person) => {
    if (person?.isCancelled) {
      if (lang === 'kn') return 'ಕುಜ ದೋಷ ನಿವಾರಣೆ (ದೋಷ ಮುಕ್ತ)';
      if (lang === 'ta') return 'செவ்வாய் தோஷ நிவர்த்தி (தோஷமில்லை)';
      if (lang === 'hi') return 'मंगल दोष निवृत्ति (दोष रहित)';
      if (lang === 'te') return 'కుజ దోష నివారణ (దోషం లేదు)';
      if (lang === 'bn') return 'মঙ্গল দোষ খণ্ডন (দোষমুক্ত)';
      return 'Mars Dosha Cancelled (Exempted)';
    }
    if (person?.hasDosha) {
      if (lang === 'kn') return 'ಕುಜ ದೋಷವಿದೆ';
      if (lang === 'ta') return 'செவ்வாய் தோஷம் உள்ளது';
      if (lang === 'hi') return 'मंगल दोष उपस्थित';
      if (lang === 'te') return 'కుజ దోషం ఉన్నది';
      if (lang === 'bn') return 'মঙ্গল দোষ বিদ্যমান';
      return 'Mars Dosha Present';
    }
    if (lang === 'kn') return 'ದೋಷವಿಲ್ಲ (ಸಾಮಾನ್ಯ ಸ್ಥಿತಿ)';
    if (lang === 'ta') return 'தோஷமில்லை';
    if (lang === 'hi') return 'दोष नहीं';
    if (lang === 'te') return 'దోషం లేదు';
    if (lang === 'bn') return 'দোষ নেই';
    return 'No Mars Dosha';
  };

  // Chevvai houses placement string
  const getChevvaiHousesString = (houses = {}) => {
    const lagna = houses?.lagna || 9;
    const moon = houses?.moon || 11;
    const venus = houses?.venus || 5;

    if (lang === 'kn') {
      return `ಲಗ್ನದಿಂದ ${lagna}, ಚಂದ್ರನಿಂದ ${moon}, ಶುಕ್ರನಿಂದ ${venus} ನೇ ಮನೆ.`;
    }
    if (lang === 'ta') {
      return `லக்னத்திலிருந்து ${lagna}-ஆம் இடம், சந்திரனிலிருந்து ${moon}-ஆம் இடம், சுக்கிரனிலிருந்து ${venus}-ஆம் இடம்.`;
    }
    if (lang === 'hi') {
      return `लग्न से ${lagna} भाव, चन्द्र से ${moon} भाव, शुक्र से ${venus} भाव।`;
    }
    if (lang === 'te') {
      return `లగ్నం నుండి ${lagna}, చంద్రుని నుండి ${moon}, శుక్రుని నుండి ${venus} వ స్థానం.`;
    }
    if (lang === 'bn') {
      return `লগ্ন থেকে ${lagna}, চন্দ্র থেকে ${moon}, শুক্র থেকে ${venus} ভাব।`;
    }
    return `House ${lagna} from Ascendant, ${moon} from Moon, ${venus} from Venus.`;
  };

  // Localized cancellation rules for Chevvai
  const getChevvaiCancellationText = (c) => {
    if (lang === 'ta') return c;
    if (c.includes('Simha') || c.includes('சிம்மம்')) {
      if (lang === 'kn') return 'ಸಿಂಹ ಅಥವಾ ಕಟಕ ಲಗ್ನದಲ್ಲಿ ಜನಿಸಿದವರಿಗೆ ಕುಜ ಶುಭ ಯೋಗಕಾರಕನಾದ್ದರಿಂದ ದೋಷವಿಲ್ಲ.';
      if (lang === 'hi') return 'कर्क अथवा सिंह लग्न में जन्मे जातकों हेतु मंगल योगकारक होने से दोष नहीं होता।';
      if (lang === 'te') return 'కర్కాటక, సింహ లగ్నాలలో జన్మించిన వారికి కుజుడు యోగకారకుడు కావున దోషం ఉండదు.';
      if (lang === 'bn') return 'কর্কট বা সিংহ লগ্নে জন্মগ্রহণকারীদের জন্য মঙ্গল যোগকারক হওয়ায় কোনও দোষ হয় না।';
      return 'Born in Cancer or Leo Ascendant: Mars is auspicious Yogakaraka, hence no affliction.';
    }
    if (c.includes('Jupiter') || c.includes('குரு')) {
      if (lang === 'kn') return 'ಕುಜನಿಗೆ ಶುಭ ಗುರು ದೃಷ್ಟಿ ಅಥವಾ ಸಂಯೋಗವಿರುವುದರಿಂದ ಕುಜ ದೋಷ ನಿವಾರಣೆಯಾಗಿದೆ.';
      if (lang === 'hi') return 'मंगल पर शुभ बृहस्पति की दृष्टि अथवा युति होने से दोष निवृत्ति हो जाती है।';
      if (lang === 'te') return 'కుజునిపై శుభ గురు దృష్టి లేదా కలయిక ఉన్నందున కుజ దోషం తొలగిపోయింది.';
      if (lang === 'bn') return 'মঙ্গলের উপর শুভ বৃহস্পতির দৃষ্টি বা সংযোগ থাকার কারণে মঙ্গল দোষ খণ্ডিত হয়।';
      return 'Mars is aspected or conjoined by benefic Jupiter, cancelling the affliction.';
    }
    if (c.includes('own') || c.includes('ஆட்சி')) {
      if (lang === 'kn') return 'ಕುಜನು ಸ್ವಕ್ಷೇತ್ರ, ಉಚ್ಚ ಅಥವಾ ಮಿತ್ರ ರಾಶಿಯಾದ ಮೇಷ, ವೃಶ್ಚಿಕ, ಮಕರ, ಸಿಂಹ, ಕುಂಭದಲ್ಲಿ ಇರುವುದರಿಂದ ದೋಷವಿಲ್ಲ.';
      if (lang === 'hi') return 'मंगल स्वराशि, उच्च या मित्र राशि (मेष, वृश्चिक, मकर, सिंह, कुंभ) में स्थित होने से दोषमुक्त है।';
      if (lang === 'te') return 'కుజుడు స్వక్షేత్రం, ఉచ్ఛ లేదా మిత్ర రాశులలో ఉన్నందున దోషం ఉండదు.';
      if (lang === 'bn') return 'মঙ্গল স্বক্ষেত্র, তুঙ্গ বা মিত্র রাশিতে অবস্থিত হওয়ায় দোষমুক্ত।';
      return 'Mars is positioned in own, exaltation or friendly sign, granting exemption.';
    }
    return c;
  };

  const displayedPoruthams = showAllPoruthams ? poruthams : poruthams.slice(0, 10);

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Overall Verdict Header Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          totalScore >= 7
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-emerald-300 shadow-xs'
            : totalScore >= 5
            ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-300 shadow-xs'
            : 'bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 border-rose-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                {MATCH_I18N.panchangTitle[lang] || MATCH_I18N.panchangTitle.en}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {MATCH_I18N.primary10Badge[lang] || MATCH_I18N.primary10Badge.en}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {getOverallVerdict()}
            </h3>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-center justify-between sm:justify-end bg-white/90 px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs">
            <Award
              className={`w-6 h-6 shrink-0 ${
                totalScore >= 7
                  ? 'text-emerald-600'
                  : totalScore >= 5
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            />
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                {totalScore} <span className="text-sm text-slate-400 font-semibold">/ {maxScore}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {MATCH_I18N.scoreBadgeLabel[lang] || MATCH_I18N.scoreBadgeLabel.en}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Critical Alert Banners (Rajju Aroha/Avaroha & Subha Shashtashtakam) */}
      {rajjuAnalysis?.isArohaAvarohaException && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-400 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-emerald-950 font-bold text-xs sm:text-sm">
                {MATCH_I18N.arohaAvarohaExemptionHeading[lang] || MATCH_I18N.arohaAvarohaExemptionHeading.en}
              </strong>
              <span className="bg-emerald-600 text-white font-bold px-2 py-0.2 rounded-full text-[10px]">
                {MATCH_I18N.arohaAvarohaBadge[lang] || MATCH_I18N.arohaAvarohaBadge.en}
              </span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              {getArohaBannerText()}
            </p>
          </div>
        </div>
      )}

      {rajjuAnalysis?.hasDosha && !rajjuAnalysis.isArohaAvarohaException && (
        <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-rose-950 font-bold text-xs sm:text-sm">
              {MATCH_I18N.rajjuDoshaWarning[lang] || MATCH_I18N.rajjuDoshaWarning.en}: {translateEntity('rajjuLimbs', rajjuAnalysis.limbAfflicted, lang)}
            </strong>
            <p className="text-rose-800 leading-relaxed">
              {lang === 'kn'
                ? 'ಇಬ್ಬರಿಗೂ ಒಂದೇ ರಜ್ಜು ಹಾಗೂ ಒಂದೇ ಚಲನೆ ಇರುವುದರಿಂದ ರಜ್ಜು ದೋಷವಿದೆ. ದಯವಿಟ್ಟು ಪರಿಣಿತ ಜ್ಯೋತಿಷಿಗಳ ಸಮಾಲೋಚನೆ ಮತ್ತು ಪರಿಹಾರ ಪಡೆಯಿರಿ.'
                : lang === 'ta'
                ? 'இருவருக்கும் ஒரே ரஜ்ஜு அமைந்ததோடு ஒரே திசையில் வந்ததால் ரஜ்ஜு தட்டல் உள்ளது. ஜோதிடரின் பரிசீலனை மற்றும் பரிகாரம் அவசியம்.'
                : lang === 'hi'
                ? 'दोनों का समान रज्जु एवं समान गति होने से रज्जु दोष है। वैदिक शांति एवं ज्योतिषी परामर्श आवश्यक है।'
                : 'Both share the same Rajju limb without motion variation, resulting in Rajju affliction. Astrologer consultation is advised.'}
            </p>
          </div>
        </div>
      )}

      {subhaShashtashtakam?.isSubhaShashtashtakam && (
        <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950">
            <strong className="font-bold">
              {MATCH_I18N.subhaShashtashtakamHeading[lang] || MATCH_I18N.subhaShashtashtakamHeading.en}:
            </strong>{' '}
            <span>
              {lang === 'kn'
                ? '6-8 ರಾಶಿ ಅಂತರವಿದ್ದರೂ, ಉಭಯ ರಾಶ್ಯಾಧಿಪತಿಗಳು ಪರಸ್ಪರ ಮಿತ್ರರಾಗಿರುವುದರಿಂದ ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಶುಭ ಶಷ್ಠಾಷ್ಟಕವೆಂದು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ.'
                : lang === 'ta'
                ? '6-8 ராசி இடைவெளி இருப்பினும், இரு ராசிநாதர்களும் பரஸ்பர நட்பு/சம கிரகங்களாக அமைவதால் தேவகேரளம் படி சுப ஷஷ்டாஷ்டகமாக பொருந்தும்.'
                : lang === 'hi'
                ? 'यद्यपि ६-८ राशि अंतर है, तथापि दोनों राशि स्वामियों में मित्रता होने से देवकेरलम् अनुसार शुभ षष्ठाष्टक मान्य है।'
                : 'Though 6-8 Rashi distance exists, friendship between sign lords grants classical Subha Shashtashtakam exemption.'}
            </span>
          </div>
        </div>
      )}

      {/* 3. Constellation & Biological Attributes Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          {MATCH_I18N.attributesHeading[lang] || MATCH_I18N.attributesHeading.en}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          {/* Bride attributes (Female - Left Side Default) */}
          <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs space-y-1.5">
            <div className="font-bold text-rose-900 flex flex-wrap justify-between items-center gap-1 border-b border-rose-50 pb-1">
              <span>{MATCH_I18N.brideHeading[lang] || MATCH_I18N.brideHeading.en}: {girl?.name || girlDetails?.name || 'Bride'}</span>
              <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold shrink-0">
                {translateEntity('nakshatras', girlDetails.star || girlDetails.nakshatra || girl?.starNakshatra || girl?.nakshatra, lang)} ({girlDetails.padam || girlDetails.pada || girl?.pada || '1'} {MATCH_I18N.attrLabels.pada[lang]})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-slate-600">
              <div>
                {MATCH_I18N.attrLabels.rashi[lang]}: <strong className="text-slate-800">{translateEntity('rashis', girlDetails.rasi || girlDetails.rashi || girl?.moonSign || girl?.rasi, lang)}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.gana[lang]}: <strong className="text-slate-800">{translateEntity('ganas', girlDetails.gana, lang)}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.yoni[lang]}: <strong className="text-slate-800">{translateEntity('animals', girlDetails.animal || girlDetails.yoni, lang)} ({girlDetails.yoniSex === 'Male' ? MATCH_I18N.attrLabels.male[lang] : MATCH_I18N.attrLabels.female[lang]})</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.bird[lang]}: <strong className="text-slate-800">{translateEntity('birds', girlDetails.bird, lang)}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.tree[lang]}: <strong className="text-slate-800">{translateEntity('trees', girlDetails.tree || girlDetails.vriksha, lang)} {girlDetails.milkyTree ? MATCH_I18N.attrLabels.milkyTree[lang] : ''}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.nadi[lang]}: <strong className="text-slate-800">{translateEntity('nadis', girlDetails.nadi, lang)}</strong>
              </div>
              <div className="sm:col-span-2 pt-0.5 border-t border-slate-100 text-rose-950">
                {MATCH_I18N.attrLabels.rajju[lang]}: <strong>{translateEntity('rajjuLimbs', girlDetails.rajju, lang)}</strong> • {MATCH_I18N.attrLabels.direction[lang]}: <strong>{translateEntity('rajjuDirections', girlDetails.rajjuDirection, lang)}</strong>
              </div>
            </div>
          </div>

          {/* Groom attributes (Male - Right Side Default) */}
          <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
            <div className="font-bold text-indigo-900 flex flex-wrap justify-between items-center gap-1 border-b border-indigo-50 pb-1">
              <span>{MATCH_I18N.groomHeading[lang] || MATCH_I18N.groomHeading.en}: {boy?.name || boyDetails?.name || 'Groom'}</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold shrink-0">
                {translateEntity('nakshatras', boyDetails.star || boyDetails.nakshatra || boy?.starNakshatra || boy?.nakshatra, lang)} ({boyDetails.padam || boyDetails.pada || boy?.pada || '1'} {MATCH_I18N.attrLabels.pada[lang]})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-slate-600">
              <div>
                {MATCH_I18N.attrLabels.rashi[lang]}: <strong className="text-slate-800">{translateEntity('rashis', boyDetails.rasi || boyDetails.rashi || boy?.moonSign || boy?.rasi, lang)}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.gana[lang]}: <strong className="text-slate-800">{translateEntity('ganas', boyDetails.gana, lang)}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.yoni[lang]}: <strong className="text-slate-800">{translateEntity('animals', boyDetails.animal || boyDetails.yoni, lang)} ({boyDetails.yoniSex === 'Male' ? MATCH_I18N.attrLabels.male[lang] : MATCH_I18N.attrLabels.female[lang]})</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.bird[lang]}: <strong className="text-slate-800">{translateEntity('birds', boyDetails.bird, lang)}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.tree[lang]}: <strong className="text-slate-800">{translateEntity('trees', boyDetails.tree || boyDetails.vriksha, lang)} {boyDetails.milkyTree ? MATCH_I18N.attrLabels.milkyTree[lang] : ''}</strong>
              </div>
              <div>
                {MATCH_I18N.attrLabels.nadi[lang]}: <strong className="text-slate-800">{translateEntity('nadis', boyDetails.nadi, lang)}</strong>
              </div>
              <div className="sm:col-span-2 pt-0.5 border-t border-slate-100 text-indigo-950">
                {MATCH_I18N.attrLabels.rajju[lang]}: <strong>{translateEntity('rajjuLimbs', boyDetails.rajju, lang)}</strong> • {MATCH_I18N.attrLabels.direction[lang]}: <strong>{translateEntity('rajjuDirections', boyDetails.rajjuDirection, lang)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Detailed Poruthams Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            {MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}
            <span className="text-[10px] text-slate-400 font-normal sm:hidden"> (Swipe ↔)</span>
          </span>
          <button
            type="button"
            onClick={() => setShowAllPoruthams(!showAllPoruthams)}
            className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer underline"
          >
            {showAllPoruthams
              ? MATCH_I18N.show10Btn[lang] || MATCH_I18N.show10Btn.en
              : MATCH_I18N.show12Btn[lang] || MATCH_I18N.show12Btn.en}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3"># {MATCH_I18N.colPorutham[lang] || MATCH_I18N.colPorutham.en}</th>
                <th className="py-2.5 px-3">{MATCH_I18N.colSignificance[lang] || MATCH_I18N.colSignificance.en}</th>
                <th className="py-2.5 px-3 text-center">{MATCH_I18N.colStatus[lang] || MATCH_I18N.colStatus.en}</th>
                <th className="py-2.5 px-3 text-center">{MATCH_I18N.colPoints[lang] || MATCH_I18N.colPoints.en}</th>
                <th className="py-2.5 px-2 text-center w-8">{MATCH_I18N.colRule[lang] || MATCH_I18N.colRule.en}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedPoruthams.map((item, index) => {
                const isExpanded = expandedPorutham === index;
                const pKey = getPoruthamKey(item.name);
                const pDef = MATCH_I18N.poruthams[pKey] || {};
                const localizedName = pDef.name?.[lang] || item.name;
                const localizedSig = pDef.significance?.[lang] || item.significance;

                return (
                  <React.Fragment key={index}>
                    <tr
                      className={`hover:bg-amber-50/20 cursor-pointer transition-colors ${
                        item.status === 'Uttamam'
                          ? 'bg-emerald-50/10'
                          : item.status === 'Porunthathu'
                          ? 'bg-rose-50/10'
                          : ''
                      }`}
                      onClick={() => setExpandedPorutham(isExpanded ? null : index)}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {localizedName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs leading-relaxed">
                        {localizedSig}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {item.points} <span className="text-slate-400 font-normal">/ {item.maxPoints}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 mx-auto text-amber-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 mx-auto hover:text-slate-600" />
                        )}
                      </td>
                    </tr>

                    {/* Expandable row showing precise sastra rule in the selected language */}
                    {isExpanded && (
                      <tr className="bg-amber-50/40">
                        <td colSpan={5} className="py-3 px-4 border-l-4 border-amber-500">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                              <Info className="w-3.5 h-3.5 text-amber-600" />
                              {MATCH_I18N.ruleExplanationHeading[lang] || MATCH_I18N.ruleExplanationHeading.en}
                            </span>
                            <p className="text-slate-800 leading-relaxed text-xs pl-4">
                              {getLocalizedRule(item, pKey)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Chevvai / Kuja / Mars Dosha Section */}
      {chevvaiAnalysis && (
        <div className="bg-white border border-rose-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-rose-100 pb-2 gap-2">
            <div>
              <h4 className="font-bold text-rose-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-600" />
                {MATCH_I18N.chevvaiDoshaHeading[lang] || MATCH_I18N.chevvaiDoshaHeading.en}
              </h4>
              <span className="text-[10px] text-slate-500">
                {MATCH_I18N.referenceBookPage[lang] || MATCH_I18N.referenceBookPage.en}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowGujaChart(!showGujaChart)}
              className="text-[11px] font-bold px-3 py-1 bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-700 hover:to-amber-800 text-white rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all self-end sm:self-auto"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {showGujaChart
                  ? (lang === 'ta' ? '▲ கட்டத்தை மறைக்கவும்' : '▲ Hide Chart')
                  : (lang === 'ta' ? '▼ செவ்வாய் தசா & கட்ட ஆய்வு' : '▼ View Guja Dasha & Chart')}
              </span>
            </button>
          </div>

          {/* Expandable Guja Dasha & South Indian Chart */}
          {showGujaChart && (
            <div className="pt-2 border-t border-rose-100">
              <GujaDashaChart matchReport={matchReport} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Girl's / Bride's Chevvai Status (Female - Left Side Default) */}
            <div
              className={`p-3 rounded-xl border ${
                chevvaiAnalysis.girl?.hasDosha
                  ? 'bg-rose-50/60 border-rose-200'
                  : chevvaiAnalysis.girl?.isCancelled
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{MATCH_I18N.brideHoroscope[lang] || MATCH_I18N.brideHoroscope.en}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    chevvaiAnalysis.girl?.hasDosha
                      ? 'bg-rose-200 text-rose-900'
                      : chevvaiAnalysis.girl?.isCancelled
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {getChevvaiStatusText(chevvaiAnalysis.girl)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-1">
                {getChevvaiHousesString(chevvaiAnalysis.girl?.houses)}
              </p>
              {chevvaiAnalysis.girl?.cancellations?.length > 0 && (
                <div className="mt-1.5 p-2 bg-white/80 rounded border border-emerald-200 text-[11px] text-emerald-900">
                  <span className="font-bold block mb-0.5">
                    {MATCH_I18N.nivrittiRuleHeading[lang] || MATCH_I18N.nivrittiRuleHeading.en}
                  </span>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    {chevvaiAnalysis.girl.cancellations.map((c, i) => (
                      <li key={i}>{getChevvaiCancellationText(c)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Boy's / Groom's Chevvai Status (Male - Right Side Default) */}
            <div
              className={`p-3 rounded-xl border ${
                chevvaiAnalysis.boy?.hasDosha
                  ? 'bg-rose-50/60 border-rose-200'
                  : chevvaiAnalysis.boy?.isCancelled
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{MATCH_I18N.groomHoroscope[lang] || MATCH_I18N.groomHoroscope.en}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    chevvaiAnalysis.boy?.hasDosha
                      ? 'bg-rose-200 text-rose-900'
                      : chevvaiAnalysis.boy?.isCancelled
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {getChevvaiStatusText(chevvaiAnalysis.boy)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-1">
                {getChevvaiHousesString(chevvaiAnalysis.boy?.houses)}
              </p>
              {chevvaiAnalysis.boy?.cancellations?.length > 0 && (
                <div className="mt-1.5 p-2 bg-white/80 rounded border border-emerald-200 text-[11px] text-emerald-900">
                  <span className="font-bold block mb-0.5">
                    {MATCH_I18N.nivrittiRuleHeading[lang] || MATCH_I18N.nivrittiRuleHeading.en}
                  </span>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    {chevvaiAnalysis.boy.cancellations.map((c, i) => (
                      <li key={i}>{getChevvaiCancellationText(c)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {chevvaiAnalysis.compatibilitySummary && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              <strong>{MATCH_I18N.compatibilityVerdictHeading[lang] || MATCH_I18N.compatibilityVerdictHeading.en}</strong>{' '}
              {lang === 'kn'
                ? (chevvaiAnalysis.boy?.isCancelled && chevvaiAnalysis.girl?.isCancelled
                    ? 'ಇಬ್ಬರಿಗೂ ಕುಜ ದೋಷ ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ನಿವಾರಣೆಯಾಗಿರುವುದರಿಂದ ವಿವಾಹಕ್ಕೆ ಅತ್ಯಂತ ಶುಭವಾಗಿದೆ.'
                    : 'ಕುಜ ದೋಷ ಸಮಸ್ಥಿತಿಯಲ್ಲಿದ್ದು ವಿವಾಹ ಅನುಕೂಲಕರವಾಗಿದೆ.')
                : lang === 'ta'
                ? chevvaiAnalysis.compatibilitySummary
                : lang === 'hi'
                ? 'दोनों कुंडलियों में मंगल दोष परिहार होने से विवाह हेतु शुभ स्थिति है।'
                : chevvaiAnalysis.compatibilitySummary}
            </div>
          )}
        </div>
      )}

      {/* 6. Rahu-Ketu / Sarpa Dosha Section */}
      {matchReport.rahuKetuAnalysis && (
        <div className="bg-white border border-teal-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-teal-100 pb-2 gap-2">
            <div>
              <h4 className="font-bold text-teal-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-teal-700" />
                {MATCH_I18N.tabRahuKetu[lang] || MATCH_I18N.tabRahuKetu.en}
              </h4>
              <span className="text-[10px] text-slate-500">
                {lang === 'ta' ? '1/7, 2/8, 5/11 சர்ப்ப தோஷ அச்சு மற்றும் சமநிலை ஆய்வு' : '1/7, 2/8, 5/11 Nodal Axis & Sarpa Samyam Evaluation'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowRahuKetuChart(!showRahuKetuChart)}
              className="text-[11px] font-bold px-3 py-1 bg-gradient-to-r from-teal-700 to-cyan-800 hover:from-teal-800 hover:to-cyan-900 text-white rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all self-end sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {showRahuKetuChart
                  ? (lang === 'ta' ? '▲ கட்டத்தை மறைக்கவும்' : '▲ Hide Chart')
                  : (lang === 'ta' ? '▼ சர்ப்ப தோஷக் கட்ட ஆய்வு' : '▼ View Rahu-Ketu Chart')}
              </span>
            </button>
          </div>

          {/* Expandable Rahu-Ketu Chart */}
          {showRahuKetuChart && (
            <div className="pt-2 border-t border-teal-100">
              <RahuKetuChart matchReport={matchReport} />
            </div>
          )}

          {/* Compact summary row if collapsed */}
          {!showRahuKetuChart && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex justify-between items-center">
                <span className="font-bold text-teal-950">
                  {lang === 'ta' ? 'மணமகன் சர்ப்ப நிலை:' : "Groom's Axis:"} {lang === 'ta' ? matchReport.rahuKetuAnalysis.boy?.axisNameTamil : matchReport.rahuKetuAnalysis.boy?.axisName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                  {lang === 'ta' ? matchReport.rahuKetuAnalysis.boy?.doshaLevelTamil : matchReport.rahuKetuAnalysis.boy?.doshaLevel}
                </span>
              </div>
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex justify-between items-center">
                <span className="font-bold text-purple-950">
                  {lang === 'ta' ? 'மணமகள் சர்ப்ப நிலை:' : "Bride's Axis:"} {lang === 'ta' ? matchReport.rahuKetuAnalysis.girl?.axisNameTamil : matchReport.rahuKetuAnalysis.girl?.axisName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  {lang === 'ta' ? matchReport.rahuKetuAnalysis.girl?.doshaLevelTamil : matchReport.rahuKetuAnalysis.girl?.doshaLevel}
                </span>
              </div>
            </div>
          )}

          {matchReport.rahuKetuAnalysis.doshaSamyam && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              <strong>{MATCH_I18N.compatibilityVerdictHeading[lang] || MATCH_I18N.compatibilityVerdictHeading.en}</strong>{' '}
              {lang === 'ta' ? matchReport.rahuKetuAnalysis.doshaSamyam.summary : matchReport.rahuKetuAnalysis.doshaSamyam.summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
