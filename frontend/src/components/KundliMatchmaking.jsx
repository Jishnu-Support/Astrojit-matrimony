import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  Send,
  Clock,
  Award,
  Star,
  Lock,
  Unlock,
  FileText,
  Check,
  ChevronDown,
  MessageCircle,
  HelpCircle,
  Flame,
  Zap,
  GitCompare,
  Moon,
  MapPin,
} from 'lucide-react';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import TamilPoruthamCard from './TamilPoruthamCard';
import GujaDashaChart from './GujaDashaChart';
import RahuKetuChart from './RahuKetuChart';
import ShashtashtagamMatchCard from './ShashtashtagamMatchCard';
import ChandranMatchCard from './ChandranMatchCard';
import GuruMatchCard from './GuruMatchCard';
import DasaSandhiMatchCard from './DasaSandhiMatchCard';
import MatchingNakshatrasCard from './MatchingNakshatrasCard';
import { MATCH_I18N, ASHTAKOOTA_I18N, getMatchText } from '../matchmakingI18n';
import { GEO_DATA, lookupCoordinates } from '../data/geoCoordinates';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function convertTo24Hour(hour, minute, second, period) {
  let h = parseInt(hour, 10) || 0;
  const m = String(minute || '00').padStart(2, '0');
  const s = String(second || '00').padStart(2, '0');
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}:${s}`;
}

/**
 * Astrojit Vedic Kundli Matchmaking (10 Poruthams & Ashtakoota 36 Gunas)
 * Supports full single-language selection without language mixing.
 */
export default function KundliMatchmaking() {
  const { user } = useAuth();
  const { lang, t } = useLang();

  // Helper for Ashtakoota localization in pure active language
  const getAshtakootaLocalized = (kootaName) => {
    const n = (kootaName || '').toLowerCase();
    let key = 'varna';
    if (n.includes('vashya')) key = 'vashya';
    else if (n.includes('tara')) key = 'tara';
    else if (n.includes('yoni')) key = 'yoni';
    else if (n.includes('graha') || n.includes('maitri')) key = 'grahaMaitri';
    else if (n.includes('gana')) key = 'gana';
    else if (n.includes('bhakoot') || n.includes('rashi')) key = 'bhakoot';
    else if (n.includes('nadi')) key = 'nadi';

    const def = ASHTAKOOTA_I18N[key] || {};
    return {
      name: def.name?.[lang] || kootaName,
      desc: def.desc?.[lang] || '',
    };
  };

  // Helper for Manglik localization
  const getManglikLocalized = (personHoro) => {
    if (!personHoro) return '';
    const hasDosha = personHoro.hasDosha || personHoro.isManglik;
    if (hasDosha) {
      if (lang === 'kn') return 'ಮಂಗಳ ದೋಷವಿದೆ';
      if (lang === 'ta') return 'செவ்வாய் தோஷம் உள்ளது';
      if (lang === 'hi') return 'मांगलिक दोष उपस्थित है';
      if (lang === 'te') return 'కుజ దోషం ఉన్నది';
      if (lang === 'bn') return 'মাঙ্গলিক দোষ বিদ্যমান';
      return 'Manglik Dosha Present';
    }
    if (lang === 'kn') return 'ದೋಷವಿಲ್ಲ - ಮಂಗಳ ಗ್ರಹ ಅನುಕೂಲಕರವಾಗಿದೆ';
    if (lang === 'ta') return 'தோஷமில்லை - செவ்வாய் சுப ஸ்தானத்தில் உள்ளார்';
    if (lang === 'hi') return 'दोष रहित - मंगल शुभ स्थान में है';
    if (lang === 'te') return 'దోషం లేదు - కుజుడు అనుకూల స్థానంలో ఉన్నాడు';
    if (lang === 'bn') return 'দোষমুক্ত - মঙ্গল শুভ স্থানে আছে';
    return 'Non-Manglik - Mars favorably placed';
  };

  // Helper for compatibility verdict
  const getCompatibilityLocalized = (verdictStr, score) => {
    if (score >= 25 || (verdictStr && verdictStr.toLowerCase().includes('high'))) {
      if (lang === 'kn') return 'ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ';
      if (lang === 'ta') return 'உத்தம பொருத்தம்';
      if (lang === 'hi') return 'अत्युत्तम मिलान';
      if (lang === 'te') return 'అత్యుత్తమ పొంతన';
      if (lang === 'bn') return 'অত্যುತ್ತম মিলন';
      return 'Highly Recommended';
    }
    if (score >= 18 || (verdictStr && verdictStr.toLowerCase().includes('recom'))) {
      if (lang === 'kn') return 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ';
      if (lang === 'ta') return 'பொருத்தமானது';
      if (lang === 'hi') return 'शुभ मिलान';
      if (lang === 'te') return 'మంచి పొంతన';
      if (lang === 'bn') return 'অনুকূল মিলন';
      return 'Recommended';
    }
    if (lang === 'kn') return 'ಹೊಂದಾಣಿಕೆಯಿಲ್ಲ';
    if (lang === 'ta') return 'பொருத்தமில்லை';
    if (lang === 'hi') return 'अनुपयुक्त';
    if (lang === 'te') return 'పొంతన సరిపోదు';
    if (lang === 'bn') return 'অমিল';
    return 'Not Recommended';
  };

  const getLocalizedReviewSuggestions = (suggestions, reqId) => {
    if (!suggestions) {
      if (lang === 'ta') return 'தம்பதியினருக்கு மங்கலகரமான ஆசிகள். நல்ல சுபிட்சமும் யோகமும் கூடி வரும்.';
      if (lang === 'kn') return 'ದಂಪತಿಗಳಿಗೆ ಶುಭ ಆಶೀರ್ವಾದಗಳು.';
      if (lang === 'hi') return 'दंपति को मंगलमय आशीर्वाद। वैवाहिक जीवन सुखमय रहेगा।';
      return 'The couple demonstrates harmonious spiritual and emotional alignment.';
    }
    if (suggestions.includes('auspicious mental and spiritual alignment')) {
      if (lang === 'ta') return 'மணமகன் மற்றும் மணமகளின் ஜாதகங்கள் சிறப்பான மன அமைதி மற்றும் ஆன்மீக பொருத்தத்தைக் காட்டுகின்றன. சாதகமான கிரகப் பார்வைகள் இல்லற அமைதி மற்றும் சுபிட்சத்திற்கு உதவுகின்றன.';
      if (lang === 'kn') return 'ವರ ಮತ್ತು ವಧುವಿನ ಜಾತಕಗಳು ಮಾನಸಿಕ ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ಹೊಂದಾಣಿಕೆಯನ್ನು ತೋರಿಸುತ್ತವೆ. ಗ್ರಹಗಳ ಶುಭ ದೃಷ್ಟಿಯು ದಾಂಪತ್ಯ ಸುಖ ಮತ್ತು ಸಮೃದ್ಧಿಗೆ ಸಹಕಾರಿಯಾಗಿದೆ.';
      if (lang === 'hi') return 'वर और वधू की कुंडलियां मानसिक और आध्यात्मिक सामंजस्य दर्शाती हैं। शुभ ग्रह दृष्टियां पारिवारिक सुख और समृद्धि में सहायक हैं।';
    }
    if (reqId === 'match-req-2026-001' || suggestions.includes('28/36') || suggestions.includes('splendid')) {
      if (lang === 'ta') {
        return 'இரு ஜாதகங்களும் 28/36 குணங்களுடன் சிறந்த கிரக மைத்திரி மற்றும் பரஸ்பர மரியாதையைக் காட்டுகின்றன. தற்போதைய கிரகப் பெயர்ச்சிகள் குடும்ப சுபிட்சம் மற்றும் நீடித்த மகிழ்ச்சிகரமான இல்லற பந்தத்தை உறுதி செய்கின்றன.';
      }
      if (lang === 'kn') {
        return 'ಜಾತಕಗಳು 28/36 ಗುಣಗಳೊಂದಿಗೆ ಅತ್ಯುತ್ತಮ ಗ್ರಹ ಮೈತ್ರಿ ಹಾಗೂ ಪರಸ್ಪರ ಗೌರವವನ್ನು ತೋರಿಸುತ್ತವೆ. ಪ್ರಸ್ತುತ ಗ್ರಹಗಳ ಸಂಚಾರವು ಕುಟುಂಬದ ಸಮೃದ್ಧಿ ಹಾಗೂ ದಾಂಪತ್ಯ ಸುಖವನ್ನು ಸೂಚಿಸುತ್ತದೆ.';
      }
      if (lang === 'hi') {
        return 'दोनों कुंडलियों में 28/36 उत्तम गुण मिलान तथा मजबूत ग्रह मैत्री है। वर्तमान ग्रह गोचर सुखद वैवाहिक जीवन और पारिवारिक समृद्धि का संकेत देते हैं।';
      }
    }
    return suggestions;
  };

  const getLocalizedReviewRemedies = (remedies, reqId) => {
    if (!remedies) return '';
    if (remedies.includes('joint archana to Lord Shiva') || remedies.includes('Gayatri Mantra')) {
      if (lang === 'ta') return 'சுப நட்சத்திர நாளில் சிவபெருமான் மற்றும் பார்வதி தேவிக்கு தம்பதியராய் அர்ச்சனை செய்யவும். தினமும் காயத்ரி மந்திரத்தை பாராயணம் செய்யவும்.';
      if (lang === 'kn') return 'ಶುಭ ನಕ್ಷತ್ರ ದಿನದಂದು ಶಿವ-ಪಾರ್ವತಿಯರಿಗೆ ಜಂಟಿ ಅರ್ಚನೆ ನೆರವೇರಿಸಿ. ಪ್ರತಿದಿನ ಗಾಯತ್ರಿ ಮಂತ್ರ ಪಠಿಸಿ.';
      if (lang === 'hi') return 'शुभ नक्षत्र के दिन भगवान शिव और माता पार्वती की संयुक्त अर्चना करें। प्रतिदिन गायत्री मंत्र का जाप करें।';
    }
    if (reqId === 'match-req-2026-001' || remedies.includes('Rohini') || remedies.includes('Sankalpa')) {
      if (lang === 'ta') {
        return 'ரோகிணி நட்சத்திரத்தன்று சிவபெருமான் மற்றும் பார்வதி தேவிக்கு தம்பதியராய் சங்கல்பம் செய்து அர்ச்சனை செய்யவும். சுக்ல பட்ச ஏகாதசியில் விரதம் இருப்பது நன்று.';
      }
      if (lang === 'kn') {
        return 'ರೋಹಿಣಿ ನಕ್ಷತ್ರದಂದು ಶಿವ-ಪಾರ್ವತಿಯರಿಗೆ ಜಂಟಿ ಸಂಕಲ್ಪ ಮತ್ತು ಅರ್ಚನೆ ನೆರವೇರಿಸಿ. ಶುಕ್ಲ ಏಕಾದಶಿಯಂದು ಉಪವಾಸ ಶ್ರೇಯಸ್ಕರ.';
      }
      if (lang === 'hi') {
        return 'रोहिणी नक्षत्र के दिन भगवान शिव और माता पार्वती की संयुक्त संकल्प सहित अर्चना करें। शुक्ल एकादशी का व्रत रखना कल्याणकारी रहेगा।';
      }
    }
    return remedies;
  };

  // Bride (Female - Left Side) & Groom (Male - Right Side) Form State
  const isUserFemale = user?.gender === 'female';
  const [girl, setGirl] = useState({
    name: isUserFemale ? (user?.name || '') : '',
    gender: 'female',
    dob: isUserFemale ? (user?.dob || '') : '',
    dobTime: isUserFemale ? (user?.dobTime || '10:30') : '10:30',
    dobPlace: isUserFemale ? (user?.dobPlace || '') : '',
    lat: 11.6643,
    lon: 78.1460,
  });

  const [boy, setBoy] = useState({
    name: !isUserFemale ? (user?.name || '') : '',
    gender: 'male',
    dob: !isUserFemale ? (user?.dob || '') : '',
    dobTime: !isUserFemale ? (user?.dobTime || '09:15') : '09:15',
    dobPlace: !isUserFemale ? (user?.dobPlace || '') : '',
    lat: 13.0827,
    lon: 80.2707,
  });

  // 12-Hour Time States for Matchmaking (same as in Horoscope)
  const [girlTimeState, setGirlTimeState] = useState({ hour: '10', minute: '30', second: '00', period: 'AM' });
  const [boyTimeState, setBoyTimeState] = useState({ hour: '09', minute: '15', second: '00', period: 'AM' });

  // Place Autocomplete States for Matchmaking (same as in Horoscope)
  const [girlCityInput, setGirlCityInput] = useState(isUserFemale ? (user?.dobPlace || '') : '');
  const [showGirlCityDropdown, setShowGirlCityDropdown] = useState(false);
  const girlCityBoxRef = useRef(null);

  const [boyCityInput, setBoyCityInput] = useState(!isUserFemale ? (user?.dobPlace || '') : '');
  const [showBoyCityDropdown, setShowBoyCityDropdown] = useState(false);
  const boyCityBoxRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (girlCityBoxRef.current && !girlCityBoxRef.current.contains(e.target)) {
        setShowGirlCityDropdown(false);
      }
      if (boyCityBoxRef.current && !boyCityBoxRef.current.contains(e.target)) {
        setShowBoyCityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const girlCitySuggestions = React.useMemo(() => {
    const q = (girlCityInput || '').trim().toLowerCase();
    const tnCities = GEO_DATA['India']?.['Tamil Nadu'] || [];
    if (!q) return tnCities.slice(0, 15);
    const starts = tnCities.filter(c => (c.name || '').toLowerCase().startsWith(q));
    const contains = tnCities.filter(c => !(c.name || '').toLowerCase().startsWith(q) && (c.name || '').toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, 30);
  }, [girlCityInput]);

  const boyCitySuggestions = React.useMemo(() => {
    const q = (boyCityInput || '').trim().toLowerCase();
    const tnCities = GEO_DATA['India']?.['Tamil Nadu'] || [];
    if (!q) return tnCities.slice(0, 15);
    const starts = tnCities.filter(c => (c.name || '').toLowerCase().startsWith(q));
    const contains = tnCities.filter(c => !(c.name || '').toLowerCase().startsWith(q) && (c.name || '').toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, 30);
  }, [boyCityInput]);

  const updateGirlTimePart = (field, val) => {
    const next = { ...girlTimeState, [field]: val };
    setGirlTimeState(next);
    const t24 = convertTo24Hour(next.hour, next.minute, next.second, next.period);
    setGirl(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  const toggleGirlPeriod = () => {
    const nextPeriod = girlTimeState.period === 'AM' ? 'PM' : 'AM';
    const next = { ...girlTimeState, period: nextPeriod };
    setGirlTimeState(next);
    const t24 = convertTo24Hour(next.hour, next.minute, next.second, next.period);
    setGirl(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  const updateBoyTimePart = (field, val) => {
    const next = { ...boyTimeState, [field]: val };
    setBoyTimeState(next);
    const t24 = convertTo24Hour(next.hour, next.minute, next.second, next.period);
    setBoy(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  const toggleBoyPeriod = () => {
    const nextPeriod = boyTimeState.period === 'AM' ? 'PM' : 'AM';
    const next = { ...boyTimeState, period: nextPeriod };
    setBoyTimeState(next);
    const t24 = convertTo24Hour(next.hour, next.minute, next.second, next.period);
    setBoy(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  // Astrologer Selection & Client Query
  const [availableAstrologers, setAvailableAstrologers] = useState([]);
  const [selectedAstroId, setSelectedAstroId] = useState('');
  const [clientQuery, setClientQuery] = useState('');

  // Subscription & Requests State
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Self-check results (for subscribed users)
  const [selfResult, setSelfResult] = useState(null);
  const [calculatingSelf, setCalculatingSelf] = useState(false);
  const [standaloneStars, setStandaloneStars] = useState(null);
  const [findingStars, setFindingStars] = useState(false);
  const [sendAfterSelfReview, setSendAfterSelfReview] = useState(false);
  const [selfResultTab, setSelfResultTab] = useState('tamil'); // 'tamil' | 'ashtakoota'
  const [reqTabs, setReqTabs] = useState({}); // reqId -> 'tamil' | 'ashtakoota'

  // Feedback banner
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingRequests(true);
      // 1. Fetch available astrologers
      const astros = await API.getAvailableAstrologers();
      setAvailableAstrologers(astros || []);

      // 2. Fetch my requests & subscription status
      const myReqData = await API.getMyMatchmakingRequests();
      setIsSubscribed(Boolean(myReqData?.isSubscribed));
      setRequests(myReqData?.requests || []);

      // Default selected astrologer (prefer client's referral code if any)
      if (astros && astros.length > 0) {
        const refAstro = astros.find(
          (a) => a.referralCode === user?.astrologerReferralCode || a.id === user?.astrologerReferralCode
        );
        setSelectedAstroId(refAstro ? refAstro.id : astros[0].id);
      }
    } catch (err) {
      console.error('Error loading matchmaking data:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleFindMatchingStars = async (role = 'female') => {
    setFindingStars(true);
    setActionMessage(null);
    try {
      const targetPerson = role === 'female' ? girl : boy;
      const res = await API.findMatchingNakshatras(targetPerson, role);
      setStandaloneStars(res);
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to scan matching Nakshatras: ' + err.message });
    } finally {
      setFindingStars(false);
    }
  };

  // Toggle Subscription
  const handleToggleSubscription = async () => {
    setSubscribing(true);
    setActionMessage(null);
    try {
      const res = await API.toggleMatchmakingSubscription({ subscribed: !isSubscribed });
      setIsSubscribed(res.isSubscribed);
      setActionMessage({
        type: 'success',
        text: res.isSubscribed
          ? '🎉 Instant Self-Check Subscription activated! You can now calculate 36 Gunas instantly below.'
          : 'Subscription paused. Matchmaking requests will now be reviewed by your chosen astrologer.',
      });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to update subscription: ' + err.message });
    } finally {
      setSubscribing(false);
    }
  };

  // Subscribed User: Calculate Match by Themselves
  const handleSelfCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!isSubscribed) return;

    setCalculatingSelf(true);
    setActionMessage(null);
    try {
      const res = await API.calculateMatchSelf(boy, girl);
      setSelfResult(res);
      setActionMessage({
        type: 'success',
        text: `Self-check complete! Compatibility score: ${res.totalScore}/36 (${res.compatibility}). You can now request an astrologer for expert review and remedial advice below.`,
      });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Error calculating match: ' + err.message });
    } finally {
      setCalculatingSelf(false);
    }
  };

  // Request Astrologer to Review / Calculate Match
  const handleRequestAstrologer = async (e) => {
    if (e) e.preventDefault();
    if (!selectedAstroId) {
      alert('Please select an Astrologer to review the match.');
      return;
    }

    setSubmittingRequest(true);
    setActionMessage(null);
    try {
      const payload = {
        boy,
        girl,
        astrologerId: selectedAstroId,
        clientQuery: clientQuery.trim() || 'Please examine the 36 Gunas compatibility and Manglik Dosha alignment.',
        source: selfResult ? 'self_check_review' : 'client_request',
        precalculatedReport: selfResult || null,
      };

      const res = await API.requestMatchmaking(payload);
      setActionMessage({
        type: 'success',
        text: res.message || 'Matchmaking request successfully sent to the astrologer!',
      });
      setSendAfterSelfReview(false);
      setClientQuery('');
      // Refresh requests list
      const myReqData = await API.getMyMatchmakingRequests();
      setRequests(myReqData?.requests || []);
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to send request: ' + err.message });
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-7 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/45 dark:via-indigo-950/50 dark:to-slate-900/80 border border-rose-200/80 dark:border-rose-800/50 p-4 sm:p-6 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-rose-950 dark:text-rose-200 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600/20" />
              {MATCH_I18N.pageTitle[lang] || MATCH_I18N.pageTitle.en}
            </h2>
            <p className="text-xs text-slate-600 dark:text-stone-400 mt-0.5">
              {MATCH_I18N.pageSubtitle[lang] || MATCH_I18N.pageSubtitle.en}
            </p>
          </div>

          {/* Subscription Status Badge */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
            {isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                {MATCH_I18N.subscribedModeBadge[lang] || MATCH_I18N.subscribedModeBadge.en}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 border border-slate-200 dark:border-stone-700">
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400" />
                {MATCH_I18N.standardModeBadge[lang] || MATCH_I18N.standardModeBadge.en}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Notification / Feedback Banner */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Subscription Banner & Toggle */}
      <div className="bg-white dark:bg-[#1E1815] border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${isSubscribed ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-stone-800/80 text-slate-600 dark:text-stone-400'}`}>
            {isSubscribed ? <Unlock className="w-5 h-5 text-amber-600" /> : <Lock className="w-5 h-5 text-slate-500 dark:text-stone-400" />}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
              {isSubscribed
                ? (MATCH_I18N.subscribedModeBadge[lang] || MATCH_I18N.subscribedModeBadge.en)
                : (MATCH_I18N.subscribeTitle[lang] || MATCH_I18N.subscribeTitle.en)}
              {isSubscribed && (
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.2 rounded-full border border-emerald-300 dark:border-emerald-700/60">
                  Active
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5 max-w-xl">
              {isSubscribed
                ? (lang === 'kn'
                    ? 'ನೀವು ತಕ್ಷಣವೇ ಪೂರ್ಣ ಹೊಂದಾಣಿಕೆ ಫಲಿತಾಂಶಗಳನ್ನು ವೀಕ್ಷಿಸಬಹುದು ಮತ್ತು ಜ್ಯೋತಿಷಿಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಕಳುಹಿಸಬಹುದು.'
                    : lang === 'ta'
                    ? 'முழுப் பொருத்த முடிவுகளையும் சுயமாகக் கணக்கிட்டு, தேவையானால் ஜோதிடருக்கும் அனுப்பலாம்.'
                    : 'Calculate marriage compatibility instantly and optionally send to an astrologer for expert guidance.')
                : (MATCH_I18N.subscribeDesc[lang] || MATCH_I18N.subscribeDesc.en)}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleSubscription}
          disabled={subscribing}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
            isSubscribed
              ? 'bg-slate-100 dark:bg-stone-800/80 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 border border-slate-300 dark:border-stone-600'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
          }`}
        >
          {subscribing ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : isSubscribed ? (
            MATCH_I18N.unsubscribeBtn[lang] || MATCH_I18N.unsubscribeBtn.en
          ) : (
            <>
              <Star className="w-3.5 h-3.5 fill-current" />
              {MATCH_I18N.subscribeBtn[lang] || MATCH_I18N.subscribeBtn.en}
            </>
          )}
        </button>
      </div>

      {/* 4. Birth Coordinate Input Forms (Bride/Female Left & Groom/Male Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bride Form (Female - Left Side Default) */}
        <div className="bg-white dark:bg-[#1E1815] border border-rose-200/80 dark:border-rose-800/50 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-rose-900 dark:text-rose-300 text-sm flex items-center gap-1.5 pb-2 border-b border-rose-50">
            <User className="w-4 h-4 text-rose-600" /> {MATCH_I18N.brideHeading[lang] || MATCH_I18N.brideHeading.en}
          </h3>

          <div>
            <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
              {MATCH_I18N.fullName[lang] || 'Full Name'} *
            </label>
            <input
              type="text"
              required
              placeholder={MATCH_I18N.fullName[lang] || "Enter Bride's Full Name"}
              value={girl.name}
              onChange={(e) => setGirl({ ...girl, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
                {MATCH_I18N.dob[lang] || 'Date of Birth'} *
              </label>
              <input
                type="date"
                required
                value={girl.dob}
                onChange={(e) => setGirl({ ...girl, dob: e.target.value })}
                className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Birth Time (12-Hour AM/PM format, same as in Horoscope) */}
            <div>
              <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
                <Clock className="w-3 h-3 inline mr-1 text-rose-600" />
                {lang === 'ta' ? 'பிறந்த நேரம் (12-மணி AM/PM)' : 'Birth Time (12-Hour AM/PM)'} *
              </label>
              <div className="flex flex-wrap items-center gap-1">
                <select
                  value={girlTimeState.hour}
                  onChange={e => updateGirlTimePart('hour', e.target.value)}
                  className="bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none focus:border-rose-500"
                >
                  {HOURS_12.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="font-bold text-slate-400">:</span>
                <select
                  value={girlTimeState.minute}
                  onChange={e => updateGirlTimePart('minute', e.target.value)}
                  className="bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none focus:border-rose-500"
                >
                  {MINUTES_60.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="font-bold text-slate-400">:</span>
                <select
                  value={girlTimeState.second}
                  onChange={e => updateGirlTimePart('second', e.target.value)}
                  className="bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none focus:border-rose-500"
                >
                  {SECONDS_60.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={toggleGirlPeriod}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                    girlTimeState.period === 'PM'
                      ? 'bg-rose-700 text-white border border-rose-700'
                      : 'bg-amber-600 text-white border border-amber-600'
                  }`}
                >
                  {girlTimeState.period}
                </button>
              </div>
            </div>
          </div>

          {/* Birth City / Place - Search by letter autocomplete (same as in Horoscope) */}
          <div ref={girlCityBoxRef} className="relative">
            <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
              <MapPin className="w-3 h-3 inline mr-1 text-rose-600" />
              {MATCH_I18N.pob[lang] || 'Birth Place / City'} *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={lang === 'ta' ? 'ஊர் பெயர் தட்டச்சு செய்க...' : 'Type city name...'}
                value={girlCityInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setGirlCityInput(val);
                  setGirl(prev => ({ ...prev, dobPlace: val }));
                  setShowGirlCityDropdown(true);

                  const exact = (GEO_DATA['India']?.['Tamil Nadu'] || []).find(c => c.name.toLowerCase() === val.trim().toLowerCase());
                  if (exact) {
                    setGirl(prev => ({
                      ...prev,
                      dobPlace: exact.name,
                      lat: exact.latDec !== undefined ? exact.latDec : exact.lat,
                      lon: exact.lonDec !== undefined ? exact.lonDec : exact.lon
                    }));
                  }
                }}
                onFocus={() => setShowGirlCityDropdown(true)}
                className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 pr-7 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
                autoComplete="off"
              />
              {girlCityInput && (
                <button
                  type="button"
                  onClick={() => {
                    setGirlCityInput('');
                    setGirl(prev => ({ ...prev, dobPlace: '' }));
                    setShowGirlCityDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-stone-200 text-xs font-bold cursor-pointer"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            {showGirlCityDropdown && girlCitySuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1E1815] border border-rose-200 dark:border-rose-800/50 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-stone-800">
                {girlCitySuggestions.map((item, idx) => (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    onClick={() => {
                      setGirlCityInput(item.name);
                      setGirl(prev => ({
                        ...prev,
                        dobPlace: item.name,
                        lat: item.latDec !== undefined ? item.latDec : item.lat,
                        lon: item.lonDec !== undefined ? item.lonDec : item.lon
                      }));
                      setShowGirlCityDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-rose-50 cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 dark:text-stone-100">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({typeof item.latDec === 'number' ? item.latDec.toFixed(2) : item.lat}°, {typeof item.lonDec === 'number' ? item.lonDec.toFixed(2) : item.lon}°)
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Groom Form (Male - Right Side Default) */}
        <div className="bg-white dark:bg-[#1E1815] border border-indigo-200/80 dark:border-indigo-800/50 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm flex items-center gap-1.5 pb-2 border-b border-indigo-50">
            <User className="w-4 h-4 text-indigo-600" /> {MATCH_I18N.groomHeading[lang] || MATCH_I18N.groomHeading.en}
          </h3>

          <div>
            <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
              {MATCH_I18N.fullName[lang] || 'Full Name'} *
            </label>
            <input
              type="text"
              required
              placeholder={MATCH_I18N.fullName[lang] || "Enter Groom's Full Name"}
              value={boy.name}
              onChange={(e) => setBoy({ ...boy, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
                {MATCH_I18N.dob[lang] || 'Date of Birth'} *
              </label>
              <input
                type="date"
                required
                value={boy.dob}
                onChange={(e) => setBoy({ ...boy, dob: e.target.value })}
                className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Birth Time (12-Hour AM/PM format, same as in Horoscope) */}
            <div>
              <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
                <Clock className="w-3 h-3 inline mr-1 text-indigo-600" />
                {lang === 'ta' ? 'பிறந்த நேரம் (12-மணி AM/PM)' : 'Birth Time (12-Hour AM/PM)'} *
              </label>
              <div className="flex flex-wrap items-center gap-1">
                <select
                  value={boyTimeState.hour}
                  onChange={e => updateBoyTimePart('hour', e.target.value)}
                  className="bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  {HOURS_12.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="font-bold text-slate-400">:</span>
                <select
                  value={boyTimeState.minute}
                  onChange={e => updateBoyTimePart('minute', e.target.value)}
                  className="bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  {MINUTES_60.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="font-bold text-slate-400">:</span>
                <select
                  value={boyTimeState.second}
                  onChange={e => updateBoyTimePart('second', e.target.value)}
                  className="bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  {SECONDS_60.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={toggleBoyPeriod}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                    boyTimeState.period === 'PM'
                      ? 'bg-indigo-700 text-white border border-indigo-700'
                      : 'bg-amber-600 text-white border border-amber-600'
                  }`}
                >
                  {boyTimeState.period}
                </button>
              </div>
            </div>
          </div>

          {/* Birth City / Place - Search by letter autocomplete (same as in Horoscope) */}
          <div ref={boyCityBoxRef} className="relative">
            <label className="text-slate-600 dark:text-stone-400 font-semibold block mb-1">
              <MapPin className="w-3 h-3 inline mr-1 text-indigo-600" />
              {MATCH_I18N.pob[lang] || 'Birth Place / City'} *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={lang === 'ta' ? 'ஊர் பெயர் தட்டச்சு செய்க...' : 'Type city name...'}
                value={boyCityInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setBoyCityInput(val);
                  setBoy(prev => ({ ...prev, dobPlace: val }));
                  setShowBoyCityDropdown(true);

                  const exact = (GEO_DATA['India']?.['Tamil Nadu'] || []).find(c => c.name.toLowerCase() === val.trim().toLowerCase());
                  if (exact) {
                    setBoy(prev => ({
                      ...prev,
                      dobPlace: exact.name,
                      lat: exact.latDec !== undefined ? exact.latDec : exact.lat,
                      lon: exact.lonDec !== undefined ? exact.lonDec : exact.lon
                    }));
                  }
                }}
                onFocus={() => setShowBoyCityDropdown(true)}
                className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 pr-7 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-indigo-500"
                autoComplete="off"
              />
              {boyCityInput && (
                <button
                  type="button"
                  onClick={() => {
                    setBoyCityInput('');
                    setBoy(prev => ({ ...prev, dobPlace: '' }));
                    setShowBoyCityDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-stone-200 text-xs font-bold cursor-pointer"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            {showBoyCityDropdown && boyCitySuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1E1815] border border-indigo-200 dark:border-indigo-800/50 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-stone-800">
                {boyCitySuggestions.map((item, idx) => (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    onClick={() => {
                      setBoyCityInput(item.name);
                      setBoy(prev => ({
                        ...prev,
                        dobPlace: item.name,
                        lat: item.latDec !== undefined ? item.latDec : item.lat,
                        lon: item.lonDec !== undefined ? item.lonDec : item.lon
                      }));
                      setShowBoyCityDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-50 cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 dark:text-stone-100">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({typeof item.latDec === 'number' ? item.latDec.toFixed(2) : item.lat}°, {typeof item.lonDec === 'number' ? item.lonDec.toFixed(2) : item.lon}°)
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Action Panel (Subscribed Instant Check OR Request Astrologer) */}
      <div className="bg-white dark:bg-[#1E1815] border border-slate-200 dark:border-stone-700 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        {isSubscribed ? (
          /* SUBSRIBED MODE: Can calculate by themselves */
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/35 py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'kn'
                  ? 'ಚಂದಾದಾರರಾಗಿ ನೀವು ತಕ್ಷಣದ ಸ್ವಯಂ ಪರಿಶೀಲನಾ ಸೌಲಭ್ಯವನ್ನು ಹೊಂದಿದ್ದೀರಿ:'
                  : lang === 'ta'
                  ? 'சந்தாதாரராகிய நீங்கள் உடனடியாக சுயமாக பொருத்தம் பார்க்கலாம்:'
                  : 'Instant self-matching unlocked as a subscriber. Click below to generate report:'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={handleSelfCalculate}
                disabled={calculatingSelf}
                className="bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md shadow-rose-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                {calculatingSelf ? <Sparkles className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-current" />}
                <span>{MATCH_I18N.calculateSelfBtn[lang] || MATCH_I18N.calculateSelfBtn.en}</span>
              </button>
              <button
                type="button"
                onClick={() => handleFindMatchingStars('female')}
                disabled={findingStars}
                className="bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-[#7A1A22] dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Star className={`w-4 h-4 text-amber-600 ${findingStars ? 'animate-spin' : ''}`} />
                <span>{lang === 'ta' ? 'மணமகளுக்குப் பொருந்தும் நட்சத்திரங்கள்' : 'Matching Stars (For Bride)'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleFindMatchingStars('male')}
                disabled={findingStars}
                className="bg-indigo-50 dark:bg-indigo-950/35 hover:bg-indigo-100 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Star className={`w-4 h-4 text-indigo-600 ${findingStars ? 'animate-spin' : ''}`} />
                <span>{lang === 'ta' ? 'மணமகனுக்குப் பொருந்தும் நட்சத்திரங்கள்' : 'Matching Stars (For Groom)'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* UNSUBSCRIBED MODE: Must request an astrologer */
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-stone-800">
              <Send className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 dark:text-stone-100 text-sm">
                {MATCH_I18N.requestAstroHeading[lang] || MATCH_I18N.requestAstroHeading.en}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400">
              {MATCH_I18N.requestAstroDesc[lang] || MATCH_I18N.requestAstroDesc.en}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1.5">
                  {MATCH_I18N.selectAstroLabel[lang] || MATCH_I18N.selectAstroLabel.en}
                </label>
                <select
                  value={selectedAstroId}
                  onChange={(e) => setSelectedAstroId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {availableAstrologers.map((astro) => {
                    const isMyReferral =
                      astro.referralCode === user?.astrologerReferralCode ||
                      astro.id === user?.astrologerReferralCode;
                    return (
                      <option key={astro.id} value={astro.id}>
                        {astro.name} ({astro.specializations?.[0] || 'Vedic Astrology'}) {isMyReferral ? '★ [Your Assigned Astrologer]' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1.5">
                  {MATCH_I18N.clientQueryLabel[lang] || MATCH_I18N.clientQueryLabel.en}
                </label>
                <input
                  type="text"
                  value={clientQuery}
                  onChange={(e) => setClientQuery(e.target.value)}
                  placeholder={MATCH_I18N.clientQueryPlaceholder[lang] || MATCH_I18N.clientQueryPlaceholder.en}
                  className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 text-center sm:text-left">
              <button
                onClick={handleRequestAstrologer}
                disabled={submittingRequest}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-7 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {submittingRequest ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{MATCH_I18N.sendRequestBtn[lang] || MATCH_I18N.sendRequestBtn.en}</span>
              </button>
              <button
                type="button"
                onClick={() => handleFindMatchingStars((user?.gender || '').toLowerCase() === 'male' ? 'male' : 'female')}
                disabled={findingStars}
                className="mt-2 sm:mt-0 sm:ml-2.5 w-full sm:w-auto bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-[#7A1A22] dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Star className={`w-4 h-4 text-amber-600 ${findingStars ? 'animate-spin' : ''}`} />
                <span>{lang === 'ta' ? 'பொருந்தும் நட்சத்திரங்கள் (27 நட்சத்திரம்)' : 'Find Matching Nakshatras (27 Stars)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Standalone 27-Nakshatra Scan Card */}
        {standaloneStars && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600" />
                <span>{MATCH_I18N.tabMatchingNakshatras[lang] || MATCH_I18N.tabMatchingNakshatras.en}</span>
              </span>
              <button
                type="button"
                onClick={() => setStandaloneStars(null)}
                className="text-xs font-bold text-slate-500 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 cursor-pointer"
              >
                ✕ {lang === 'ta' ? 'மூடு' : 'Close'}
              </button>
            </div>
            <MatchingNakshatrasCard standaloneData={standaloneStars} />
          </div>
        )}
      </div>

      {/* 6. SUBSCRIBED USER SELF-RESULT DISPLAY (With Option to Send to Astrologer for Review) */}
      {selfResult && isSubscribed && (
        <div className="bg-white dark:bg-[#1E1815] border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 sm:p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-amber-100 dark:border-amber-900/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                  {lang === 'kn' ? 'ಸ್ವಯಂ ಪರಿಶೀಲನಾ ಫಲಿತಾಂಶ' : lang === 'ta' ? 'சுய பரிசீலனை முடிவு' : 'Instant Self-Calculation Result'}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-stone-800/80 text-slate-600 dark:text-stone-400 px-2 py-0.5 rounded-full font-semibold">
                  {lang === 'kn' ? 'ದಶಕೂಟ + ಅಷ್ಟಕೂಟ' : lang === 'ta' ? 'தசப் பொருத்தம் + 36 குணங்கள்' : '10 Poruthams + Ashtakoota'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-stone-100 mt-1">
                {girl.name} & {boy.name} • {MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}
              </h3>
            </div>
            
            {/* Quick dual summary badges */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-xl text-right">
                <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {lang === 'kn' ? 'ದಶಕೂಟ' : lang === 'ta' ? 'தசப் பொருத்தம்' : '10 Poruthams'}
                </div>
                <div className="text-sm font-black text-amber-900 dark:text-amber-300">
                  {selfResult.tamilPorutham?.totalScore ?? '-'}/10
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/50 px-3 py-1.5 rounded-xl text-right">
                <div className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
                  {lang === 'kn' ? '36 ಗುಣಗಳು' : lang === 'ta' ? '36 குணங்கள்' : '36 Gunas'}
                </div>
                <div className="text-sm font-black text-indigo-900 dark:text-indigo-300">
                  {selfResult.totalScore ?? '-'}/36 <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">({getCompatibilityLocalized(selfResult.compatibility, selfResult.totalScore)})</span>
                </div>
              </div>
            </div>
          </div>

          {/* View Tab Switcher */}
          <div className="flex flex-wrap border-b border-slate-200 dark:border-stone-700 text-xs font-bold gap-2 pb-1">
            <button
              type="button"
              onClick={() => setSelfResultTab('tamil')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'tamil'
                  ? 'border-amber-600 text-amber-900 dark:text-amber-300'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('ashtakoota')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'ashtakoota'
                  ? 'border-indigo-600 text-indigo-900 dark:text-indigo-300'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Heart className="w-4 h-4 text-indigo-600" />
              <span>{MATCH_I18N.tabAshtakoota[lang] || MATCH_I18N.tabAshtakoota.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('guja_dasha')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'guja_dasha'
                  ? 'border-rose-600 text-rose-900 dark:text-rose-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-600" />
              <span>{MATCH_I18N.tabGujaDasha[lang] || MATCH_I18N.tabGujaDasha.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('rahu_ketu')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'rahu_ketu'
                  ? 'border-teal-600 text-teal-900 dark:text-teal-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Zap className="w-4 h-4 text-teal-600" />
              <span>{MATCH_I18N.tabRahuKetu[lang] || MATCH_I18N.tabRahuKetu.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('shashtashtagam')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'shashtashtagam'
                  ? 'border-[#7A1A22] text-[#7A1A22] dark:text-amber-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <GitCompare className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
              <span>{MATCH_I18N.tabShashtashtagam[lang] || MATCH_I18N.tabShashtashtagam.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('chandran')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'chandran'
                  ? 'border-indigo-700 text-indigo-900 dark:text-indigo-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>{MATCH_I18N.tabChandran[lang] || MATCH_I18N.tabChandran.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('guru')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'guru'
                  ? 'border-amber-600 text-amber-900 dark:text-amber-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{MATCH_I18N.tabGuru[lang] || MATCH_I18N.tabGuru.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('dasa_sandhi')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'dasa_sandhi'
                  ? 'border-[#7A1A22] text-[#7A1A22] dark:text-amber-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Clock className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
              <span>{MATCH_I18N.tabDasaSandhi[lang] || MATCH_I18N.tabDasaSandhi.en}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelfResultTab('matching_nakshatras')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                selfResultTab === 'matching_nakshatras'
                  ? 'border-emerald-700 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
              }`}
            >
              <Star className="w-4 h-4 text-emerald-600" />
              <span>{MATCH_I18N.tabMatchingNakshatras[lang] || MATCH_I18N.tabMatchingNakshatras.en}</span>
            </button>
          </div>

          {/* Tab 1: 10 Poruthams View */}
          {selfResultTab === 'tamil' && (
            <TamilPoruthamCard matchReport={selfResult} />
          )}

          {/* Tab 2: Guja Dasha & Chevvai Chart View */}
          {selfResultTab === 'guja_dasha' && (
            <GujaDashaChart matchReport={selfResult} />
          )}

          {/* Tab 3: Rahu-Ketu (Sarpa) Dosha & Chart View */}
          {selfResultTab === 'rahu_ketu' && (
            <RahuKetuChart matchReport={selfResult} />
          )}

          {/* Tab 4: Shashtashtagam (6/8 Rasi & Lagnam) View */}
          {selfResultTab === 'shashtashtagam' && (
            <ShashtashtagamMatchCard matchReport={selfResult} />
          )}

          {/* Tab 5: Chandran (Moon) Compatibility & Mental Harmony View */}
          {selfResultTab === 'chandran' && (
            <ChandranMatchCard matchReport={selfResult} />
          )}

          {/* Tab 6: Guru (Jupiter) Bala & Paarvai View */}
          {selfResultTab === 'guru' && (
            <GuruMatchCard matchReport={selfResult} />
          )}

          {/* Tab 7: Dasa Sandhi Porutham (Transition Overlap Scan) View */}
          {selfResultTab === 'dasa_sandhi' && (
            <DasaSandhiMatchCard matchReport={selfResult} />
          )}

          {/* Tab 8: Matching Nakshatras (27-Star Finder) View */}
          {selfResultTab === 'matching_nakshatras' && (
            <MatchingNakshatrasCard matchReport={selfResult} />
          )}

          {/* Tab 3: Ashtakoota 36 Gunas View */}
          {selfResultTab === 'ashtakoota' && (
            <div className="space-y-4">
              {/* Ashtakoota 8 Kootas Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 font-bold border-b border-slate-200 dark:border-stone-700">
                      <th className="py-2 px-3">{MATCH_I18N.colPorutham[lang] || 'Koota'}</th>
                      <th className="py-2 px-3">{MATCH_I18N.colSignificance[lang] || 'Significance'}</th>
                      <th className="py-2 px-3 text-center">{lang === 'kn' ? 'ಗರಿಷ್ಠ ಅಂಕ' : lang === 'ta' ? 'அதிகபட்சம்' : 'Max Points'}</th>
                      <th className="py-2 px-3 text-center">{lang === 'kn' ? 'ಪಡೆದ ಅಂಕ' : lang === 'ta' ? 'பெற்றவை' : 'Obtained'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-stone-800">
                    {selfResult.kootas?.map((k, i) => {
                      const localized = getAshtakootaLocalized(k.koota || k.name);
                      return (
                        <tr key={i} className="hover:bg-amber-50/30 dark:hover:bg-stone-800/70">
                          <td className="py-2 px-3 font-bold text-slate-900 dark:text-stone-100">{localized.name}</td>
                          <td className="py-2 px-3 text-slate-600 dark:text-stone-400">{localized.desc || k.description || k.desc}</td>
                          <td className="py-2 px-3 text-center font-semibold text-slate-500 dark:text-stone-400">{k.max}</td>
                          <td className="py-2 px-3 text-center font-bold text-amber-700 dark:text-amber-400">{k.obtained}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Manglik Dosha Summary (Bride Left & Groom Right) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800/50 text-xs">
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300 block mb-0.5">
                    {MATCH_I18N.brideHoroscope[lang] || 'Bride'}:
                  </span>
                  <span className="text-slate-700 dark:text-stone-300">{getManglikLocalized(selfResult.manglik?.girl)}</span>
                </div>
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300 block mb-0.5">
                    {MATCH_I18N.groomHoroscope[lang] || 'Groom'}:
                  </span>
                  <span className="text-slate-700 dark:text-stone-300">{getManglikLocalized(selfResult.manglik?.boy)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Prominent Action: Send to Astrologer for Professional Suggestions/Review */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/45 dark:to-slate-900/80 border border-amber-200 dark:border-amber-800/50 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-stone-100 text-xs sm:text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {lang === 'kn' ? 'ಪರಿಣಿತ ಜ್ಯೋತಿಷಿಗಳಿಂದ ವಿಶೇಷ ಪರಿಶೀಲನೆ ಮತ್ತು ಪರಿಹಾರ ಬೇಕೇ?' : lang === 'ta' ? 'ஜோதிடரின் நேரடி ஆலோசனைகள் மற்றும் பரிகாரங்கள் தேவையா?' : 'Want Expert Astrologer Review & Custom Remedies?'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-stone-400 mt-0.5">
                  {lang === 'kn'
                    ? 'ಗ್ರಹಗಳ ಶಾಂತಿ ಹಾಗೂ ಪರಿಹಾರ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಈ ಫಲಿತಾಂಶವನ್ನು ಪ್ರಮಾಣೀಕೃತ ಜ್ಯೋತಿಷಿಗಳಿಗೆ ಕಳುಹಿಸಿ.'
                    : lang === 'ta'
                    ? 'இந்த முடிவுகளை ஜோதிடருக்கு அனுப்பி துல்லிய பரிசீலனை மற்றும் பரிகாரங்களைப் பெறலாம்.'
                    : 'Send this self-calculated report to a verified astrologer for deeper planetary scrutiny and remedial recommendations.'}
                </p>
              </div>

              {!sendAfterSelfReview && (
                <button
                  onClick={() => setSendAfterSelfReview(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer shrink-0"
                >
                  {lang === 'kn' ? 'ಜ್ಯೋತಿಷಿಗಳಿಗೆ ಕಳುಹಿಸಿ' : lang === 'ta' ? 'ஜோதிடருக்கு அனுப்புக' : 'Send to Astrologer for Suggestions'}
                </button>
              )}
            </div>

            {sendAfterSelfReview && (
              <div className="pt-3 border-t border-amber-200/80 dark:border-amber-800/50 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-stone-200 block mb-1">
                      {MATCH_I18N.selectAstroLabel[lang] || 'Select Astrologer *'}
                    </label>
                    <select
                      value={selectedAstroId}
                      onChange={(e) => setSelectedAstroId(e.target.value)}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 font-medium"
                    >
                      {availableAstrologers.map((astro) => (
                        <option key={astro.id} value={astro.id}>
                          {astro.name} ({astro.specializations?.[0] || 'Vedic Astrology'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 dark:text-stone-200 block mb-1">
                      {MATCH_I18N.clientQueryLabel[lang] || 'Notes / Query for Astrologer'}
                    </label>
                    <input
                      type="text"
                      value={clientQuery}
                      onChange={(e) => setClientQuery(e.target.value)}
                      placeholder={MATCH_I18N.clientQueryPlaceholder[lang] || 'Enter notes or specific query...'}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRequestAstrologer}
                    disabled={submittingRequest}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {submittingRequest ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{MATCH_I18N.sendRequestBtn[lang] || 'Confirm & Send to Astrologer'}</span>
                  </button>
                  <button
                    onClick={() => setSendAfterSelfReview(false)}
                    className="text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200 px-3 py-2 text-xs cursor-pointer"
                  >
                    {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : lang === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. MATCHING RESULTS & ASTROLOGER REVIEWS (Displayed Below Entered Details) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-stone-700 pb-2">
          <h3 className="font-black text-slate-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            {MATCH_I18N.resultsHeading[lang] || MATCH_I18N.resultsHeading.en}
          </h3>
          <span className="text-xs text-slate-500 dark:text-stone-400 font-medium">
            {requests.length} {MATCH_I18N.totalRecords[lang] || 'Records'}
          </span>
        </div>

        {loadingRequests ? (
          <div className="p-8 text-center bg-white dark:bg-[#1E1815] rounded-2xl border border-slate-200 dark:border-stone-700">
            <Sparkles className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-stone-400">Checking matching records...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#1E1815] rounded-2xl border border-dashed border-slate-300 dark:border-stone-600 text-slate-500 dark:text-stone-400 text-xs">
            {lang === 'kn'
              ? 'ಇನ್ನೂ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿಲ್ಲ. ಮೇಲೆ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಜ್ಯೋತಿಷಿಗಳಿಗೆ ಕಳುಹಿಸಿ.'
              : lang === 'ta'
              ? 'இதுவரை திருமணப் பொருத்தக் கோரிக்கைகள் சமர்ப்பிக்கப்படவில்லை. மேலே விவரங்களை உள்ளிட்டு அனுப்பவும்.'
              : 'No matching requests submitted yet. Enter birth details above and click "Send Details to Astrologer".'}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-[#1E1815] border border-slate-200 dark:border-stone-700 rounded-2xl overflow-hidden shadow-xs hover:border-amber-300 transition-all"
              >
                {/* Header Strip */}
                <div className="bg-slate-50 dark:bg-stone-900/70 p-3.5 sm:p-4 border-b border-slate-200 dark:border-stone-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-stone-100 text-sm">
                        {req.boy?.name} & {req.girl?.name}
                      </span>
                      {req.status === 'completed' ? (
                        <span className="bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {MATCH_I18N.verifiedTitle[lang] || 'Astrologer Verified'}
                        </span>
                      ) : (
                        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-300 dark:border-amber-700/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                          {MATCH_I18N.pendingReviewTitle[lang] || 'Pending Astrologer Review'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-stone-400 mt-0.5">
                      {lang === 'kn' ? 'ಜ್ಯೋತಿಷಿಗಳು' : lang === 'ta' ? 'ஜோதிடர்' : 'Target Astrologer'}: <strong className="text-slate-800 dark:text-stone-200">{req.astrologerName}</strong> • {lang === 'kn' ? 'ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ' : lang === 'ta' ? 'சமர்ப்பிக்கப்பட்டது' : 'Submitted'}: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-slate-500 dark:text-stone-400 font-mono">
                    <span>{lang === 'ta' ? 'பதிவு எண்' : lang === 'kn' ? 'ನೋಂದಣಿ ಸಂಖ್ಯೆ' : lang === 'hi' ? 'आईडी' : 'ID'}: {req.id}</span>
                  </div>
                </div>

                {/* Case 1: PENDING REVIEW CARD */}
                {req.status === 'pending' && (
                  <div className="p-5 sm:p-6 bg-amber-50/30 dark:bg-amber-950/30 text-xs space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-xl mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">
                          {req.astrologerName} {MATCH_I18N.pendingReviewTitle[lang] || 'Pending Review'}
                        </h4>
                        <p className="text-slate-600 dark:text-stone-400 mt-1 leading-relaxed">
                          {lang === 'kn'
                            ? `ವರ ${req.boy?.name} ಮತ್ತು ವಧು ${req.girl?.name} ರವರ ಜಾತಕ ವಿವರಗಳನ್ನು ಜ್ಯೋತಿಷಿಗಳಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಜ್ಯೋತಿಷಿಗಳು ದಶಕೂಟ, ಅಷ್ಟಕೂಟ, ಕುಜ ದೋಷ ಮತ್ತು ಗೋಚಾರಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ.`
                            : lang === 'ta'
                            ? `வரன் ${req.boy?.name} மற்றும் பெண் ${req.girl?.name} ஆகியோரின் ஜாதக விவரங்கள் ஜோதிடரிடம் ஒப்படைக்கப்பட்டுள்ளன. 10 பொருத்தங்கள், 36 குணங்கள் மற்றும் செவ்வாய் தோஷம் ஆராயப்பட்டு வருகிறது.`
                            : `Birth details for ${req.boy?.name} and ${req.girl?.name} have been delivered to the astrologer for 10 Poruthams, 36 Gunas and Mars Dosha review.`}
                        </p>
                        {req.clientQuery && (
                          <div className="mt-2 p-2.5 bg-white dark:bg-[#1E1815] rounded-xl border border-amber-200 dark:border-amber-800/50 text-slate-700 dark:text-stone-300">
                            <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                              {MATCH_I18N.clientQueryLabel[lang] || 'Query'}:
                            </span>
                            "{req.clientQuery}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 2: COMPLETED REVIEW - Displays Full Results Below Entered Details */}
                {req.status === 'completed' && req.matchReport && (
                  <div className="p-4 sm:p-6 space-y-5 text-xs">
                    {/* Astrologer Review & Suggestions Banner */}
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-amber-50 dark:from-emerald-950/50 dark:via-slate-900/80 dark:to-amber-950/40 p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-emerald-200/60 dark:border-emerald-800/50">
                        <div>
                          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                            {lang === 'kn' ? 'ಜ್ಯೋತಿಷಿಗಳ ಅಧಿಕೃತ ತೀರ್ಪು' : lang === 'ta' ? 'அதிகாரப்பூர்வ ஜோதிடர் ஆய்வு & முடிவு' : 'Official Astrologer Review & Verdict'}
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-stone-100 mt-0.5">
                            {getCompatibilityLocalized(req.astrologerReview?.verdict, req.matchReport.totalScore ?? req.matchReport.totalGunas)}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-800 dark:text-stone-200">
                            {MATCH_I18N.reviewedBy[lang] || 'Reviewed by'}: {req.astrologerReview?.astrologerName || req.astrologerName}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-stone-400 block">
                            {new Date(req.astrologerReview?.reviewedAt || req.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Astrologer's Expert Suggestions */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-emerald-950 dark:text-emerald-200 block">
                          {MATCH_I18N.suggestionsHeading[lang] || "Astrologer's Expert Suggestions:"}
                        </span>
                        <p className="text-slate-800 dark:text-stone-200 leading-relaxed bg-white/70 dark:bg-[#1E1815]/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                          {getLocalizedReviewSuggestions(req.astrologerReview?.suggestions, req.id)}
                        </p>
                      </div>

                      {/* Prescribed Remedies */}
                      {req.astrologerReview?.remedies && (
                        <div className="space-y-1.5 pt-1">
                          <span className="font-bold text-amber-950 dark:text-amber-200 block flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            {MATCH_I18N.remediesHeading[lang] || 'Prescribed Vedic Remedies:'}
                          </span>
                          <p className="text-slate-800 dark:text-stone-200 leading-relaxed bg-amber-50/80 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50">
                            {getLocalizedReviewRemedies(req.astrologerReview?.remedies, req.id)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View Switcher for Completed Review: Tamil Poruthams vs Ashtakoota */}
                    {(() => {
                      const currentTab = reqTabs[req.id] || 'tamil';
                      return (
                        <div className="space-y-4">
                          <div className="flex flex-wrap border-b border-slate-200 dark:border-stone-700 text-xs font-bold gap-2 pb-1">
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'tamil' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'tamil'
                                  ? 'border-amber-600 text-amber-900 dark:text-amber-300'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              <span>{MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'ashtakoota' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'ashtakoota'
                                  ? 'border-indigo-600 text-indigo-900 dark:text-indigo-300'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Heart className="w-4 h-4 text-indigo-600" />
                              <span>{MATCH_I18N.tabAshtakoota[lang] || MATCH_I18N.tabAshtakoota.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'guja_dasha' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'guja_dasha'
                                  ? 'border-rose-600 text-rose-900 dark:text-rose-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Flame className="w-4 h-4 text-rose-600" />
                              <span>{MATCH_I18N.tabGujaDasha[lang] || MATCH_I18N.tabGujaDasha.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'rahu_ketu' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'rahu_ketu'
                                  ? 'border-teal-600 text-teal-900 dark:text-teal-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Zap className="w-4 h-4 text-teal-600" />
                              <span>{MATCH_I18N.tabRahuKetu[lang] || MATCH_I18N.tabRahuKetu.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'shashtashtagam' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'shashtashtagam'
                                  ? 'border-[#7A1A22] text-[#7A1A22] dark:text-amber-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <GitCompare className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
                              <span>{MATCH_I18N.tabShashtashtagam[lang] || MATCH_I18N.tabShashtashtagam.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'chandran' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'chandran'
                                  ? 'border-indigo-700 text-indigo-900 dark:text-indigo-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Moon className="w-4 h-4 text-indigo-600" />
                              <span>{MATCH_I18N.tabChandran[lang] || MATCH_I18N.tabChandran.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'guru' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'guru'
                                  ? 'border-amber-600 text-amber-900 dark:text-amber-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              <span>{MATCH_I18N.tabGuru[lang] || MATCH_I18N.tabGuru.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'dasa_sandhi' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'dasa_sandhi'
                                  ? 'border-[#7A1A22] text-[#7A1A22] dark:text-amber-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Clock className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
                              <span>{MATCH_I18N.tabDasaSandhi[lang] || MATCH_I18N.tabDasaSandhi.en}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqTabs({ ...reqTabs, [req.id]: 'matching_nakshatras' })}
                              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                                currentTab === 'matching_nakshatras'
                                  ? 'border-emerald-700 text-emerald-900 dark:text-emerald-300 font-bold'
                                  : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200'
                              }`}
                            >
                              <Star className="w-4 h-4 text-emerald-600" />
                              <span>{MATCH_I18N.tabMatchingNakshatras[lang] || MATCH_I18N.tabMatchingNakshatras.en}</span>
                            </button>
                          </div>

                          {currentTab === 'tamil' ? (
                            <TamilPoruthamCard matchReport={req.matchReport} />
                          ) : currentTab === 'guja_dasha' ? (
                            <GujaDashaChart matchReport={req.matchReport} />
                          ) : currentTab === 'rahu_ketu' ? (
                            <RahuKetuChart matchReport={req.matchReport} />
                          ) : currentTab === 'shashtashtagam' ? (
                            <ShashtashtagamMatchCard matchReport={req.matchReport} />
                          ) : currentTab === 'chandran' ? (
                            <ChandranMatchCard matchReport={req.matchReport} />
                          ) : currentTab === 'guru' ? (
                            <GuruMatchCard matchReport={req.matchReport} />
                          ) : currentTab === 'dasa_sandhi' ? (
                            <DasaSandhiMatchCard matchReport={req.matchReport} />
                          ) : currentTab === 'matching_nakshatras' ? (
                            <MatchingNakshatrasCard matchReport={req.matchReport} />
                          ) : (
                            <div className="space-y-4">
                              {/* Score Bar */}
                              <div className="flex flex-col sm:flex-row justify-between items-center bg-amber-50/50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 gap-3">
                                <div>
                                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                                    {MATCH_I18N.tabAshtakoota[lang] || 'Ashtakoota 36 Guna Score'}
                                  </span>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-stone-300">
                                    <strong className="text-slate-900 dark:text-stone-100">
                                      {getCompatibilityLocalized(req.matchReport.compatibility || req.matchReport.verdict, req.matchReport.totalScore ?? req.matchReport.totalGunas)}
                                    </strong> ({req.matchReport.percentage || Math.round(((req.matchReport.totalScore ?? req.matchReport.totalGunas ?? 0)/36)*100)}%)
                                  </span>
                                </div>
                                <div className="text-center sm:text-right">
                                  <span className="text-3xl font-black text-amber-700 dark:text-amber-400">
                                    {req.matchReport.totalScore ?? req.matchReport.totalGunas} <span className="text-base text-slate-500 dark:text-stone-400 font-normal">/ 36</span>
                                  </span>
                                </div>
                              </div>

                              {/* 8 Kootas Detailed Matrix */}
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[480px] text-xs text-left border-collapse border border-slate-200 dark:border-stone-700">
                                  <thead>
                                    <tr className="bg-slate-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 font-bold border-b border-slate-200 dark:border-stone-700">
                                      <th className="py-2 px-3">{MATCH_I18N.colPorutham[lang] || 'Koota'}</th>
                                      <th className="py-2 px-3">{MATCH_I18N.colSignificance[lang] || 'Significance'}</th>
                                      <th className="py-2 px-3 text-center">{lang === 'kn' ? 'ಗರಿಷ್ಠ ಅಂಕ' : lang === 'ta' ? 'அதிகபட்சம்' : 'Max Points'}</th>
                                      <th className="py-2 px-3 text-center">{lang === 'kn' ? 'ಪಡೆದ ಅಂಕ' : lang === 'ta' ? 'பெற்றவை' : 'Obtained'}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-stone-800">
                                    {req.matchReport.kootas?.map((k, i) => {
                                      const localized = getAshtakootaLocalized(k.koota || k.name);
                                      return (
                                        <tr key={i} className="hover:bg-amber-50/30 dark:hover:bg-stone-800/70">
                                          <td className="py-2 px-3 font-bold text-slate-900 dark:text-stone-100">{localized.name}</td>
                                          <td className="py-2 px-3 text-slate-600 dark:text-stone-400">{localized.desc || k.description || k.desc}</td>
                                          <td className="py-2 px-3 text-center font-semibold text-slate-500 dark:text-stone-400">{k.max}</td>
                                          <td className="py-2 px-3 text-center font-bold text-amber-700 dark:text-amber-400">{k.obtained}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Manglik Comparison */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-200 dark:border-stone-700">
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-stone-100 block mb-0.5">
                                    {MATCH_I18N.groomHoroscope[lang] || 'Groom'}:
                                  </span>
                                  <span className="text-slate-600 dark:text-stone-400">{getManglikLocalized(req.matchReport.manglik?.boy)}</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-stone-100 block mb-0.5">
                                    {MATCH_I18N.brideHoroscope[lang] || 'Bride'}:
                                  </span>
                                  <span className="text-slate-600 dark:text-stone-400">{getManglikLocalized(req.matchReport.manglik?.girl)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
