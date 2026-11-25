import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  User,
  Phone,
  Calendar,
  MapPin,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Heart,
  Radio,
  Clock,
  Send,
  AlertTriangle,
  Star,
  CheckSquare,
  Video,
  MessageSquare,
  Users,
  Printer,
  Lock,
  RefreshCw,
  Key,
  Edit3,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';
import ClientRegistrationReceiptModal from '../components/ClientRegistrationReceiptModal';
import TamilPoruthamCard from '../components/TamilPoruthamCard';
import HoroscopeHub from '../components/HoroscopeHub';
import ThirukanithaHoroscopeView from '../components/ThirukanithaHoroscopeView';
import HoroscopePagerView from '../components/HoroscopePagerView';
import { MATCH_I18N } from '../matchmakingI18n';
import { useClientBirth } from '../context/ClientBirthContext';
import BirthDetailsIntakeCard from '../components/BirthDetailsIntakeCard';
import { calculateThirukanithaHoroscope, NAKSHATRAS, RASHIS } from '../utils/thirukanithaEngine';

export default function AstrologerDashboard({ activeTab: propTab, onTabChange }) {
  const { user, setUser } = useAuth();
  const { lang, t } = useLang();
  const {
    clientData,
    activeBirthData,
    calculatedHoroscope,
    selectClient,
    refreshCalculations,
    calcKey
  } = useClientBirth();

  const [internalTab, setInternalTab] = useState('appointments');
  const activeTab = propTab || internalTab;
  const setActiveTab = (tab) => {
    refreshCalculations();
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Re-run calculations whenever the active tab changes (e.g. shuffling between pagers/tabs)
  useEffect(() => {
    refreshCalculations();
  }, [activeTab, refreshCalculations]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchKundli, setShowSearchKundli] = useState(false);

  // Live Matchmaking with Partner State (Support both existing client lookup & adding new couple manually)
  const [person1Mode, setPerson1Mode] = useState('client'); // 'client' | 'manual'
  const [manualPerson1Details, setManualPerson1Details] = useState({
    name: '',
    gender: 'male',
    dob: '',
    dobTime: '',
    dobPlace: '',
    lat: 11.6643,
    lon: 78.1460
  });

  // Calculate live Thirukanitha Horoscope for Person 1 when in manual mode
  const manualPerson1Horoscope = React.useMemo(() => {
    if (!manualPerson1Details.dob) return null;
    try {
      const parts = String(manualPerson1Details.dob).split(/[-/.]/);
      if (parts.length !== 3) return null;
      return calculateThirukanithaHoroscope({
        name: manualPerson1Details.name || 'Person 1',
        dob: manualPerson1Details.dob,
        dobTime: manualPerson1Details.dobTime || '12:00',
        city: manualPerson1Details.dobPlace || 'Salem',
        placeName: manualPerson1Details.dobPlace || 'Salem',
        lat: manualPerson1Details.lat || 11.6643,
        lon: manualPerson1Details.lon || 78.1460
      });
    } catch {
      return null;
    }
  }, [manualPerson1Details.dob, manualPerson1Details.dobTime, manualPerson1Details.dobPlace, manualPerson1Details.name]);

  const [partnerDetails, setPartnerDetails] = useState({
    name: '',
    gender: 'female',
    dob: '',
    dobTime: '',
    dobPlace: '',
    lat: 13.0827,
    lon: 80.2707
  });

  // Calculate live Thirukanitha Horoscope for partner when DOB is entered
  const partnerHoroscope = React.useMemo(() => {
    if (!partnerDetails.dob) return null;
    try {
      const parts = String(partnerDetails.dob).split(/[-/.]/);
      if (parts.length !== 3) return null;
      return calculateThirukanithaHoroscope({
        name: partnerDetails.name || 'Partner',
        dob: partnerDetails.dob,
        dobTime: partnerDetails.dobTime || '12:00',
        city: partnerDetails.dobPlace || 'Chennai',
        placeName: partnerDetails.dobPlace || 'Chennai',
        lat: partnerDetails.lat || 13.0827,
        lon: partnerDetails.lon || 80.2707
      });
    } catch {
      return null;
    }
  }, [partnerDetails.dob, partnerDetails.dobTime, partnerDetails.dobPlace, partnerDetails.name]);
  const [activeClientMatchReport, setActiveClientMatchReport] = useState(null);
  const [calculatingActiveMatch, setCalculatingActiveMatch] = useState(false);
  const [activeMatchTab, setActiveMatchTab] = useState('tamil');

  const handleResetMatchmaking = () => {
    setPartnerDetails({
      name: '',
      gender: 'female',
      dob: '',
      dobTime: '',
      dobPlace: '',
      lat: 13.0827,
      lon: 80.2707
    });
    setManualPerson1Details({
      name: '',
      gender: 'male',
      dob: '',
      dobTime: '',
      dobPlace: '',
      lat: 11.6643,
      lon: 78.1460
    });
    setActiveClientMatchReport(null);
  };

  // Astrologer Profile & 1-Pager Header Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    experience: user?.experience || '',
    languages: user?.languages || '',
    bio: user?.bio || '',
    address: user?.address || '',
    pagerHeader: {
      line1: user?.pagerHeader?.line1 || user?.brandLine1 || '',
      line2: user?.pagerHeader?.line2 || user?.brandLine2 || '',
      address1: user?.pagerHeader?.address1 || user?.address1 || '',
      address2: user?.pagerHeader?.address2 || user?.address2 || '',
      phoneEmail: user?.pagerHeader?.phoneEmail || user?.phoneEmail || ''
    }
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Keep profileForm synced with logged in astrologer profile
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        experience: user.experience || '',
        languages: user.languages || '',
        bio: user.bio || '',
        address: user.address || '',
        pagerHeader: {
          line1: user.pagerHeader?.line1 || user.brandLine1 || 'ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்',
          line2: user.pagerHeader?.line2 || user.brandLine2 || 'SAI BALAJI ASTROLOGICAL RESEARCH CENTRE',
          address1: user.pagerHeader?.address1 || user.address1 || 'Salem, தமிழ்நாடு - 636001',
          address2: user.pagerHeader?.address2 || user.address2 || 'சென்னை & பெங்களூரு கிளைகள்',
          phoneEmail: user.pagerHeader?.phoneEmail || user.phoneEmail || 'தொலைபேசி: +91 98765 43210 | மின்னஞ்சல்: astro@astrojit.com'
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await API.updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        address: profileForm.address,
        experience: profileForm.experience,
        languages: profileForm.languages,
        bio: profileForm.bio,
        pagerHeader: profileForm.pagerHeader,
        brandLine1: profileForm.pagerHeader.line1,
        brandLine2: profileForm.pagerHeader.line2,
        address1: profileForm.pagerHeader.address1,
        address2: profileForm.pagerHeader.address2,
        phoneEmail: profileForm.pagerHeader.phoneEmail
      });
      if (res?.user && setUser) {
        setUser(res.user);
      }
      setProfileSuccessMsg(lang === 'ta' ? 'சுயவிவரம் மற்றும் 1-பேஜர் முகப்பு வெற்றிகரமாக சேமிக்கப்பட்டது!' : 'Profile & 1-Pager Header saved successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err) {
      alert((lang === 'ta' ? 'சுயவிவரம் சேமிக்க முடியவில்லை: ' : 'Failed to save profile: ') + err.message);
    } finally {
      setSavingProfile(false);
    }
  };
  const [selectedClientMobile, setSelectedClientMobile] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [clientNotes, setClientNotes] = useState([]);
  const [loadingClient, setLoadingClient] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referredData, setReferredData] = useState({ totalReferred: 0, clients: [] });

  const [isOnline, setIsOnline] = useState(true);
  const [ratePerMinute, setRatePerMinute] = useState(25);
  const [availableSlots, setAvailableSlots] = useState(['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM']);
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState(null);

  // Matchmaking Requests State for Astrologer
  const [matchRequests, setMatchRequests] = useState([]);
  const [pendingMatchCount, setPendingMatchCount] = useState(0);
  const [loadingMatchReqs, setLoadingMatchReqs] = useState(false);
  const [selectedMatchReq, setSelectedMatchReq] = useState(null);
  const [modalMatchTab, setModalMatchTab] = useState('tamil');
  const [reviewForm, setReviewForm] = useState({
    verdict: 'Highly Recommended (Shubha Vivaha)',
    suggestions: '',
    remedies: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Appointments & Consultations State for Astrologer
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [pendingAptCount, setPendingAptCount] = useState(0);
  const [selectedAptForResolution, setSelectedAptForResolution] = useState(null);
  const [resolutionForm, setResolutionForm] = useState({
    astrologerAnswer: '',
    prescribedRemedies: '',
    privateNotes: '',
  });
  const [submittingResolution, setSubmittingResolution] = useState(false);
  const [resolutionSuccessMsg, setResolutionSuccessMsg] = useState('');

  useEffect(() => {
    async function loadInitial() {
      try {
        const data = await API.getReferredClients();
        setReferredData(data);
        await loadMatchRequests();
        await loadAppointments();
      } catch (err) {
        console.error('Error loading astrologer initial data:', err);
      }
    }
    loadInitial();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const data = await API.getMyAppointments();
      setAppointments(data || []);
      const pending = (data || []).filter((a) => a.status !== 'Completed').length;
      setPendingAptCount(pending);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleOpenResolutionModal = (apt) => {
    setSelectedAptForResolution(apt);
    setResolutionForm({
      astrologerAnswer: apt.astrologerAnswer || '',
      prescribedRemedies: apt.prescribedRemedies || '',
      privateNotes: apt.privateNotes || '',
    });
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!selectedAptForResolution || !resolutionForm.astrologerAnswer.trim()) {
      alert('Please provide the resolution answer for the client query.');
      return;
    }

    setSubmittingResolution(true);
    try {
      await API.completeAppointment({
        appointmentId: selectedAptForResolution.id,
        astrologerAnswer: resolutionForm.astrologerAnswer.trim(),
        prescribedRemedies: resolutionForm.prescribedRemedies.trim(),
        privateNotes: resolutionForm.privateNotes.trim(),
      });
      setResolutionSuccessMsg(`Consultation for ${selectedAptForResolution.clientName} completed & resolution delivered!`);
      setTimeout(() => setResolutionSuccessMsg(''), 6000);
      setSelectedAptForResolution(null);
      await loadAppointments();
    } catch (err) {
      alert('Failed to save resolution: ' + err.message);
    } finally {
      setSubmittingResolution(false);
    }
  };

  const loadMatchRequests = async () => {
    try {
      setLoadingMatchReqs(true);
      const data = await API.getAstrologerMatchmakingRequests();
      setMatchRequests(data.requests || []);
      setPendingMatchCount(data.pendingCount || 0);
    } catch (err) {
      console.error('Error loading astrologer match requests:', err);
    } finally {
      setLoadingMatchReqs(false);
    }
  };

  const handleOpenReview = async (req) => {
    let report = req.matchReport;
    if (!report) {
      try {
        report = await API.calculateMatch(req.boy, req.girl);
      } catch (e) {
        console.error('Could not precompute match report:', e);
      }
    }

    setSelectedMatchReq({ ...req, matchReport: report });
    setReviewForm({
      verdict: req.astrologerReview?.verdict || 'Highly Recommended (Shubha Vivaha)',
      suggestions:
        req.astrologerReview?.suggestions ||
        `The horoscopes of ${req.boy?.name} and ${req.girl?.name} show auspicious mental and spiritual alignment. Favorable planetary aspects support domestic harmony and shared prosperity.`,
      remedies:
        req.astrologerReview?.remedies ||
        'Perform joint archana to Lord Shiva & Goddess Parvati on a favorable Nakshatra day. Chant Gayatri Mantra daily.',
    });
    setReviewSuccessMsg('');
  };

  const handleSubmitReview = async (e) => {
    if (e) e.preventDefault();
    if (!selectedMatchReq) return;

    setSubmittingReview(true);
    try {
      const res = await API.submitMatchmakingReview({
        requestId: selectedMatchReq.id,
        verdict: reviewForm.verdict,
        suggestions: reviewForm.suggestions,
        remedies: reviewForm.remedies,
      });

      setReviewSuccessMsg(`Review for ${selectedMatchReq.boy?.name} & ${selectedMatchReq.girl?.name} sent to client successfully!`);
      setSelectedMatchReq(null);
      await loadMatchRequests();
    } catch (err) {
      alert('Failed to send review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleOnlineStatus = async () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    try {
      await API.updateAstrologerStatus({ isOnline: nextStatus, ratePerMinute, availableSlots });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const astroSearchTimeoutRef = useRef(null);

  const performAstroSearch = async (val) => {
    const q = (typeof val === 'string' ? val : searchQuery).trim();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setSelectedClientMobile(null);
    setClientProfile(null);
    try {
      const res = await API.searchClients(q);
      setSearchResults(res.clients || []);
    } catch (err) {
      console.warn('Error searching clients:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAstroSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (astroSearchTimeoutRef.current) {
      clearTimeout(astroSearchTimeoutRef.current);
    }
    if (!val.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    astroSearchTimeoutRef.current = setTimeout(() => {
      performAstroSearch(val);
    }, 60);
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (astroSearchTimeoutRef.current) {
      clearTimeout(astroSearchTimeoutRef.current);
    }
    await performAstroSearch(searchQuery);
  };

  const handleSelectClient = async (mobile) => {
    setSelectedClientMobile(mobile);
    setLoadingClient(true);
    try {
      const data = await API.getClientProfileByMobile(mobile);
      const cl = data.client || data;
      setClientProfile(cl);
      setClientNotes(data.consultationHistory || []);
      // Keep shared ClientBirthContext updated across Horoscope, Search, and Matchmaking
      selectClient(cl);
      refreshCalculations();
    } catch (err) {
      alert('Failed to load client details: ' + err.message);
    } finally {
      setLoadingClient(false);
    }
  };

  const handleCalculateActiveMatch = async () => {
    const isP1Manual = person1Mode === 'manual';

    if (isP1Manual) {
      if (!manualPerson1Details.name?.trim() || !manualPerson1Details.dob?.trim()) {
        alert(
          lang === 'ta'
            ? 'தயவுசெய்து நபர் 1 இன் பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.'
            : 'Please enter Person 1 Name and Birth Date.'
        );
        return;
      }
    } else {
      if (!activeBirthData?.name || !activeBirthData?.dob) {
        alert(
          lang === 'ta'
            ? 'தயவுசெய்து மேலே உள்ள தேடலில் ஒரு வாடிக்கையாளரை தேர்ந்தெடுக்கவும் அல்லது "கைமுறையாக உள்ளிடு" தேர்வை சொடுக்கவும்.'
            : 'Please select an active client from search above or switch to "Enter Manually".'
        );
        return;
      }
    }

    if (!partnerDetails.name?.trim() || !partnerDetails.dob?.trim()) {
      alert(
        lang === 'ta'
          ? 'தயவுசெய்து வரனின் பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.'
          : 'Please enter Partner Name and Birth Date.'
      );
      return;
    }

    setCalculatingActiveMatch(true);
    try {
      const activeP1Horoscope = isP1Manual ? manualPerson1Horoscope : calculatedHoroscope;
      const p1Gender = isP1Manual ? (manualPerson1Details.gender || 'male') : (activeBirthData?.gender || 'male');
      const isP1Male = (p1Gender || 'male').toLowerCase() !== 'female';

      const p1Nak = activeP1Horoscope?.summary?.nakshatraEn ||
        activeP1Horoscope?.summary?.nakshatra ||
        (typeof activeP1Horoscope?.summary?.moonNak === 'number' && NAKSHATRAS[activeP1Horoscope.summary.moonNak]?.en) ||
        (!isP1Manual ? clientProfile?.nakshatra : '');
      const p1Rasi = activeP1Horoscope?.summary?.moonSignEn ||
        activeP1Horoscope?.summary?.moonSign ||
        activeP1Horoscope?.summary?.rasiEn ||
        (typeof activeP1Horoscope?.summary?.moonRasi === 'number' && RASHIS[activeP1Horoscope.summary.moonRasi]?.en) ||
        (!isP1Manual ? clientProfile?.rasi : '');
      const p1Pada = activeP1Horoscope?.summary?.moonPada || 1;

      const partnerNak = partnerHoroscope?.summary?.nakshatraEn ||
        partnerHoroscope?.summary?.nakshatra ||
        (typeof partnerHoroscope?.summary?.moonNak === 'number' && NAKSHATRAS[partnerHoroscope.summary.moonNak]?.en);
      const partnerRasi = partnerHoroscope?.summary?.moonSignEn ||
        partnerHoroscope?.summary?.moonSign ||
        partnerHoroscope?.summary?.rasiEn ||
        (typeof partnerHoroscope?.summary?.moonRasi === 'number' && RASHIS[partnerHoroscope.summary.moonRasi]?.en);
      const partnerPada = partnerHoroscope?.summary?.moonPada || 1;

      const p1DataObj = isP1Manual
        ? {
            name: manualPerson1Details.name.trim(),
            dob: manualPerson1Details.dob,
            dobTime: manualPerson1Details.dobTime || '12:00',
            dobPlace: manualPerson1Details.dobPlace || 'Salem',
            lat: manualPerson1Details.lat || 11.6643,
            lon: manualPerson1Details.lon || 78.1460,
            starNakshatra: p1Nak,
            nakshatra: p1Nak,
            moonSign: p1Rasi,
            rasi: p1Rasi,
            rasiMoonSign: p1Rasi,
            pada: p1Pada
          }
        : {
            name: activeBirthData.name || 'Client',
            dob: activeBirthData.dob,
            dobTime: activeBirthData.dobTime || '10:30',
            dobPlace: activeBirthData.city || activeBirthData.placeName || 'Salem',
            lat: activeBirthData.lat || 11.6643,
            lon: activeBirthData.lon || 78.1460,
            starNakshatra: p1Nak,
            nakshatra: p1Nak,
            moonSign: p1Rasi,
            rasi: p1Rasi,
            rasiMoonSign: p1Rasi,
            pada: p1Pada
          };

      const partnerDataObj = {
        name: partnerDetails.name.trim(),
        dob: partnerDetails.dob,
        dobTime: partnerDetails.dobTime || '12:00',
        dobPlace: partnerDetails.dobPlace || 'Chennai',
        lat: partnerDetails.lat || 13.0827,
        lon: partnerDetails.lon || 80.2707,
        starNakshatra: partnerNak,
        nakshatra: partnerNak,
        moonSign: partnerRasi,
        rasi: partnerRasi,
        rasiMoonSign: partnerRasi,
        pada: partnerPada
      };

      const boyData = isP1Male ? p1DataObj : partnerDataObj;
      const girlData = isP1Male ? partnerDataObj : p1DataObj;

      const report = await API.calculateMatch(boyData, girlData);
      setActiveClientMatchReport(report);
    } catch (err) {
      alert((lang === 'ta' ? 'பொருத்தம் கணக்கிட முடியவில்லை: ' : 'Failed to calculate matchmaking: ') + err.message);
    } finally {
      setCalculatingActiveMatch(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const notes = formData.get('notes');
    const remediesSuggested = formData.get('remediesSuggested');

    try {
      const res = await API.saveConsultationNote({
        clientMobile: selectedClientMobile,
        notes,
        remediesSuggested,
      });

      setClientNotes([res.note, ...clientNotes]);
      e.target.reset();
      alert('Consultation note saved successfully!');
    } catch (err) {
      alert('Failed to save consultation note: ' + err.message);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleViewClientReceipt = async (clientIdOrMobile) => {
    try {
      const res = await API.getClientReceipt(clientIdOrMobile);
      if (res.receipt) {
        setSelectedReceiptForModal(res.receipt);
      } else {
        alert('Could not find registration receipt for this client.');
      }
    } catch (err) {
      alert('Failed to load client receipt: ' + err.message);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Astrologer Profile & Referral Header */}
      <div className="bg-white border border-indigo-200/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                user?.type === 'company'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {user?.type === 'company' ? t('astrologicalFirm') : t('individualAstrologer')}
              </span>

              <button
                onClick={toggleOnlineStatus}
                className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <Radio className={`w-3 h-3 ${isOnline ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                {isOnline ? t('onlineAccepting') : t('offlineStatus')}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{lang === 'ta' ? 'சுயவிவரம் & 1-பேஜர் முகப்பு' : 'Edit Profile & 1-Pager Header'}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              {user?.type === 'company' ? <Building2 className="w-5 h-5 text-purple-600" /> : <UserCheck className="w-5 h-5 text-indigo-600" />}
              {user?.name}
            </h1>

            {user?.contactPerson && (
              <p className="text-xs text-slate-600 mt-0.5">{t('contactLabel')}: {user.contactPerson}</p>
            )}

            <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <span>{t('mob')}: <strong className="text-slate-900">{user?.mobile}</strong></span>
              <span>•</span>
              <span>{t('expLabel')}: <strong className="text-slate-900">{user?.experience?.toString().includes('Year') ? user?.experience : `${user?.experience} ${t('yearsSuffix')}`}</strong></span>
              <span>•</span>
              <span>{t('languagesLabel')}: <strong className="text-slate-900">{user?.languages || 'English, Hindi'}</strong></span>
            </p>
          </div>

          {/* Referral Code & Stats Pill */}
          <div className="flex items-center gap-3 bg-amber-50/60 p-2.5 sm:p-3 rounded-xl border border-amber-200 self-stretch sm:self-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] text-amber-800 uppercase tracking-wider block font-bold">
                {t('yourReferralCode')}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <code className="text-xs sm:text-sm font-black text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                  {user?.referralCode || 'JIT-ASTRO'}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="p-1 rounded bg-white hover:bg-amber-100 text-slate-700 text-xs border border-amber-200 cursor-pointer"
                  title={t('copyCodeTitle')}
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="h-7 w-px bg-amber-200"></div>

            <div className="text-center px-1">
              <span className="text-[10px] text-amber-800 uppercase tracking-wider block font-bold">
                {t('referredCountLabel')}
              </span>
              <span className="text-sm sm:text-base font-black text-indigo-800 mt-0.5 block">
                {referredData.totalReferred}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto touch-pan-x no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('tabAppointments')}</span>
            {pendingAptCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingAptCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'horoscope' || activeTab === 'thirukanitha' || activeTab === 'horoscope_pagers' || activeTab === 'pager'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'ta' ? 'ஜாதகம்' : 'Horoscope'}</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabClientSearch')}
          </button>
          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matchmaking'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{t('tabMatchmaking')}</span>
            {pendingMatchCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingMatchCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('referred')}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'referred'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabReferred')} ({referredData.totalReferred})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'சுயவிவரம் & 1-பேஜர்' : 'Profile & 1-Pager'}</span>
          </button>
        </div>
      </div>

      {/* TAB 0: Consultations & Client Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                {t('consultationSessionsTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('consultationSessionsDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs border border-amber-300">
                {pendingAptCount} {t('pendingResolutionBadge')}
              </span>
              <button
                onClick={loadAppointments}
                disabled={loadingAppointments}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {loadingAppointments ? t('refreshing') : t('refreshBtn')}
              </button>
            </div>
          </div>

          {resolutionSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resolutionSuccessMsg}</span>
            </div>
          )}

          {/* Section: Pending / Upcoming Consultations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Clock className="w-4 h-4 text-amber-600" />
              {t('scheduledUpcomingTitle')} ({appointments.filter((a) => a.status !== 'Completed').length})
            </h4>

            {appointments.filter((a) => a.status !== 'Completed').length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                {t('noPendingConsultations')}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((a) => a.status !== 'Completed')
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="border border-amber-200 bg-amber-50/20 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{apt.clientName}</span>
                            <span className="font-mono text-xs font-bold text-amber-800">({apt.clientMobile})</span>
                            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-300">
                              ● {apt.status}
                            </span>
                            <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-indigo-200 uppercase">
                              {apt.appointmentType === 'offline'
                                ? `🏛️ ${t('offline')}`
                                : apt.appointmentType === 'chat'
                                ? `💬 Live Chat`
                                : `📹 ${t('online')}`}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 mt-0.5 block">
                            {t('topicAreaLabel')} <strong className="text-slate-800">{apt.queryArea || apt.consultationTopic}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                          <span>📅 {apt.date}</span>
                          <span>•</span>
                          <span className="text-amber-700">⏰ {apt.slotTime}</span>
                        </div>
                      </div>

                      {/* Client's Query to Ask (Highlighted for Astrologer) */}
                      <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-amber-950 text-[11px] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-700" />
                          {t('clientSubmittedQueryLabel')}
                        </span>
                        <p className="text-slate-800 italic pl-5 leading-relaxed font-medium">
                          "{apt.clientQuery || apt.consultationTopic || 'General horoscope review.'}"
                        </p>
                      </div>

                      {/* Offline address if applicable */}
                      {apt.appointmentType === 'offline' && apt.officeAddress && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-xs text-slate-600">
                          <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{t('officeVenueLabel')} <strong>{apt.officeAddress}</strong></span>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 border-t border-amber-100">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {t('idLabel')} {apt.id} • {t('bookedLabel')} {new Date(apt.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2 flex-wrap">
                          {apt.appointmentType === 'online' && (
                            <button
                              onClick={() => alert(`Starting private video consultation room for ${apt.clientName}...`)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5 text-indigo-600" /> {t('startVideoBtn')}
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenResolutionModal(apt)}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t('enterResolutionBtn')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Section: Completed Consultation Records */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t('completedConsultationsTitle')} ({appointments.filter((a) => a.status === 'Completed').length})
            </h4>

            {appointments.filter((a) => a.status === 'Completed').length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                {t('noCompletedConsultations')}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((a) => a.status === 'Completed')
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{apt.clientName}</span>
                            <span className="font-mono text-xs font-bold text-amber-800">({apt.clientMobile})</span>
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> {t('completedBadge')}
                            </span>
                            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-slate-200 uppercase">
                              {apt.appointmentType}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            {t('conductedLabel')} <strong>{apt.date} ({apt.slotTime})</strong> • {t('topicAreaLabel')} <strong>{apt.queryArea || apt.consultationTopic}</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenResolutionModal(apt)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          {t('viewEditResolutionBtn')}
                        </button>
                      </div>

                      {/* Client Query Asked */}
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-0.5">
                        <span className="font-bold text-slate-800 text-[11px] block">{t('clientSubmittedQueryLabel')}</span>
                        <p className="text-slate-700 italic">"{apt.clientQuery || apt.consultationTopic}"</p>
                      </div>

                      {/* Astrologer's Answer */}
                      <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-indigo-950 text-[11px] block">{t('deliveredResolutionLabel')}</span>
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">{apt.astrologerAnswer}</p>
                      </div>

                      {/* Prescribed Remedies */}
                      {apt.prescribedRemedies && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                          <span className="font-bold text-amber-950 text-[11px] block">{t('prescribedRemediesLabel')}</span>
                          <p className="text-amber-950 whitespace-pre-line leading-relaxed">{apt.prescribedRemedies}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL FOR ASTROLOGER */}
      {selectedAptForResolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  {t('consultationResolutionWorkspace')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedAptForResolution.clientName} ({selectedAptForResolution.clientMobile})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAptForResolution(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Client Query Highlight Box */}
            <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  {t('clientSubmittedQueryLabel')}
                </span>
                <span className="text-[10px] text-amber-800 font-bold">
                  {selectedAptForResolution.queryArea || selectedAptForResolution.consultationTopic}
                </span>
              </div>
              <p className="text-slate-800 italic pl-4 leading-relaxed font-medium">
                "{selectedAptForResolution.clientQuery || selectedAptForResolution.consultationTopic || 'General horoscope consultation.'}"
              </p>
            </div>

            {/* Resolution Form */}
            <form onSubmit={handleSubmitResolution} className="space-y-3.5 mt-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  {t('astrologerAnswerHeading')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionForm.astrologerAnswer}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, astrologerAnswer: e.target.value })}
                  placeholder={t('astrologerAnswerPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  {t('prescribedRemediesHeading')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionForm.prescribedRemedies}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, prescribedRemedies: e.target.value })}
                  placeholder={t('prescribedRemediesPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  {t('privateAstrologerNotesHeading')}
                </label>
                <textarea
                  rows={2}
                  value={resolutionForm.privateNotes}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, privateNotes: e.target.value })}
                  placeholder={t('privateAstrologerNotesPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {t('resolutionConfidentialNotice')}{' '}
                  <strong className="text-slate-900">{selectedAptForResolution.clientName}</strong>.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAptForResolution(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-semibold cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={submittingResolution || !resolutionForm.astrologerAnswer.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingResolution ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {t('deliverResolutionBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Unified Horoscope Hub (Intake + Previous Clients Search + Full Horoscope View) */}
      {(activeTab === 'horoscope' || activeTab === 'thirukanitha') && (
        <HoroscopeHub
          hideClientLookup={false}
        />
      )}

      {/* 1-Pager Letterhead Preview (Accessed from Profile & 1-Pager Tab) */}
      {(activeTab === 'horoscope_pagers' || activeTab === 'pager') && (
        <HoroscopePagerView
          initialBirthData={activeBirthData}
          onClose={() => setActiveTab('profile')}
        />
      )}

      {/* TAB 1: Client Horoscope History */}
      {activeTab === 'search' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Unified Birth Details Intake Form with Autocomplete Client Lookup */}
          <BirthDetailsIntakeCard
            module="search"
            onCalculate={() => refreshCalculations()}
          />

          {/* Active Client Details & Kundli Snapshot */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'ta' ? 'வாடிக்கையாளர் ஜாதக வரலாறு & விபரங்கள்' : 'Client Horoscope History & Profile Summary'}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ta'
                    ? 'முந்தைய வாடிக்கையாளர் விவரங்கள் மற்றும் ஜாதக வரலாறு இங்கே காட்டப்படும்.'
                    : 'Previous client details and horoscope history are displayed here.'}
                </p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{activeBirthData?.name || clientProfile?.name || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Mobile</span>
                <span className="font-bold text-slate-900 font-mono">{activeBirthData?.mobile || clientProfile?.mobile || selectedClientMobile || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender</span>
                <span className="font-bold text-slate-900 capitalize">{activeBirthData?.gender || clientProfile?.gender || 'male'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth & Time</span>
                <span className="font-bold text-slate-900">{activeBirthData?.dob ? `${activeBirthData.dob} (${activeBirthData.dobTime12 || activeBirthData.dobTime})` : '—'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Place of Birth</span>
                <span className="font-bold text-slate-900">{activeBirthData?.placeName || activeBirthData?.city || clientProfile?.dobPlace || '—'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'ta' ? 'நட்சத்திரம் / ராசி' : 'Nakshatra / Moon Sign'}</span>
                <span className="font-bold text-slate-900">
                  {(() => {
                    const nak = lang === 'ta'
                      ? (calculatedHoroscope?.summary?.nakshatraTa || (typeof calculatedHoroscope?.summary?.moonNak === 'number' && NAKSHATRAS[calculatedHoroscope.summary.moonNak]?.ta) || clientProfile?.nakshatra)
                      : (calculatedHoroscope?.summary?.nakshatraEn || calculatedHoroscope?.summary?.nakshatra || (typeof calculatedHoroscope?.summary?.moonNak === 'number' && NAKSHATRAS[calculatedHoroscope.summary.moonNak]?.en) || clientProfile?.nakshatra);

                    const pada = calculatedHoroscope?.summary?.moonPada ? (lang === 'ta' ? ` (${calculatedHoroscope.summary.moonPada} பாதம்)` : ` (Pada ${calculatedHoroscope.summary.moonPada})`) : '';

                    const rasi = lang === 'ta'
                      ? (calculatedHoroscope?.summary?.moonSignTa || calculatedHoroscope?.summary?.rasiTa || (typeof calculatedHoroscope?.summary?.moonRasi === 'number' && RASHIS[calculatedHoroscope.summary.moonRasi]?.ta) || clientProfile?.rasi)
                      : (calculatedHoroscope?.summary?.moonSignEn || calculatedHoroscope?.summary?.moonSign || calculatedHoroscope?.summary?.rasiEn || (typeof calculatedHoroscope?.summary?.moonRasi === 'number' && RASHIS[calculatedHoroscope.summary.moonRasi]?.en) || clientProfile?.rasi);

                    return `${nak ? `${nak}${pada}` : '—'} / ${rasi || '—'}`;
                  })()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'ta' ? 'லக்னம்' : 'Lagna (Ascendant)'}</span>
                <span className="font-bold text-indigo-700">
                  {lang === 'ta'
                    ? (calculatedHoroscope?.summary?.lagnaTa || (typeof calculatedHoroscope?.summary?.lagnaRasi === 'number' && RASHIS[calculatedHoroscope.summary.lagnaRasi]?.ta) || '—')
                    : (calculatedHoroscope?.summary?.lagnaEn || calculatedHoroscope?.summary?.lagna || (typeof calculatedHoroscope?.summary?.lagnaRasi === 'number' && RASHIS[calculatedHoroscope.summary.lagnaRasi]?.en) || '—')}
                  {calculatedHoroscope?.summary?.lagnaDegInSign ? ` (${calculatedHoroscope.summary.lagnaDegInSign})` : ''}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Dasha Balance</span>
                <span className="font-bold text-amber-800">
                  {typeof calculatedHoroscope?.summary?.dashaBalance === 'object'
                    ? (calculatedHoroscope.summary.dashaBalance.textTa || calculatedHoroscope.summary.dashaBalance.textEn || `${calculatedHoroscope.summary.dashaBalance.lord} (${calculatedHoroscope.summary.dashaBalance.years}y)`)
                    : (calculatedHoroscope?.summary?.dashaBalance || '—')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Parents</span>
                <span className="font-bold text-slate-900">
                  {activeBirthData?.father || '—'} / {activeBirthData?.mother || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Notes Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ta' ? 'ஆலோசனை குறிப்புகள் & பரிகாரங்கள்' : 'Consultation History & Astrologer Notes'}</span>
              {(activeBirthData?.mobile || selectedClientMobile) && (
                <span className="text-xs font-mono font-normal text-slate-500">({activeBirthData?.mobile || selectedClientMobile})</span>
              )}
            </h4>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Add Consultation Note</label>
                <textarea
                  name="notes"
                  rows={3}
                  required
                  placeholder="Record client questions, observations, life events, recommendations..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-900 block mb-1">Prescribed Remedies / Pariharam</label>
                <textarea
                  name="remediesSuggested"
                  rows={2}
                  placeholder="Recommended pujas, mantras, gemstones, temple visits..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Consultation Note</span>
              </button>
            </form>

            {/* Notes List */}
            {clientNotes.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No previous consultation notes recorded for this client.
              </div>
            ) : (
              <div className="space-y-3">
                {clientNotes.map((note, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-slate-500 text-[10px]">
                      <span>Astrologer: <strong>{note.astrologerName || 'Astrologer'}</strong></span>
                      <span>{note.date || 'Recent'}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">{note.notes}</p>
                    {note.remediesSuggested && (
                      <div className="pt-1.5 border-t border-slate-200 text-amber-900">
                        <strong>Remedies:</strong> {note.remediesSuggested}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Database Client Lookup by Mobile */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              {t('clientSearchTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-3.5">
              {t('clientSearchDesc')}
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={searchQuery}
                onChange={handleAstroSearchInputChange}
                placeholder={t('searchMobilePlaceholder')}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {t('searchBtn')}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="pt-3 space-y-3 border-t border-slate-100">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>{t('matchingClientsFound')} ({searchResults.length} {t('foundSuffix')})</span>
                  <span className="text-[11px] text-slate-500 font-normal">{t('clickClientToGen')}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.map((cl) => (
                    <div
                      key={cl.id}
                      onClick={() => handleSelectClient(cl.mobile)}
                      className="bg-slate-50/70 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 p-4 rounded-xl transition-all cursor-pointer group flex justify-between items-center"
                    >
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">
                          {cl.name}
                        </h5>
                        <div className="text-xs text-slate-600 space-y-0.5 mt-1.5">
                          <p className="flex items-center gap-1 text-amber-700 font-bold">
                            <Phone className="w-3.5 h-3.5" /> {cl.mobile}
                          </p>
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {t('born')}: {cl.dob} ({cl.dobTime})
                          </p>
                          <p className="flex items-center gap-1 truncate max-w-[200px]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {cl.dobPlace}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 group-hover:border-indigo-400 p-2 rounded-lg transition-colors">
                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Kundli Matchmaking Requests & Review Panel */}
      {activeTab === 'matchmaking' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Shared Birth Details Intake Card */}
          <BirthDetailsIntakeCard
            module="matchmaking"
            onCalculate={() => refreshCalculations()}
          />

          {/* Live Client Matchmaking (10 Poruthams & Compatibility) Analyzer */}
          {(() => {
            const isP1Manual = person1Mode === 'manual';
            const p1Gender = isP1Manual ? (manualPerson1Details.gender || 'male') : (activeBirthData?.gender || 'male');
            const isP1Male = (p1Gender || 'male').toLowerCase() !== 'female';

            return (
              <div className="bg-white border border-rose-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-rose-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-600 fill-rose-600/20" />
                      <span>{lang === 'ta' ? 'நேரலை திருமணப் பொருத்தம் (10 பொருத்தங்கள் & குணங்கள்)' : 'Live Client Matchmaking (10 Poruthams & Gunas)'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lang === 'ta'
                        ? 'கிளையண்ட் தேடல் மூலமாகவோ அல்லது இருவரது விபரங்களையும் புதிதாக உள்ளிட்டோ உடனடிப் பொருத்தம் பார்க்கலாம்.'
                        : 'Compare searched client with partner, or enter both couple details newly to calculate 10 Poruthams.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Mode selection pills */}
                    <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setPerson1Mode('client')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          !isP1Manual
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{lang === 'ta' ? 'வாடிக்கையாளர் + வரன்' : 'Searched Client + Partner'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPerson1Mode('manual');
                          setActiveClientMatchReport(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isP1Manual
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'ta' ? 'புதிய வரன்கள் (இருவரும்)' : 'Add New Match (Both Newly Added)'}</span>
                      </button>
                    </div>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={handleResetMatchmaking}
                      title={lang === 'ta' ? 'மீட்டமைக்கவும்' : 'Reset Form'}
                      className="p-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 bg-white rounded-xl transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Calculate Button */}
                    <button
                      type="button"
                      onClick={handleCalculateActiveMatch}
                      disabled={calculatingActiveMatch}
                      className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {calculatingActiveMatch ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>{lang === 'ta' ? 'பொருத்தம் கணக்கிடுக' : 'Calculate 10 Poruthams'}</span>
                    </button>
                  </div>
                </div>

                {/* Comparison Input Grid: Person 1 vs Person 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Person 1 Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          {isP1Male
                            ? (lang === 'ta' ? (!isP1Manual ? 'மணமகன் (வாடிக்கையாளர்)' : 'மணமகன் (நபர் 1)') : (!isP1Manual ? 'Groom (Active Client)' : 'Groom (Person 1)'))
                            : (lang === 'ta' ? (!isP1Manual ? 'மணமகள் (வாடிக்கையாளர்)' : 'மணமகள் (நபர் 1)') : (!isP1Manual ? 'Bride (Active Client)' : 'Bride (Person 1)'))}
                        </span>
                        {isP1Manual ? (
                          <div className="inline-flex bg-slate-200/80 p-0.5 rounded-md text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setManualPerson1Details({ ...manualPerson1Details, gender: 'male' });
                                setPartnerDetails(prev => ({ ...prev, gender: 'female' }));
                              }}
                              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                manualPerson1Details.gender !== 'female' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                              }`}
                            >
                              {lang === 'ta' ? 'ஆண்' : 'Male'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setManualPerson1Details({ ...manualPerson1Details, gender: 'female' });
                                setPartnerDetails(prev => ({ ...prev, gender: 'male' }));
                              }}
                              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                manualPerson1Details.gender === 'female' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600'
                              }`}
                            >
                              {lang === 'ta' ? 'பெண்' : 'Female'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                            {activeBirthData?.gender || 'male'}
                          </span>
                        )}
                      </div>

                      {/* Card-level toggle between Client and Manual */}
                      <button
                        type="button"
                        onClick={() => setPerson1Mode(isP1Manual ? 'client' : 'manual')}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        {!isP1Manual
                          ? (lang === 'ta' ? '✏️ கைமுறையாக உள்ளிடு' : '✏️ Enter Manually')
                          : (lang === 'ta' ? '🔍 வாடிக்கையாளரைப் பயன்படுத்து' : '🔍 Use Active Client')}
                      </button>
                    </div>

                    {!isP1Manual ? (
                      // Existing client display
                      <div className="space-y-1">
                        {activeBirthData?.name ? (
                          <>
                            <p className="font-bold text-slate-900 text-sm">{activeBirthData.name}</p>
                            <p className="text-slate-600">
                              <strong>DOB:</strong> {activeBirthData?.dob ? `${activeBirthData.dob} (${activeBirthData.dobTime12 || activeBirthData.dobTime})` : '—'}
                            </p>
                            <p className="text-slate-600">
                              <strong>Place:</strong> {activeBirthData?.placeName || activeBirthData?.city || '—'}{activeBirthData?.state ? `, ${typeof activeBirthData.state === 'object' && activeBirthData.state !== null ? activeBirthData.state.name || '' : activeBirthData.state}` : ''}
                            </p>
                            <p className="text-slate-700 font-medium pt-1 border-t border-slate-200">
                              <strong>{lang === 'ta' ? 'நட்சத்திரம் / ராசி:' : 'Nakshatra / Moon Sign:'}</strong>{' '}
                              {(() => {
                                const nak = lang === 'ta'
                                  ? (calculatedHoroscope?.summary?.nakshatraTa || (typeof calculatedHoroscope?.summary?.moonNak === 'number' && NAKSHATRAS[calculatedHoroscope.summary.moonNak]?.ta) || clientProfile?.nakshatra)
                                  : (calculatedHoroscope?.summary?.nakshatraEn || calculatedHoroscope?.summary?.nakshatra || (typeof calculatedHoroscope?.summary?.moonNak === 'number' && NAKSHATRAS[calculatedHoroscope.summary.moonNak]?.en) || clientProfile?.nakshatra);

                                const pada = calculatedHoroscope?.summary?.moonPada ? (lang === 'ta' ? ` (${calculatedHoroscope.summary.moonPada} பாதம்)` : ` (Pada ${calculatedHoroscope.summary.moonPada})`) : '';

                                const rasi = lang === 'ta'
                                  ? (calculatedHoroscope?.summary?.moonSignTa || calculatedHoroscope?.summary?.rasiTa || (typeof calculatedHoroscope?.summary?.moonRasi === 'number' && RASHIS[calculatedHoroscope.summary.moonRasi]?.ta) || clientProfile?.rasi)
                                  : (calculatedHoroscope?.summary?.moonSignEn || calculatedHoroscope?.summary?.moonSign || calculatedHoroscope?.summary?.rasiEn || (typeof calculatedHoroscope?.summary?.moonRasi === 'number' && RASHIS[calculatedHoroscope.summary.moonRasi]?.en) || clientProfile?.rasi);

                                return `${nak ? `${nak}${pada}` : '—'} / ${rasi || '—'}`;
                              })()}
                            </p>
                          </>
                        ) : (
                          <div className="py-3 text-center space-y-2">
                            <p className="text-slate-400 italic text-xs">
                              {lang === 'ta' ? 'வாடிக்கையாளர் தேர்ந்தெடுக்கப்படவில்லை. மேலே தேடவும் அல்லது கைமுறையாக உள்ளிடவும்.' : 'No active client selected. Search client above, or enter manually.'}
                            </p>
                            <button
                              type="button"
                              onClick={() => setPerson1Mode('manual')}
                              className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-3 py-1 rounded-lg hover:bg-indigo-100 cursor-pointer"
                            >
                              {lang === 'ta' ? '✏️ நபர் 1 விபரங்களை உள்ளிடுக' : '✏️ Enter Person 1 Details Manually'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Manual Input for Person 1
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                              {isP1Male ? (lang === 'ta' ? 'மணமகன் பெயர்' : 'Groom Name') : (lang === 'ta' ? 'மணமகள் பெயர்' : 'Bride Name')}
                            </label>
                            <input
                              type="text"
                              value={manualPerson1Details.name}
                              onChange={(e) => setManualPerson1Details({ ...manualPerson1Details, name: e.target.value })}
                              placeholder={lang === 'ta' ? 'பெயர் உள்ளிடவும்' : 'Enter Name'}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-400 placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                              {lang === 'ta' ? 'பிறந்த தேதி' : 'Birth Date'}
                            </label>
                            <input
                              type="date"
                              value={manualPerson1Details.dob}
                              onChange={(e) => setManualPerson1Details({ ...manualPerson1Details, dob: e.target.value })}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                              {lang === 'ta' ? 'பிறந்த நேரம் (24h)' : 'Birth Time (24h)'}
                            </label>
                            <input
                              type="text"
                              value={manualPerson1Details.dobTime}
                              onChange={(e) => setManualPerson1Details({ ...manualPerson1Details, dobTime: e.target.value })}
                              placeholder="HH:MM (e.g. 10:30)"
                              className="w-full bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-400 placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                              {lang === 'ta' ? 'பிறந்த ஊர்' : 'Birth City / Place'}
                            </label>
                            <input
                              type="text"
                              value={manualPerson1Details.dobPlace}
                              onChange={(e) => setManualPerson1Details({ ...manualPerson1Details, dobPlace: e.target.value })}
                              placeholder={lang === 'ta' ? 'பிறந்த ஊர்' : 'Enter Birth City / Place'}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-400 placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {manualPerson1Horoscope?.summary && (
                          <p className="text-indigo-900 font-medium pt-1 border-t border-indigo-200 text-xs">
                            <strong>{lang === 'ta' ? 'நட்சத்திரம் / ராசி:' : 'Nakshatra / Moon Sign:'}</strong>{' '}
                            {(() => {
                              const nak = lang === 'ta'
                                ? (manualPerson1Horoscope.summary.nakshatraTa || (typeof manualPerson1Horoscope.summary.moonNak === 'number' && NAKSHATRAS[manualPerson1Horoscope.summary.moonNak]?.ta))
                                : (manualPerson1Horoscope.summary.nakshatraEn || manualPerson1Horoscope.summary.nakshatra || (typeof manualPerson1Horoscope.summary.moonNak === 'number' && NAKSHATRAS[manualPerson1Horoscope.summary.moonNak]?.en));

                              const pada = manualPerson1Horoscope.summary.moonPada ? (lang === 'ta' ? ` (${manualPerson1Horoscope.summary.moonPada} பாதம்)` : ` (Pada ${manualPerson1Horoscope.summary.moonPada})`) : '';

                              const rasi = lang === 'ta'
                                ? (manualPerson1Horoscope.summary.moonSignTa || manualPerson1Horoscope.summary.rasiTa || (typeof manualPerson1Horoscope.summary.moonRasi === 'number' && RASHIS[manualPerson1Horoscope.summary.moonRasi]?.ta))
                                : (manualPerson1Horoscope.summary.moonSignEn || manualPerson1Horoscope.summary.moonSign || manualPerson1Horoscope.summary.rasiEn || (typeof manualPerson1Horoscope.summary.moonRasi === 'number' && RASHIS[manualPerson1Horoscope.summary.moonRasi]?.en));

                              return `${nak ? `${nak}${pada}` : '—'} / ${rasi || '—'}`;
                            })()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Partner Details (Person 2) */}
                  <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-200 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                      <span className="font-bold text-rose-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-600" />
                        {isP1Male
                          ? (lang === 'ta' ? 'மணமகள் (வரன் / நபர் 2)' : 'Bride (Partner / Person 2)')
                          : (lang === 'ta' ? 'மணமகன் (வரன் / நபர் 2)' : 'Groom (Partner / Person 2)')}
                      </span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                        {isP1Male ? 'female' : 'male'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          {isP1Male ? (lang === 'ta' ? 'மணமகள் பெயர்' : 'Bride Name') : (lang === 'ta' ? 'மணமகன் பெயர்' : 'Groom Name')}
                        </label>
                        <input
                          type="text"
                          value={partnerDetails.name}
                          onChange={(e) => setPartnerDetails({ ...partnerDetails, name: e.target.value })}
                          placeholder={lang === 'ta' ? 'வரன் பெயர்' : 'Enter Partner Name'}
                          className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-400 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          {lang === 'ta' ? 'பிறந்த தேதி' : 'Birth Date'}
                        </label>
                        <input
                          type="date"
                          value={partnerDetails.dob}
                          onChange={(e) => setPartnerDetails({ ...partnerDetails, dob: e.target.value })}
                          className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          {lang === 'ta' ? 'பிறந்த நேரம் (24h)' : 'Birth Time (24h)'}
                        </label>
                        <input
                          type="text"
                          value={partnerDetails.dobTime}
                          onChange={(e) => setPartnerDetails({ ...partnerDetails, dobTime: e.target.value })}
                          placeholder="HH:MM (e.g. 09:15)"
                          className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-400 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          {lang === 'ta' ? 'பிறந்த ஊர்' : 'Birth City / Place'}
                        </label>
                        <input
                          type="text"
                          value={partnerDetails.dobPlace}
                          onChange={(e) => setPartnerDetails({ ...partnerDetails, dobPlace: e.target.value })}
                          placeholder={lang === 'ta' ? 'பிறந்த ஊர்' : 'Enter Birth City / Place'}
                          className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-400 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {partnerHoroscope?.summary && (
                      <p className="text-rose-900 font-medium pt-1 border-t border-rose-200 text-xs">
                        <strong>{lang === 'ta' ? 'நட்சத்திரம் / ராசி:' : 'Nakshatra / Moon Sign:'}</strong>{' '}
                        {(() => {
                          const nak = lang === 'ta'
                            ? (partnerHoroscope.summary.nakshatraTa || (typeof partnerHoroscope.summary.moonNak === 'number' && NAKSHATRAS[partnerHoroscope.summary.moonNak]?.ta))
                            : (partnerHoroscope.summary.nakshatraEn || partnerHoroscope.summary.nakshatra || (typeof partnerHoroscope.summary.moonNak === 'number' && NAKSHATRAS[partnerHoroscope.summary.moonNak]?.en));

                          const pada = partnerHoroscope.summary.moonPada ? (lang === 'ta' ? ` (${partnerHoroscope.summary.moonPada} பாதம்)` : ` (Pada ${partnerHoroscope.summary.moonPada})`) : '';

                          const rasi = lang === 'ta'
                            ? (partnerHoroscope.summary.moonSignTa || partnerHoroscope.summary.rasiTa || (typeof partnerHoroscope.summary.moonRasi === 'number' && RASHIS[partnerHoroscope.summary.moonRasi]?.ta))
                            : (partnerHoroscope.summary.moonSignEn || partnerHoroscope.summary.moonSign || partnerHoroscope.summary.rasiEn || (typeof partnerHoroscope.summary.moonRasi === 'number' && RASHIS[partnerHoroscope.summary.moonRasi]?.en));

                          return `${nak ? `${nak}${pada}` : '—'} / ${rasi || '—'}`;
                        })()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Calculated Match Results View */}
                {activeClientMatchReport && (
                  <div className="pt-3 border-t border-rose-200 space-y-3">
                    <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveMatchTab('tamil')}
                        className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeMatchTab === 'tamil'
                            ? 'border-amber-600 text-amber-900 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMatchTab('ashtakoota')}
                        className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeMatchTab === 'ashtakoota'
                            ? 'border-indigo-600 text-indigo-900 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{MATCH_I18N.tabAshtakoota[lang] || MATCH_I18N.tabAshtakoota.en}</span>
                      </button>
                    </div>

                    {activeMatchTab === 'tamil' ? (
                      <TamilPoruthamCard matchReport={activeClientMatchReport} />
                    ) : (
                      <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                          <div>
                            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                              Engine Computed Compatibility
                            </span>
                            <span className="font-bold text-slate-800">
                              {activeClientMatchReport.compatibility} ({activeClientMatchReport.percentage}%)
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-amber-700">
                              {activeClientMatchReport.totalScore} / 36
                            </span>
                            <span className="text-[10px] text-slate-500 block">Total Gunas</span>
                          </div>
                        </div>

                        {/* Compact 8 Kootas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          {activeClientMatchReport.kootas?.map((k, i) => (
                            <div key={i} className="bg-white p-1.5 rounded-lg border border-amber-100 flex justify-between">
                              <span className="font-semibold text-slate-700">{k.koota}</span>
                              <span className="font-bold text-amber-800">{k.obtained}/{k.max}</span>
                            </div>
                          ))}
                        </div>

                        {/* Manglik status */}
                        <div className="text-[11px] text-slate-700 pt-1 border-t border-amber-200 flex flex-col sm:flex-row justify-between gap-1">
                          <span><strong>{t('groomBoyLabel') || 'Groom'}:</strong> {activeClientMatchReport.manglik?.boy?.details}</span>
                          <span><strong>{t('brideGirlLabel') || 'Bride'}:</strong> {activeClientMatchReport.manglik?.girl?.details}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Header Strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600 fill-rose-600/20" />
                {t('matrimonialRequestsTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('matrimonialRequestsDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                {pendingMatchCount} {t('pendingReviewBadge')}
              </span>
              <button
                onClick={loadMatchRequests}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                title={t('refreshBtn')}
              >
                {t('refreshBtn')}
              </button>
            </div>
          </div>

          {/* Success message banner */}
          {reviewSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{reviewSuccessMsg}</span>
              </div>
              <button onClick={() => setReviewSuccessMsg('')} className="text-slate-400 hover:text-slate-600 font-bold ml-2">
                ✕
              </button>
            </div>
          )}

          {/* Requests List */}
          {loadingMatchReqs ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
              <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading incoming matchmaking requests...</p>
            </div>
          ) : matchRequests.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs space-y-2">
              <Heart className="w-8 h-8 text-rose-300 mx-auto" />
              <p className="font-semibold text-slate-700">{t('noMatchRequestsYet')}</p>
              <p className="text-[11px] text-slate-400">
                {t('noMatchRequestsSubtext')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {req.boy?.name} & {req.girl?.name}
                        </span>
                        {req.status === 'completed' ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('completedAndSentBadge')}
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 animate-spin" /> {t('pendingYourReviewBadge')}
                          </span>
                        )}
                        {req.source === 'self_check_review' && (
                          <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-purple-200">
                            {t('subscriberRequestBadge')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Client: <strong className="text-slate-800">{req.clientName}</strong> ({req.clientMobile}) • {t('clientSubmittedOn')} {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenReview(req)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                        req.status === 'pending'
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{req.status === 'pending' ? t('reviewAndSendBtn') : t('viewEditReviewBtn')}</span>
                    </button>
                  </div>

                  {/* Coordinates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="font-bold text-indigo-900 block mb-0.5">{t('groomBoyLabel')}</span>
                      <p className="text-slate-700">
                        <strong>{req.boy?.name}</strong> • {t('born')}: {req.boy?.dob} ({req.boy?.dobTime}) • {req.boy?.dobPlace}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-rose-900 block mb-0.5">{t('brideGirlLabel')}</span>
                      <p className="text-slate-700">
                        <strong>{req.girl?.name}</strong> • {t('born')}: {req.girl?.dob} ({req.girl?.dobTime}) • {req.girl?.dobPlace}
                      </p>
                    </div>
                  </div>

                  {/* Client Query Note */}
                  {req.clientQuery && (
                    <div className="text-xs bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 text-slate-700">
                      <span className="font-bold text-amber-900 block mb-0.5">{t('clientNoteQueryLabel')}</span>
                      "{req.clientQuery}"
                    </div>
                  )}

                  {/* Existing Review snippet if already completed */}
                  {req.status === 'completed' && req.astrologerReview && (
                    <div className="text-xs bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 text-slate-800 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-950">{t('verdictDeliveredLabel')}</span>
                        <span className="font-black text-emerald-800">{req.astrologerReview.verdict}</span>
                      </div>
                      <p className="text-slate-600 truncate">{req.astrologerReview.suggestions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Interactive Astrologer Review Drawer / Modal */}
          {selectedMatchReq && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-amber-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-indigo-700 uppercase font-bold tracking-wider">
                      {t('reviewPanelTitle')}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      {selectedMatchReq.boy?.name} & {selectedMatchReq.girl?.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Client: {selectedMatchReq.clientName} ({selectedMatchReq.clientMobile})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMatchReq(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Precomputed / Live Vedic Engine Match Analysis (Dual View: Tamil 10 Poruthams & Ashtakoota) */}
                {selectedMatchReq.matchReport ? (
                  <div className="space-y-3">
                    <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
                      <button
                        type="button"
                        onClick={() => setModalMatchTab('tamil')}
                        className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          modalMatchTab === 'tamil'
                            ? 'border-amber-600 text-amber-900 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalMatchTab('ashtakoota')}
                        className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          modalMatchTab === 'ashtakoota'
                            ? 'border-indigo-600 text-indigo-900 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{MATCH_I18N.tabAshtakoota[lang] || MATCH_I18N.tabAshtakoota.en}</span>
                      </button>
                    </div>

                    {modalMatchTab === 'tamil' ? (
                      <TamilPoruthamCard matchReport={selectedMatchReq.matchReport} />
                    ) : (
                      <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                          <div>
                            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                              Engine Computed Compatibility
                            </span>
                            <span className="font-bold text-slate-800">
                              {selectedMatchReq.matchReport.compatibility} ({selectedMatchReq.matchReport.percentage}%)
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-amber-700">
                              {selectedMatchReq.matchReport.totalScore} / 36
                            </span>
                            <span className="text-[10px] text-slate-500 block">Total Gunas</span>
                          </div>
                        </div>

                        {/* Compact 8 Kootas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          {selectedMatchReq.matchReport.kootas?.map((k, i) => (
                            <div key={i} className="bg-white p-1.5 rounded-lg border border-amber-100 flex justify-between">
                              <span className="font-semibold text-slate-700">{k.koota}</span>
                              <span className="font-bold text-amber-800">{k.obtained}/{k.max}</span>
                            </div>
                          ))}
                        </div>

                        {/* Manglik status */}
                        <div className="text-[11px] text-slate-700 pt-1 border-t border-amber-200 flex flex-col sm:flex-row justify-between gap-1">
                          <span><strong>{t('groomBoyLabel')}</strong> {selectedMatchReq.matchReport.manglik?.boy?.details}</span>
                          <span><strong>{t('brideGirlLabel')}</strong> {selectedMatchReq.matchReport.manglik?.girl?.details}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">Calculating matching matrix...</div>
                )}

                {/* Review Form */}
                <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">
                      {t('astrologerVerdictOfficial')}
                    </label>
                    <select
                      value={reviewForm.verdict}
                      onChange={(e) => setReviewForm({ ...reviewForm, verdict: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Highly Recommended (Shubha Vivaha)">{t('verdictHighlyRecommended')}</option>
                      <option value="Recommended with Vedic Remedies">{t('verdictRecommendedWithRemedies')}</option>
                      <option value="Neutral / Proceed with Caution">{t('verdictNeutral')}</option>
                      <option value="Not Recommended (Inauspicious Dosha)">{t('verdictNotRecommended')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1">
                      {t('expertSuggestionsHeading')}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewForm.suggestions}
                      onChange={(e) => setReviewForm({ ...reviewForm, suggestions: e.target.value })}
                      placeholder={t('expertSuggestionsPlaceholder')}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1">
                      {t('prescribedRemediesReviewHeading')}
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={reviewForm.remedies}
                      onChange={(e) => setReviewForm({ ...reviewForm, remedies: e.target.value })}
                      placeholder={t('prescribedRemediesReviewPlaceholder')}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedMatchReq(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      {t('cancelBtn')}
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {submittingReview ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>{t('sendOfficialReviewBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


        </div>
      )}

      {/* TAB 3: Referred Clients List */}
      {activeTab === 'referred' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>👥</span> {t('referredNetworkTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('registeredUsingCode')} <strong>{user?.referralCode}</strong>
              </p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              {referredData.clients.length} {t('totalClientsBadge')}
            </span>
          </div>

          {referredData.clients.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              {t('noReferredClientsYet')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2 px-2.5">{t('thClientName')}</th>
                    <th className="py-2 px-2.5">{t('thMobile')}</th>
                    <th className="py-2 px-2.5">{t('thDobTime')}</th>
                    <th className="py-2 px-2.5">{t('thBirthPlace')}</th>
                    <th className="py-2 px-2.5 text-right">{t('thAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referredData.clients.map((cl) => (
                    <tr key={cl.id} className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-2.5 font-bold text-slate-900">{cl.name}</td>
                      <td className="py-2.5 px-2.5 font-mono text-amber-800 font-bold">{cl.mobile}</td>
                      <td className="py-2.5 px-2.5 text-slate-700">{cl.dob} ({cl.dobTime})</td>
                      <td className="py-2.5 px-2.5 text-slate-700">{cl.dobPlace}</td>
                      <td className="py-2.5 px-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewClientReceipt(cl.id)}
                            className="bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                            title="Print / Share Official Registration Receipt"
                          >
                            <span>🧾</span>
                            <span>Receipt</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('search');
                              handleSelectClient(cl.mobile);
                            }}
                            className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            {lang === 'ta' ? 'விவரங்களைப் பார்க்க' : 'View Details'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Astrologer Profile & 1-Pager Letterhead Branding Settings */}
      {activeTab === 'profile' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>{lang === 'ta' ? 'ஜோதிடர் சுயவிவரம் & 1-பேஜர் லெட்டர்ஹெட் அமைப்புகள்' : 'Astrologer Profile & 1-Pager Letterhead Branding'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ta'
                  ? 'இங்கு பதிவு செய்யும் ஜோதிட நிலையம், முகவரி & தொடர்பு விவரங்கள் அனைத்து 1-பேஜர் ஜாதகங்களிலும் தானாகவே புதுப்பிக்கப்படும்.'
                  : 'Organization title, branches & contact details entered here will automatically update on every 1-pager horoscope.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('horoscope_pagers')}
                className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? '1-பேஜர் ஜாதகம் பார்க்க' : 'Open 1-Pager View'}</span>
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* LEFT COLUMN: 1-Pager Letterhead Details */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ta' ? '1-பேஜர் ஜாதக தலைப்பு & முகவரி (Letterhead)' : '1-Pager Letterhead Branding Details'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ta' ? 'A4 தாளில் அச்சிடப்படும் மேல் பகுதி கட்டத்தின் விவரங்கள்' : 'Header details printed on the top box of 1-page A4 sheets'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {lang === 'ta' ? '1-பேஜர் இணைப்பு' : '1-Pager Synced'}
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'ஜோதிட நிலையம் / நிறுவனம் (Line 1 - Large Title)' : 'Organization / Center Name (Line 1 Large)'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.pagerHeader.line1}
                    onChange={(e) => setProfileForm(prev => ({
                      ...prev,
                      pagerHeader: { ...prev.pagerHeader, line1: e.target.value }
                    }))}
                    placeholder="Organization / Center Name (Optional)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'துணைத் தலைப்பு / மையம் (Line 2 - Subtitle)' : 'Center Name / Subtitle (Line 2)'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.pagerHeader.line2}
                    onChange={(e) => setProfileForm(prev => ({
                      ...prev,
                      pagerHeader: { ...prev.pagerHeader, line2: e.target.value }
                    }))}
                    placeholder="Center Name / Subtitle (Optional)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'ta' ? 'முதன்மை முகவரி & அஞ்சல் குறியீடு (Address Line 1)' : 'Primary Address & City (Address Line 1)'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.pagerHeader.address1}
                      onChange={(e) => setProfileForm(prev => ({
                        ...prev,
                        pagerHeader: { ...prev.pagerHeader, address1: e.target.value }
                      }))}
                      placeholder="Salem, தமிழ்நாடு - 636001"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'ta' ? 'கிளைகள் / கூடுதல் முகவரி (Address Line 2)' : 'Branches / Secondary Address (Address Line 2)'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.pagerHeader.address2}
                      onChange={(e) => setProfileForm(prev => ({
                        ...prev,
                        pagerHeader: { ...prev.pagerHeader, address2: e.target.value }
                      }))}
                      placeholder="Branches / Secondary Address (Optional)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'தொடர்பு விவரங்கள் (தொலைபேசி & மின்னஞ்சல்)' : 'Contact Details (Phone & Email Line)'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.pagerHeader.phoneEmail}
                    onChange={(e) => setProfileForm(prev => ({
                      ...prev,
                      pagerHeader: { ...prev.pagerHeader, phoneEmail: e.target.value }
                    }))}
                    placeholder="Phone & Email Line (Optional)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>

                {/* REAL-TIME LIVE 1-PAGER HEADER PREVIEW BOX */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 flex items-center gap-1.5">
                    <span>👁️</span>
                    <span>{lang === 'ta' ? '1-பேஜர் தாளில் தோன்றும் நேரடி முன்தோற்றம் (Live Header Preview):' : 'Live Preview as Printed on 1-Pager Sheet:'}</span>
                  </span>
                  <div className="border border-black p-3 text-center rounded-xs bg-white text-black space-y-0.5 shadow-2xs font-serif min-h-[50px] flex flex-col justify-center">
                    {profileForm.pagerHeader.line1 && (
                      <div className="text-base sm:text-lg font-black tracking-tight">
                        {profileForm.pagerHeader.line1}
                      </div>
                    )}
                    {profileForm.pagerHeader.line2 && (
                      <div className="text-xs font-bold">
                        {profileForm.pagerHeader.line2}
                      </div>
                    )}
                    {(profileForm.pagerHeader.address1 || profileForm.pagerHeader.address2) && (
                      <div className="text-[10.5px] text-stone-700 leading-tight">
                        {profileForm.pagerHeader.address1}{profileForm.pagerHeader.address1 && profileForm.pagerHeader.address2 ? ' • ' : ''}{profileForm.pagerHeader.address2}
                      </div>
                    )}
                    {profileForm.pagerHeader.phoneEmail && (
                      <div className="text-[9.5px] font-mono font-semibold text-stone-800">
                        {profileForm.pagerHeader.phoneEmail}
                      </div>
                    )}
                    {!profileForm.pagerHeader.line1 && !profileForm.pagerHeader.line2 && !profileForm.pagerHeader.address1 && !profileForm.pagerHeader.address2 && !profileForm.pagerHeader.phoneEmail && (
                      <div className="text-xs text-stone-400 italic py-2">
                        {lang === 'ta' ? '(விவரங்கள் எதுவும் உள்ளிடப்படவில்லை - வெற்றுத் தாள்)' : '(No letterhead details entered - will be blank)'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Personal & Professional Profile */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'ta' ? 'ஜோதிடர் சுயவிவரம் & அலுவலகம்' : 'Astrologer Professional Details'}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ta' ? 'உங்கள் கணக்கு & வாடிக்கையாளர் ஆலோசனை விவரங்கள்' : 'Your personal profile and consultation details'}
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'ஜோதிடர் / நிறுவனப் பெயர்' : 'Astrologer / Firm Name'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'ta' ? 'கைபேசி எண் (Mobile)' : 'Mobile (User ID)'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profileForm.mobile}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'ta' ? 'மின்னஞ்சல் (Email)' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'ta' ? 'அனுபவம் (Experience)' : 'Experience'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="22 Years"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'ta' ? 'பேசும் மொழிகள் (Languages)' : 'Languages Spoken'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.languages}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, languages: e.target.value }))}
                      placeholder="Tamil, English, Hindi"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'அலுவலக முகவரி (Office Address)' : 'Office / Chamber Address'}
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.address}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'சுயவிவரக் குறிப்பு (Bio)' : 'Professional Bio'}
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* FULL WIDTH ACTION FOOTER */}
            <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {profileSuccessMsg && (
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{profileSuccessMsg}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {savingProfile
                      ? (lang === 'ta' ? 'சேமிக்கிறது...' : 'Saving...')
                      : (lang === 'ta' ? 'சுயவிவரம் & 1-பேஜர் சேமிக்க' : 'Save Profile & 1-Pager Header')}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Official Client Registration Acknowledgement Receipt Modal */}
      {selectedReceiptForModal && (
        <ClientRegistrationReceiptModal
          receipt={selectedReceiptForModal}
          onClose={() => setSelectedReceiptForModal(null)}
        />
      )}
    </div>
  );
}
