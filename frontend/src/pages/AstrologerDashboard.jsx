import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  FileText,
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
  Flame,
  Zap,
  Baby,
  Moon,
  HeartHandshake,
  GitCompare,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';
import ClientRegistrationReceiptModal from '../components/ClientRegistrationReceiptModal';
import TamilPoruthamCard from '../components/TamilPoruthamCard';
import GujaDashaChart from '../components/GujaDashaChart';
import RahuKetuChart from '../components/RahuKetuChart';
import PuthrasthanamChart from '../components/PuthrasthanamChart';
import PakshaMatchCard from '../components/PakshaMatchCard';
import MarsVenusMatchCard from '../components/MarsVenusMatchCard';
import ShashtashtagamMatchCard from '../components/ShashtashtagamMatchCard';
import ChandranMatchCard from '../components/ChandranMatchCard';
import GuruMatchCard from '../components/GuruMatchCard';
import DasaSandhiMatchCard from '../components/DasaSandhiMatchCard';
import MatchingNakshatrasCard from '../components/MatchingNakshatrasCard';
import HoroscopeHub from '../components/HoroscopeHub';
import ThirukanithaHoroscopeView from '../components/ThirukanithaHoroscopeView';
import HoroscopePagerView from '../components/HoroscopePagerView';
import { MATCH_I18N } from '../matchmakingI18n';
import { useClientBirth, to24HourTime } from '../context/ClientBirthContext';
import BirthDetailsIntakeCard from '../components/BirthDetailsIntakeCard';
import { calculateThirukanithaHoroscope, NAKSHATRAS, RASHIS } from '../utils/thirukanithaEngine';
import { clean10DigitMobile } from '../utils/phoneUtils';
import { GEO_DATA, lookupCoordinates } from '../data/geoCoordinates';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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

  // Live Matchmaking with Partner State (Support both existing client lookup & adding new couple manually)
  const [person1Mode, setPerson1Mode] = useState('client'); // 'client' | 'manual'
  const [manualPerson1Details, setManualPerson1Details] = useState({
    name: '',
    gender: 'female',
    dob: '',
    dobTime: '',
    dobPlace: '',
    lat: 11.6643,
    lon: 78.1460
  });

  // Automatically use searched/selected active client in Matchmaking when loaded
  useEffect(() => {
    if (activeBirthData?.name && activeBirthData?.dob) {
      setPerson1Mode('client');
    }
  }, [activeBirthData?.name, activeBirthData?.dob, activeBirthData?.gender]);

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
    gender: 'male',
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

  // 12-Hour Time States for Matchmaking (same as in Horoscope)
  const [p1TimeState, setP1TimeState] = useState({ hour: '10', minute: '30', second: '00', period: 'AM' });
  const [p2TimeState, setP2TimeState] = useState({ hour: '09', minute: '15', second: '00', period: 'AM' });

  // Place Autocomplete States for Matchmaking (same as in Horoscope)
  const [p1CityInput, setP1CityInput] = useState('');
  const [showP1CityDropdown, setShowP1CityDropdown] = useState(false);
  const p1CityBoxRef = useRef(null);

  const [p2CityInput, setP2CityInput] = useState('');
  const [showP2CityDropdown, setShowP2CityDropdown] = useState(false);
  const p2CityBoxRef = useRef(null);

  const updateP1TimePart = (field, val) => {
    const next = { ...p1TimeState, [field]: val };
    setP1TimeState(next);
    const t24 = to24HourTime(next.hour, next.minute, next.second, next.period);
    setManualPerson1Details(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  const toggleP1Period = () => {
    const nextPeriod = p1TimeState.period === 'AM' ? 'PM' : 'AM';
    const next = { ...p1TimeState, period: nextPeriod };
    setP1TimeState(next);
    const t24 = to24HourTime(next.hour, next.minute, next.second, next.period);
    setManualPerson1Details(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  const updateP2TimePart = (field, val) => {
    const next = { ...p2TimeState, [field]: val };
    setP2TimeState(next);
    const t24 = to24HourTime(next.hour, next.minute, next.second, next.period);
    setPartnerDetails(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  const toggleP2Period = () => {
    const nextPeriod = p2TimeState.period === 'AM' ? 'PM' : 'AM';
    const next = { ...p2TimeState, period: nextPeriod };
    setP2TimeState(next);
    const t24 = to24HourTime(next.hour, next.minute, next.second, next.period);
    setPartnerDetails(prev => ({
      ...prev,
      dobTime: t24,
      dobTime12: `${next.hour}:${next.minute}:${next.second} ${next.period}`
    }));
  };

  // Close city autocomplete dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (p1CityBoxRef.current && !p1CityBoxRef.current.contains(e.target)) {
        setShowP1CityDropdown(false);
      }
      if (p2CityBoxRef.current && !p2CityBoxRef.current.contains(e.target)) {
        setShowP2CityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered cities for Person 1 (strictly Tamil Nadu by default, matching state)
  const p1CitySuggestions = React.useMemo(() => {
    const q = (p1CityInput || '').trim().toLowerCase();
    const tnCities = GEO_DATA['India']?.['Tamil Nadu'] || [];
    if (!q) return tnCities.slice(0, 15);
    const starts = tnCities.filter(c => (c.name || '').toLowerCase().startsWith(q));
    const contains = tnCities.filter(c => !(c.name || '').toLowerCase().startsWith(q) && (c.name || '').toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, 30);
  }, [p1CityInput]);

  // Filtered cities for Partner (strictly Tamil Nadu by default, matching state)
  const p2CitySuggestions = React.useMemo(() => {
    const q = (p2CityInput || '').trim().toLowerCase();
    const tnCities = GEO_DATA['India']?.['Tamil Nadu'] || [];
    if (!q) return tnCities.slice(0, 15);
    const starts = tnCities.filter(c => (c.name || '').toLowerCase().startsWith(q));
    const contains = tnCities.filter(c => !(c.name || '').toLowerCase().startsWith(q) && (c.name || '').toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, 30);
  }, [p2CityInput]);
  const [activeClientMatchReport, setActiveClientMatchReport] = useState(null);
  const [calculatingActiveMatch, setCalculatingActiveMatch] = useState(false);
  const [standaloneStarMatch, setStandaloneStarMatch] = useState(null);
  const [findingStarsLoading, setFindingStarsLoading] = useState(false);
  const [activeMatchTab, setActiveMatchTab] = useState('tamil');
  const ALL_MATCH_SECTIONS_OPEN = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true };
  const [openMatchSections, setOpenMatchSections] = useState(ALL_MATCH_SECTIONS_OPEN);

  const toggleMatchSection = (num) => {
    setOpenMatchSections(prev => ({ ...prev, [num]: !prev[num] }));
  };
  const expandAllMatchSections = () => setOpenMatchSections(ALL_MATCH_SECTIONS_OPEN);
  const collapseAllMatchSections = () => setOpenMatchSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false });
  const jumpToMatchSection = (num) => {
    setOpenMatchSections(prev => ({ ...prev, [num]: true }));
    setTimeout(() => {
      const el = document.getElementById(`match-section-${num}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleResetMatchmaking = () => {
    setPartnerDetails({
      name: '',
      gender: 'male',
      dob: '',
      dobTime: '',
      dobPlace: '',
      lat: 13.0827,
      lon: 80.2707
    });
    setManualPerson1Details({
      name: '',
      gender: 'female',
      dob: '',
      dobTime: '',
      dobPlace: '',
      lat: 11.6643,
      lon: 78.1460
    });
    setP1CityInput('');
    setP2CityInput('');
    setP1TimeState({ hour: '10', minute: '30', second: '00', period: 'AM' });
    setP2TimeState({ hour: '09', minute: '15', second: '00', period: 'AM' });
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
      phoneEmail: user?.pagerHeader?.phoneEmail || user?.phoneEmail || '',
      astrologerLogo: user?.pagerHeader?.astrologerLogo || ''
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
          phoneEmail: user.pagerHeader?.phoneEmail || user.phoneEmail || 'தொலைபேசி: +91 98765 43210 | மின்னஞ்சல்: astro@astrojit.com',
          astrologerLogo: user.pagerHeader?.astrologerLogo || ''
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
      try {
        const existing = JSON.parse(localStorage.getItem('astrojit_letterhead_v1') || '{}');
        localStorage.setItem('astrojit_letterhead_v1', JSON.stringify({
          ...existing,
          ...profileForm.pagerHeader
        }));
      } catch {
        // ignore storage errors
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
  const [loadingReferred, setLoadingReferred] = useState(false);

  // Instantly load/refresh referred clients list
  const loadReferredClients = useCallback(async () => {
    try {
      setLoadingReferred(true);
      const data = await API.getReferredClients();
      if (data) {
        setReferredData(data);
      }
    } catch (err) {
      console.error('Error loading astrologer referred data:', err);
    } finally {
      setLoadingReferred(false);
    }
  }, []);

  // Edit Client Modal State for Referred Page
  const [editingClient, setEditingClient] = useState(null);
  const [editClientForm, setEditClientForm] = useState({
    name: '',
    mobile: '',
    password: '',
    fatherName: '',
    motherName: '',
    nativePlace: '',
    gender: 'male',
    dob: '',
    dobTime: '',
    dobPlace: '',
  });
  const [savingEditClient, setSavingEditClient] = useState(false);
  const [editClientSuccessMsg, setEditClientSuccessMsg] = useState('');

  const [isOnline, setIsOnline] = useState(true);
  const [ratePerMinute, setRatePerMinute] = useState(25);
  const [availableSlots, setAvailableSlots] = useState(['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM']);
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState(null);
  const [deletingClientId, setDeletingClientId] = useState(null);

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
        await loadReferredClients();
        await loadMatchRequests();
        await loadAppointments();
      } catch (err) {
        console.error('Error loading astrologer initial data:', err);
      }
    }
    loadInitial();
  }, [loadReferredClients]);

  // Real-time listener: Whenever any client is registered or saved across Horoscope/Search/Matchmaking, update immediately!
  useEffect(() => {
    const handleClientRefresh = () => {
      loadReferredClients();
    };
    window.addEventListener('astrojit:client-registered', handleClientRefresh);
    window.addEventListener('astrojit:refresh-referred-clients', handleClientRefresh);
    return () => {
      window.removeEventListener('astrojit:client-registered', handleClientRefresh);
      window.removeEventListener('astrojit:refresh-referred-clients', handleClientRefresh);
    };
  }, [loadReferredClients]);

  // When switching to the Referred Clients tab, always refresh data
  useEffect(() => {
    if (activeTab === 'referred') {
      loadReferredClients();
    }
  }, [activeTab, loadReferredClients]);

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
    const isP1Manual = person1Mode === 'manual' || !(activeBirthData?.name && activeBirthData?.dob);

    if (isP1Manual) {
      if (!manualPerson1Details.name?.trim() || !manualPerson1Details.dob?.trim()) {
        alert(
          lang === 'ta'
            ? 'தயவுசெய்து பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.'
            : 'Please enter Name and Birth Date.'
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
      const p1Gender = isP1Manual ? (manualPerson1Details.gender || 'female') : (activeBirthData?.gender || 'female');
      const isP1Male = (p1Gender || 'female').toLowerCase() === 'male';

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
      expandAllMatchSections();
    } catch (err) {
      alert((lang === 'ta' ? 'பொருத்தம் கணக்கிட முடியவில்லை: ' : 'Failed to calculate matchmaking: ') + err.message);
    } finally {
      setCalculatingActiveMatch(false);
    }
  };

  const handleFindMatchingStarsForPerson1 = async () => {
    const isP1Manual = person1Mode === 'manual' || !(activeBirthData?.name && activeBirthData?.dob);
    if (isP1Manual && (!manualPerson1Details.name?.trim() || !manualPerson1Details.dob?.trim())) {
      alert(lang === 'ta' ? 'பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.' : 'Please enter Person 1 Name and Birth Date.');
      return;
    }
    if (!isP1Manual && (!activeBirthData?.name || !activeBirthData?.dob)) {
      alert(lang === 'ta' ? 'வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும் அல்லது கைமுறையாக உள்ளிடவும்.' : 'Please select a client or switch to Enter Manually.');
      return;
    }
    setFindingStarsLoading(true);
    try {
      const activeP1Horoscope = isP1Manual ? manualPerson1Horoscope : calculatedHoroscope;
      const p1Gender = isP1Manual ? (manualPerson1Details.gender || 'female') : (activeBirthData?.gender || 'female');
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
      const p1DataObj = isP1Manual
        ? {
            name: manualPerson1Details.name.trim(),
            dob: manualPerson1Details.dob,
            dobTime: manualPerson1Details.dobTime || '12:00',
            lat: manualPerson1Details.lat || 11.6643,
            lon: manualPerson1Details.lon || 78.1460,
            starNakshatra: p1Nak,
            moonSign: p1Rasi,
            pada: p1Pada
          }
        : {
            name: activeBirthData.name || 'Client',
            dob: activeBirthData.dob,
            dobTime: activeBirthData.dobTime || '10:30',
            lat: activeBirthData.lat || 11.6643,
            lon: activeBirthData.lon || 78.1460,
            starNakshatra: p1Nak,
            moonSign: p1Rasi,
            pada: p1Pada
          };
      const res = await API.findMatchingNakshatras(p1DataObj, p1Gender);
      setStandaloneStarMatch(res);
    } catch (err) {
      alert((lang === 'ta' ? 'நட்சத்திரப் பட்டியல் பெற முடியவில்லை: ' : 'Failed to find matching stars: ') + err.message);
    } finally {
      setFindingStarsLoading(false);
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

  const handleDeleteReferredClient = async (cl) => {
    const label = `${cl.name || 'Client'}${cl.clientCode ? ` (${cl.clientCode})` : ''}`;
    const confirmMsg = lang === 'ta'
      ? `வாடிக்கையாளர் ${label}-ஐ நிரந்தரமாக நீக்க விரும்புகிறீர்களா?`
      : `Delete referred client ${label}? This cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    const targetKey = cl.id || cl.clientCode || cl.mobile;
    setDeletingClientId(targetKey);
    try {
      await API.deleteClientByAstrologer(targetKey);
      setReferredData((prev) => {
        const nextClients = (prev.clients || []).filter(
          (item) => (item.id || item.clientCode || item.mobile) !== targetKey
        );
        return {
          ...prev,
          clients: nextClients,
          totalReferred: nextClients.length
        };
      });
      await loadReferredClients();
      window.dispatchEvent(new CustomEvent('astrojit:refresh-referred-clients'));
    } catch (err) {
      alert((lang === 'ta' ? 'வாடிக்கையாளரை நீக்க முடியவில்லை: ' : 'Failed to delete client: ') + err.message);
    } finally {
      setDeletingClientId(null);
    }
  };

  const handleOpenEditClientModal = (cl) => {
    setEditingClient(cl);
    setEditClientForm({
      name: cl.name || '',
      mobile: cl.mobile || '',
      password: cl.plainInitialPassword || 'Client@123',
      fatherName: cl.fatherName || cl.father || '',
      motherName: cl.motherName || cl.mother || '',
      nativePlace: cl.nativePlace || '',
      gender: cl.gender || 'male',
      dob: cl.dob || '',
      dobTime: cl.dobTime || '',
      dobPlace: cl.dobPlace || cl.city || '',
    });
    setEditClientSuccessMsg('');
  };

  const handleSaveEditClient = async (triggerWhatsApp = false) => {
    if (!editClientForm.name.trim()) {
      alert(lang === 'ta' ? 'தயவுசெய்து வாடிக்கையாளர் பெயரை உள்ளிடவும்.' : 'Please enter Client Name.');
      return;
    }
    const cleanMobile = clean10DigitMobile(editClientForm.mobile);
    if (triggerWhatsApp && (!cleanMobile || cleanMobile.length !== 10)) {
      alert(lang === 'ta' ? 'வாட்ஸ்அப் அனுப்ப சரியான 10-இலக்க மொபைல் எண் தேவை.' : 'Valid 10-digit mobile number required to send WhatsApp credentials.');
      return;
    }

    setSavingEditClient(true);
    try {
      const res = await API.updateClientByAstrologer(editingClient.id || editingClient.clientCode, {
        ...editClientForm,
        mobile: cleanMobile || '',
      });

      setEditClientSuccessMsg(lang === 'ta' ? 'விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Client particulars updated successfully!');

      // If WhatsApp requested
      if (triggerWhatsApp && cleanMobile) {
        const cleanPhone = cleanMobile.replace(/[^0-9]/g, '');
        const phoneParam = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
        const loginUrl = `${window.location.origin}/login`;
        const waText = `🕉️ *ASTROJIT VEDIC ASTROLOGY - CLIENT LOGIN CREDENTIALS*

வணக்கம் / Greetings *${editClientForm.name}*,
உங்கள் வேத ஜாதக போர்ட்டல் கணக்கு விவரங்கள்:
Your Astrojit Client Portal login credentials:

----------------------------------------
🔐 *YOUR LOGIN DETAILS*
*Portal URL:* ${loginUrl}
*Client ID:* ${editingClient.clientCode || 'CLI-Client'}
*Username (Mobile):* ${cleanMobile}
*Password:* ${editClientForm.password}

----------------------------------------
👤 *NATIVE DETAILS*
*DOB:* ${editClientForm.dob} | ${editClientForm.dobTime}
*Place:* ${editClientForm.dobPlace}

*Astrologer:* ${user?.name || 'Astrojit Astrologer'}
*Contact:* ${user?.mobile || ''}

_You can log in anytime to view your complete Vedic Horoscope, Predictions, Daily Panchangam, and Matchmaking services._
Shubham Bhavatu! 🙏`;

        const waUrl = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
      }

      // Reload referred clients
      await loadReferredClients();

      setTimeout(() => {
        setEditingClient(null);
      }, 1500);
    } catch (err) {
      alert((lang === 'ta' ? 'புதுப்பிக்க முடியவில்லை: ' : 'Failed to update client: ') + err.message);
    } finally {
      setSavingEditClient(false);
    }
  };

  const handleSendWhatsAppQuick = (cl) => {
    const cleanMobile = clean10DigitMobile(cl.mobile);
    if (!cleanMobile || cleanMobile.length !== 10) {
      alert(lang === 'ta' ? 'இந்த வாடிக்கையாளருக்கு மொபைல் எண் இல்லை. "Edit" சொடுக்கி மொபைல் எண்ணை சேர்க்கவும்.' : 'This client has no mobile number. Click "Edit" to add mobile number first.');
      return;
    }
    const cleanPhone = cleanMobile.replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const loginUrl = `${window.location.origin}/login`;
    const pwd = cl.plainInitialPassword || 'Client@123';
    const waText = `🕉️ *ASTROJIT VEDIC ASTROLOGY - CLIENT LOGIN CREDENTIALS*

வணக்கம் / Greetings *${cl.name}*,
உங்கள் வேத ஜாதக போர்ட்டல் கணக்கு விவரங்கள்:
Your Astrojit Client Portal login credentials:

----------------------------------------
🔐 *YOUR LOGIN DETAILS*
*Portal URL:* ${loginUrl}
*Client ID:* ${cl.clientCode || 'CLI-Client'}
*Username (Mobile):* ${cleanMobile}
*Password:* ${pwd}

----------------------------------------
👤 *NATIVE DETAILS*
*DOB:* ${cl.dob} | ${cl.dobTime}
*Place:* ${cl.dobPlace || cl.nativePlace || cl.city}

*Astrologer:* ${user?.name || 'Astrojit Astrologer'}
*Contact:* ${user?.mobile || ''}

_You can log in anytime to view your complete Vedic Horoscope, Predictions, Daily Panchangam, and Matchmaking services._
Shubham Bhavatu! 🙏`;

    const waUrl = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
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
          onClientSaved={loadReferredClients}
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
            onClientSaved={loadReferredClients}
          />

          {/* Active Client Details & Kundli Snapshot */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'ta' ? 'வாடிக்கையாளர் ஜாதக வரலாறு & விபரங்கள்' : 'Client Horoscope History & Profile Summary'}</span>
                </h4>
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
        </div>
      )}

      {/* TAB 2: Kundli Matchmaking Requests & Review Panel */}
      {activeTab === 'matchmaking' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Shared Birth Details Intake Card */}
          <BirthDetailsIntakeCard
            module="matchmaking"
            onCalculate={() => refreshCalculations()}
            onClientSaved={loadReferredClients}
          />

          {/* Live Client Matchmaking (10 Poruthams & Compatibility) Analyzer */}
          {(() => {
            const hasActiveClient = Boolean(activeBirthData?.name && activeBirthData?.dob);
            const isP1Manual = person1Mode === 'manual' || !hasActiveClient;
            const p1Gender = isP1Manual ? (manualPerson1Details.gender || 'female') : (activeBirthData?.gender || 'female');
            const isP1Male = (p1Gender || 'female').toLowerCase() === 'male';

            return (
              <div className="bg-white border border-rose-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-rose-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-600 fill-rose-600/20" />
                      <span>{lang === 'ta' ? 'நேரலை திருமணப் பொருத்தம்' : 'Live Client Matchmaking'}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={handleResetMatchmaking}
                      title={lang === 'ta' ? 'மீட்டமைக்கவும்' : 'Reset Form'}
                      className="p-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 bg-white rounded-xl transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Comparison Input Grid: Bride / Female (Left / md:order-1) vs Groom / Male (Right / md:order-2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Person 1 Card (Female/Bride on Left, Male/Groom on Right) */}
                  <div className={`p-4 rounded-xl border space-y-2.5 ${
                    !isP1Male
                      ? 'md:order-1 bg-rose-50/40 border-rose-200'
                      : 'md:order-2 bg-indigo-50/40 border-indigo-200'
                  }`}>
                    <div className={`flex flex-wrap justify-between items-center gap-2 pb-2 border-b ${
                      !isP1Male ? 'border-rose-100' : 'border-indigo-100'
                    }`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                          !isP1Male ? 'text-rose-900' : 'text-indigo-900'
                        }`}>
                          <User className={`w-3.5 h-3.5 ${!isP1Male ? 'text-rose-600' : 'text-indigo-600'}`} />
                          {!isP1Male
                            ? (lang === 'ta' ? (!isP1Manual ? 'மணமகள் (வாடிக்கையாளர்)' : 'மணமகள்') : (!isP1Manual ? 'Bride (Active Client)' : 'Bride'))
                            : (lang === 'ta' ? (!isP1Manual ? 'மணமகன் (வாடிக்கையாளர்)' : 'மணமகன்') : (!isP1Manual ? 'Groom (Active Client)' : 'Groom'))}
                        </span>
                        {isP1Manual ? (
                          <div className="inline-flex bg-slate-200/80 p-0.5 rounded-md text-[10px] font-bold">
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
                          </div>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            !isP1Male ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {activeBirthData?.gender || 'female'}
                          </span>
                        )}
                      </div>

                      {/* Card-level toggle between Client and Manual when an active client is loaded */}
                      {hasActiveClient && (
                        <button
                          type="button"
                          onClick={() => setPerson1Mode(isP1Manual ? 'client' : 'manual')}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                        >
                          {!isP1Manual
                            ? (lang === 'ta' ? '✏️ கைமுறையாக உள்ளிடு' : '✏️ Enter Manually')
                            : (lang === 'ta' ? '🔍 வாடிக்கையாளரைப் பயன்படுத்து' : '🔍 Use Active Client')}
                        </button>
                      )}
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
                              className={`text-xs border font-bold px-3 py-1 rounded-lg cursor-pointer ${
                                !isP1Male
                                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                              }`}
                            >
                              {!isP1Male
                                ? (lang === 'ta' ? '✏️ மணமகள் விபரங்களை உள்ளிடுக' : '✏️ Enter Bride Details Manually')
                                : (lang === 'ta' ? '✏️ மணமகன் விபரங்களை உள்ளிடுக' : '✏️ Enter Groom Details Manually')}
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
                              {!isP1Male ? (lang === 'ta' ? 'மணமகள் பெயர்' : 'Bride Name') : (lang === 'ta' ? 'மணமகன் பெயர்' : 'Groom Name')}
                            </label>
                            <input
                              type="text"
                              value={manualPerson1Details.name}
                              onChange={(e) => setManualPerson1Details({ ...manualPerson1Details, name: e.target.value })}
                              placeholder={!isP1Male ? (lang === 'ta' ? 'மணமகள் பெயர் உள்ளிடவும்' : "Enter Bride's Name") : (lang === 'ta' ? 'மணமகன் பெயர் உள்ளிடவும்' : "Enter Groom's Name")}
                              className={`w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 ${
                                !isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                              }`}
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
                              className={`w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none ${
                                !isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                              }`}
                            />
                          </div>
                          {/* Birth Time (12-Hour AM/PM format, same as in Horoscope) */}
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                              <Clock className={`w-3 h-3 inline mr-1 ${!isP1Male ? 'text-rose-600' : 'text-indigo-600'}`} />
                              {lang === 'ta' ? 'பிறந்த நேரம் (12-மணி AM/PM)' : 'Birth Time (12-Hour AM/PM)'}
                            </label>
                            <div className="flex flex-wrap items-center gap-1">
                              <select
                                value={p1TimeState.hour}
                                onChange={e => updateP1TimePart('hour', e.target.value)}
                                className={`bg-white border rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none ${
                                  !isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                                }`}
                              >
                                {HOURS_12.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                              <span className="font-bold text-slate-400">:</span>
                              <select
                                value={p1TimeState.minute}
                                onChange={e => updateP1TimePart('minute', e.target.value)}
                                className={`bg-white border rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none ${
                                  !isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                                }`}
                              >
                                {MINUTES_60.map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                              <span className="font-bold text-slate-400">:</span>
                              <select
                                value={p1TimeState.second}
                                onChange={e => updateP1TimePart('second', e.target.value)}
                                className={`bg-white border rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none ${
                                  !isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                                }`}
                              >
                                {SECONDS_60.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={toggleP1Period}
                                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                                  p1TimeState.period === 'PM'
                                    ? (!isP1Male ? 'bg-rose-700 text-white border border-rose-700' : 'bg-indigo-700 text-white border border-indigo-700')
                                    : 'bg-amber-600 text-white border border-amber-600'
                                }`}
                              >
                                {p1TimeState.period}
                              </button>
                            </div>
                          </div>

                          {/* Birth City / Place - Search by letter autocomplete (same as in Horoscope) */}
                          <div ref={p1CityBoxRef} className="relative">
                            <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                              <MapPin className={`w-3 h-3 inline mr-1 ${!isP1Male ? 'text-rose-600' : 'text-indigo-600'}`} />
                              {lang === 'ta' ? 'பிறந்த இடம் (City / Place)' : 'Birth City / Place'}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={p1CityInput}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setP1CityInput(val);
                                  setManualPerson1Details(prev => ({ ...prev, dobPlace: val }));
                                  setShowP1CityDropdown(true);

                                  const exact = (GEO_DATA['India']?.['Tamil Nadu'] || []).find(c => c.name.toLowerCase() === val.trim().toLowerCase());
                                  if (exact) {
                                    setManualPerson1Details(prev => ({
                                      ...prev,
                                      dobPlace: exact.name,
                                      lat: exact.latDec !== undefined ? exact.latDec : exact.lat,
                                      lon: exact.lonDec !== undefined ? exact.lonDec : exact.lon
                                    }));
                                  }
                                }}
                                onFocus={() => setShowP1CityDropdown(true)}
                                placeholder={lang === 'ta' ? 'ஊர் பெயர் தட்டச்சு செய்க...' : 'Type city name...'}
                                className={`w-full bg-white border rounded-lg px-2.5 py-1.5 pr-7 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 ${
                                  !isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                                }`}
                                autoComplete="off"
                              />
                              {p1CityInput && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setP1CityInput('');
                                    setManualPerson1Details(prev => ({ ...prev, dobPlace: '' }));
                                    setShowP1CityDropdown(true);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                                  title="Clear"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            {showP1CityDropdown && p1CitySuggestions.length > 0 && (
                              <div className={`absolute left-0 right-0 top-full mt-1 bg-white border rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100 ${
                                !isP1Male ? 'border-rose-200' : 'border-indigo-200'
                              }`}>
                                {p1CitySuggestions.map((item, idx) => (
                                  <button
                                    key={`${item.name}-${idx}`}
                                    type="button"
                                    onClick={() => {
                                      setP1CityInput(item.name);
                                      setManualPerson1Details(prev => ({
                                        ...prev,
                                        dobPlace: item.name,
                                        lat: item.latDec !== undefined ? item.latDec : item.lat,
                                        lon: item.lonDec !== undefined ? item.lonDec : item.lon
                                      }));
                                      setShowP1CityDropdown(false);
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between cursor-pointer ${
                                      !isP1Male ? 'hover:bg-rose-50' : 'hover:bg-indigo-50'
                                    }`}
                                  >
                                    <span className="font-semibold text-slate-900">{item.name}</span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      ({typeof item.latDec === 'number' ? item.latDec.toFixed(2) : item.lat}°, {typeof item.lonDec === 'number' ? item.lonDec.toFixed(2) : item.lon}°)
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {manualPerson1Horoscope?.summary && (
                          <p className={`font-medium pt-1 border-t text-xs ${!isP1Male ? 'text-rose-900 border-rose-200' : 'text-indigo-900 border-indigo-200'}`}>
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

                  {/* Partner Details (Person 2 - Female/Bride on Left, Male/Groom on Right) */}
                  <div className={`p-4 rounded-xl border space-y-2.5 ${
                    isP1Male
                      ? 'md:order-1 bg-rose-50/40 border-rose-200'
                      : 'md:order-2 bg-indigo-50/40 border-indigo-200'
                  }`}>
                    <div className={`flex justify-between items-center pb-2 border-b ${
                      isP1Male ? 'border-rose-200' : 'border-indigo-200'
                    }`}>
                      <span className={`font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                        isP1Male ? 'text-rose-900' : 'text-indigo-900'
                      }`}>
                        <User className={`w-3.5 h-3.5 ${isP1Male ? 'text-rose-600' : 'text-indigo-600'}`} />
                        {isP1Male
                          ? (lang === 'ta' ? 'மணமகள் (வரன்)' : 'Bride (Partner)')
                          : (lang === 'ta' ? 'மணமகன் (வரன்)' : 'Groom (Partner)')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isP1Male ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
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
                          placeholder={isP1Male ? (lang === 'ta' ? 'மணமகள் பெயர் உள்ளிடவும்' : "Enter Bride's Name") : (lang === 'ta' ? 'மணமகன் பெயர் உள்ளிடவும்' : "Enter Groom's Name")}
                          className={`w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 ${
                            isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                          }`}
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
                          className={`w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none ${
                            isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                          }`}
                        />
                      </div>
                      {/* Birth Time (12-Hour AM/PM format, same as in Horoscope) */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          <Clock className={`w-3 h-3 inline mr-1 ${isP1Male ? 'text-rose-600' : 'text-indigo-600'}`} />
                          {lang === 'ta' ? 'பிறந்த நேரம் (12-மணி AM/PM)' : 'Birth Time (12-Hour AM/PM)'}
                        </label>
                        <div className="flex flex-wrap items-center gap-1">
                          <select
                            value={p2TimeState.hour}
                            onChange={e => updateP2TimePart('hour', e.target.value)}
                            className={`bg-white border rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none ${
                              isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                            }`}
                          >
                            {HOURS_12.map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <span className="font-bold text-slate-400">:</span>
                          <select
                            value={p2TimeState.minute}
                            onChange={e => updateP2TimePart('minute', e.target.value)}
                            className={`bg-white border rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none ${
                              isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                            }`}
                          >
                            {MINUTES_60.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <span className="font-bold text-slate-400">:</span>
                          <select
                            value={p2TimeState.second}
                            onChange={e => updateP2TimePart('second', e.target.value)}
                            className={`bg-white border rounded-lg px-1.5 py-1 text-xs font-bold focus:outline-none ${
                              isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                            }`}
                          >
                            {SECONDS_60.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={toggleP2Period}
                            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                              p2TimeState.period === 'PM'
                                ? (isP1Male ? 'bg-rose-700 text-white border border-rose-700' : 'bg-indigo-700 text-white border border-indigo-700')
                                : 'bg-amber-600 text-white border border-amber-600'
                            }`}
                          >
                            {p2TimeState.period}
                          </button>
                        </div>
                      </div>

                      {/* Birth City / Place - Search by letter autocomplete (same as in Horoscope) */}
                      <div ref={p2CityBoxRef} className="relative">
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          <MapPin className={`w-3 h-3 inline mr-1 ${isP1Male ? 'text-rose-600' : 'text-indigo-600'}`} />
                          {lang === 'ta' ? 'பிறந்த இடம் (City / Place)' : 'Birth City / Place'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={p2CityInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setP2CityInput(val);
                              setPartnerDetails(prev => ({ ...prev, dobPlace: val }));
                              setShowP2CityDropdown(true);

                              const exact = (GEO_DATA['India']?.['Tamil Nadu'] || []).find(c => c.name.toLowerCase() === val.trim().toLowerCase());
                              if (exact) {
                                setPartnerDetails(prev => ({
                                  ...prev,
                                  dobPlace: exact.name,
                                  lat: exact.latDec !== undefined ? exact.latDec : exact.lat,
                                  lon: exact.lonDec !== undefined ? exact.lonDec : exact.lon
                                }));
                              }
                            }}
                            onFocus={() => setShowP2CityDropdown(true)}
                            placeholder={lang === 'ta' ? 'ஊர் பெயர் தட்டச்சு செய்க...' : 'Type city name...'}
                            className={`w-full bg-white border rounded-lg px-2.5 py-1.5 pr-7 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 ${
                              isP1Male ? 'border-rose-200 focus:border-rose-400' : 'border-indigo-200 focus:border-indigo-400'
                            }`}
                            autoComplete="off"
                          />
                          {p2CityInput && (
                            <button
                              type="button"
                              onClick={() => {
                                setP2CityInput('');
                                setPartnerDetails(prev => ({ ...prev, dobPlace: '' }));
                                setShowP2CityDropdown(true);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                              title="Clear"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {showP2CityDropdown && p2CitySuggestions.length > 0 && (
                          <div className={`absolute left-0 right-0 top-full mt-1 bg-white border rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100 ${
                            isP1Male ? 'border-rose-200' : 'border-indigo-200'
                          }`}>
                            {p2CitySuggestions.map((item, idx) => (
                              <button
                                key={`${item.name}-${idx}`}
                                type="button"
                                onClick={() => {
                                  setP2CityInput(item.name);
                                  setPartnerDetails(prev => ({
                                    ...prev,
                                    dobPlace: item.name,
                                    lat: item.latDec !== undefined ? item.latDec : item.lat,
                                    lon: item.lonDec !== undefined ? item.lonDec : item.lon
                                  }));
                                  setShowP2CityDropdown(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between cursor-pointer ${
                                  isP1Male ? 'hover:bg-rose-50' : 'hover:bg-indigo-50'
                                }`}
                              >
                                <span className="font-semibold text-slate-900">{item.name}</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  ({typeof item.latDec === 'number' ? item.latDec.toFixed(2) : item.lat}°, {typeof item.lonDec === 'number' ? item.lonDec.toFixed(2) : item.lon}°)
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
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

                {/* Calculate & Quick 27-Star Finder Buttons (Below Bride & Groom Details) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCalculateActiveMatch}
                    disabled={calculatingActiveMatch}
                    className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold px-8 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {calculatingActiveMatch ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{lang === 'ta' ? 'கணக்கிடுக' : 'Calculate'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFindMatchingStarsForPerson1}
                    disabled={findingStarsLoading}
                    className="bg-amber-100 hover:bg-amber-200 text-[#7A1A22] border border-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Star className={`w-4 h-4 ${findingStarsLoading ? 'animate-spin' : ''}`} />
                    <span>{lang === 'ta' ? 'பொருந்தும் நட்சத்திரங்கள் (27 நட்சத்திரம்)' : 'Find Matching Nakshatras (27 Stars)'}</span>
                  </button>
                </div>

                {/* Standalone 27-Star Matching Result (for Person 1 before Partner 2) */}
                {standaloneStarMatch && (
                  <div className="bg-white rounded-2xl border border-amber-300 shadow-xs p-3.5 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                      <span className="text-xs sm:text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span>{MATCH_I18N.tabMatchingNakshatras[lang] || MATCH_I18N.tabMatchingNakshatras.en}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setStandaloneStarMatch(null)}
                        className="text-[11px] font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        ✕ {lang === 'ta' ? 'மூடு' : 'Close'}
                      </button>
                    </div>
                    <MatchingNakshatrasCard standaloneData={standaloneStarMatch} />
                  </div>
                )}

                {/* Calculated Match Results View (Horoscope Screen View Style: Jump Bar + Collapsible Sections, No Scrolling Tabs) */}
                {activeClientMatchReport && (
                  <div className="pt-3 border-t border-rose-200 space-y-3">
                    {/* Navigation Bar: Jump-to-Section Dropdown + Expand All / Collapse All */}
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-900/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-bold text-[#7A1A22] whitespace-nowrap">
                          {lang === 'ta' ? 'பிரிவுக்குச் செல்ல:' : 'Jump to Section:'}
                        </span>
                        <select
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (val) jumpToMatchSection(val);
                          }}
                          defaultValue=""
                          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#7A1A22] w-full max-w-xs cursor-pointer"
                        >
                          <option value="">{lang === 'ta' ? '-- 12 பிரிவுகள் (தேர்வு செய்க) --' : '-- Select Section (1 to 12) --'}</option>
                          <option value="1">1. {MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}</option>
                          <option value="2">2. {MATCH_I18N.tabAshtakoota[lang] || MATCH_I18N.tabAshtakoota.en}</option>
                          <option value="3">3. {MATCH_I18N.tabGujaDasha[lang] || MATCH_I18N.tabGujaDasha.en}</option>
                          <option value="4">4. {MATCH_I18N.tabRahuKetu[lang] || MATCH_I18N.tabRahuKetu.en}</option>
                          <option value="5">5. {MATCH_I18N.tabPuthrasthanam[lang] || MATCH_I18N.tabPuthrasthanam.en}</option>
                          <option value="6">6. {MATCH_I18N.tabPakshaMatch[lang] || MATCH_I18N.tabPakshaMatch.en}</option>
                          <option value="7">7. {MATCH_I18N.tabMarsVenus[lang] || MATCH_I18N.tabMarsVenus.en}</option>
                          <option value="8">8. {MATCH_I18N.tabShashtashtagam[lang] || MATCH_I18N.tabShashtashtagam.en}</option>
                          <option value="9">9. {MATCH_I18N.tabChandran[lang] || MATCH_I18N.tabChandran.en}</option>
                          <option value="10">10. {MATCH_I18N.tabGuru[lang] || MATCH_I18N.tabGuru.en}</option>
                          <option value="11">11. {MATCH_I18N.tabDasaSandhi[lang] || MATCH_I18N.tabDasaSandhi.en}</option>
                          <option value="12">12. {MATCH_I18N.tabMatchingNakshatras[lang] || MATCH_I18N.tabMatchingNakshatras.en}</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={expandAllMatchSections}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#7A1A22] text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          {lang === 'ta' ? '▼ அனைத்தும் விரி' : '▼ Expand All'}
                        </button>
                        <button
                          type="button"
                          onClick={collapseAllMatchSections}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          {lang === 'ta' ? '▲ அனைத்தும் சுருக்கு' : '▲ Collapse All'}
                        </button>
                      </div>
                    </div>

                    {/* SECTION 1: 10 Classical Poruthams & Dosha Analysis */}
                    <div id="match-section-1" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(1)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">1</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>{MATCH_I18N.tabTamilPorutham[lang] || MATCH_I18N.tabTamilPorutham.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[1] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[1] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <TamilPoruthamCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: Ashtakoota 36 Gunas Matrix */}
                    <div id="match-section-2" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(2)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-indigo-900/10 text-indigo-800 font-bold flex items-center justify-center text-xs font-mono shrink-0">2</span>
                          <span className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-indigo-600" />
                            <span>{MATCH_I18N.tabAshtakoota[lang] || MATCH_I18N.tabAshtakoota.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[2] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[2] && (
                        <div className="p-3.5 sm:p-4 border-t border-amber-900/10 space-y-3 bg-amber-50/40 text-xs">
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

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            {activeClientMatchReport.kootas?.map((k, i) => (
                              <div key={i} className="bg-white p-1.5 rounded-lg border border-amber-100 flex justify-between">
                                <span className="font-semibold text-slate-700">{k.koota || k.name}</span>
                                <span className="font-bold text-amber-800">{k.obtained}/{k.max ?? k.total}</span>
                              </div>
                            ))}
                          </div>

                          <div className="text-[11px] text-slate-700 pt-1 border-t border-amber-200 flex flex-col sm:flex-row justify-between gap-1">
                            <span>
                              <strong>{(t('brideGirlLabel') || 'Bride').replace(/:$/, '')}:</strong>{' '}
                              {activeClientMatchReport.manglik?.girl?.details ||
                                (lang === 'ta'
                                  ? (activeClientMatchReport.chevvaiAnalysis?.girl?.doshaLevelTamil || activeClientMatchReport.chevvaiAnalysis?.girl?.verdictTamil)
                                  : (activeClientMatchReport.chevvaiAnalysis?.girl?.doshaLevel || activeClientMatchReport.chevvaiAnalysis?.girl?.verdict)) ||
                                '—'}
                            </span>
                            <span>
                              <strong>{(t('groomBoyLabel') || 'Groom').replace(/:$/, '')}:</strong>{' '}
                              {activeClientMatchReport.manglik?.boy?.details ||
                                (lang === 'ta'
                                  ? (activeClientMatchReport.chevvaiAnalysis?.boy?.doshaLevelTamil || activeClientMatchReport.chevvaiAnalysis?.boy?.verdictTamil)
                                  : (activeClientMatchReport.chevvaiAnalysis?.boy?.doshaLevel || activeClientMatchReport.chevvaiAnalysis?.boy?.verdict)) ||
                                '—'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 3: Guja (Chevvai) Dasha & Chart */}
                    <div id="match-section-3" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(3)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-rose-900/10 text-rose-800 font-bold flex items-center justify-center text-xs font-mono shrink-0">3</span>
                          <span className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-rose-600" />
                            <span>{MATCH_I18N.tabGujaDasha[lang] || MATCH_I18N.tabGujaDasha.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[3] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[3] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <GujaDashaChart matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 4: Rahu-Ketu (Sarpa) Dosha & Chart */}
                    <div id="match-section-4" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(4)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-teal-900/10 text-teal-800 font-bold flex items-center justify-center text-xs font-mono shrink-0">4</span>
                          <span className="text-sm font-bold text-teal-900 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-teal-600" />
                            <span>{MATCH_I18N.tabRahuKetu[lang] || MATCH_I18N.tabRahuKetu.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[4] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[4] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <RahuKetuChart matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 5: 5th House – Puthrasthanam (Childbirth / Progeny) */}
                    <div id="match-section-5" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(5)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">5</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <Baby className="w-4 h-4 text-[#7A1A22]" />
                            <span>{MATCH_I18N.tabPuthrasthanam[lang] || MATCH_I18N.tabPuthrasthanam.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[5] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[5] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <PuthrasthanamChart matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 6: Valarpirai / Theipirai (Paksha & Chandra Bala) */}
                    <div id="match-section-6" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(6)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">6</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <Moon className="w-4 h-4 text-[#7A1A22]" />
                            <span>{MATCH_I18N.tabPakshaMatch[lang] || MATCH_I18N.tabPakshaMatch.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[6] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[6] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <PakshaMatchCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 7: Mars & Venus (Lagnam Analysis) */}
                    <div id="match-section-7" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(7)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">7</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <HeartHandshake className="w-4 h-4 text-[#7A1A22]" />
                            <span>{MATCH_I18N.tabMarsVenus[lang] || MATCH_I18N.tabMarsVenus.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[7] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[7] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <MarsVenusMatchCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 8: Shashtashtagam Analysis (6/8 Rasi & Lagnam) */}
                    <div id="match-section-8" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(8)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">8</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <GitCompare className="w-4 h-4 text-[#7A1A22]" />
                            <span>{MATCH_I18N.tabShashtashtagam[lang] || MATCH_I18N.tabShashtashtagam.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[8] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[8] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <ShashtashtagamMatchCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 9: Chandran (Moon) Compatibility & Mental Harmony */}
                    <div id="match-section-9" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(9)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-indigo-900/10 text-indigo-800 font-bold flex items-center justify-center text-xs font-mono shrink-0">9</span>
                          <span className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                            <Moon className="w-4 h-4 text-indigo-600" />
                            <span>{MATCH_I18N.tabChandran[lang] || MATCH_I18N.tabChandran.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[9] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[9] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <ChandranMatchCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 10: Guru (Jupiter) Bala & Paarvai Analysis */}
                    <div id="match-section-10" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(10)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-amber-800 font-bold flex items-center justify-center text-xs font-mono shrink-0">10</span>
                          <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>{MATCH_I18N.tabGuru[lang] || MATCH_I18N.tabGuru.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[10] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[10] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <GuruMatchCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 11: Dasa Sandhi Porutham (தசா சந்திப் பொருத்தம்) */}
                    <div id="match-section-11" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(11)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">11</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#7A1A22]" />
                            <span>{MATCH_I18N.tabDasaSandhi[lang] || MATCH_I18N.tabDasaSandhi.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[11] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[11] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <DasaSandhiMatchCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>

                    {/* SECTION 12: Matching Nakshatras (27-Star Finder) */}
                    <div id="match-section-12" className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleMatchSection(12)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-900/10 text-[#7A1A22] font-bold flex items-center justify-center text-xs font-mono shrink-0">12</span>
                          <span className="text-sm font-bold text-[#7A1A22] flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-600" />
                            <span>{MATCH_I18N.tabMatchingNakshatras[lang] || MATCH_I18N.tabMatchingNakshatras.en}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{openMatchSections[12] ? '▲' : '▼'}</span>
                      </button>
                      {openMatchSections[12] && (
                        <div className="p-3.5 sm:p-4 pt-0 border-t border-amber-900/10">
                          <MatchingNakshatrasCard matchReport={activeClientMatchReport} />
                        </div>
                      )}
                    </div>
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
                          {req.girl?.name || 'Bride'} & {req.boy?.name || 'Groom'}
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

                  {/* Coordinates Grid (Female/Bride Left, Male/Groom Right) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="font-bold text-rose-900 block mb-0.5">{t('brideGirlLabel')}</span>
                      <p className="text-slate-700">
                        <strong>{req.girl?.name}</strong> • {t('born')}: {req.girl?.dob} ({req.girl?.dobTime}) • {req.girl?.dobPlace}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-indigo-900 block mb-0.5">{t('groomBoyLabel')}</span>
                      <p className="text-slate-700">
                        <strong>{req.boy?.name}</strong> • {t('born')}: {req.boy?.dob} ({req.boy?.dobTime}) • {req.boy?.dobPlace}
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
                      {selectedMatchReq.girl?.name || 'Bride'} & {selectedMatchReq.boy?.name || 'Groom'}
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
                      <button
                        type="button"
                        onClick={() => setModalMatchTab('guja_dasha')}
                        className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          modalMatchTab === 'guja_dasha'
                            ? 'border-rose-600 text-rose-900 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                        <span>{MATCH_I18N.tabGujaDasha[lang] || MATCH_I18N.tabGujaDasha.en}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalMatchTab('rahu_ketu')}
                        className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          modalMatchTab === 'rahu_ketu'
                            ? 'border-teal-600 text-teal-900 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-teal-600" />
                        <span>{MATCH_I18N.tabRahuKetu[lang] || MATCH_I18N.tabRahuKetu.en}</span>
                      </button>
                    </div>

                    {modalMatchTab === 'tamil' ? (
                      <TamilPoruthamCard matchReport={selectedMatchReq.matchReport} />
                    ) : modalMatchTab === 'guja_dasha' ? (
                      <GujaDashaChart matchReport={selectedMatchReq.matchReport} />
                    ) : modalMatchTab === 'rahu_ketu' ? (
                      <RahuKetuChart matchReport={selectedMatchReq.matchReport} />
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

                        {/* Manglik status (Female/Bride Left, Male/Groom Right) */}
                        <div className="text-[11px] text-slate-700 pt-1 border-t border-amber-200 flex flex-col sm:flex-row justify-between gap-1">
                          <span><strong>{t('brideGirlLabel') || 'Bride'}:</strong> {selectedMatchReq.matchReport.manglik?.girl?.details}</span>
                          <span><strong>{t('groomBoyLabel') || 'Groom'}:</strong> {selectedMatchReq.matchReport.manglik?.boy?.details}</span>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadReferredClients}
                disabled={loadingReferred}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title={lang === 'ta' ? 'பட்டியலைப் புதுப்பிக்க' : 'Refresh Referred Clients'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingReferred ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{lang === 'ta' ? 'புதுப்பி' : 'Refresh'}</span>
              </button>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                {referredData.clients.length} {t('totalClientsBadge')}
              </span>
            </div>
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
                    <th className="py-2 px-2.5">Client ID</th>
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
                      <td className="py-2.5 px-2.5 font-mono text-[11px] font-bold text-indigo-700">
                        <span className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                          {cl.clientCode || 'CLI-Client'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900">{cl.name}</td>
                      <td className="py-2.5 px-2.5 font-mono font-bold">
                        {cl.mobile ? (
                          <span className="text-amber-800">{cl.mobile}</span>
                        ) : (
                          <span className="text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-normal">
                            {lang === 'ta' ? 'எண் இல்லை' : 'No Mobile'}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-700">{cl.dob} ({cl.dobTime})</td>
                      <td className="py-2.5 px-2.5 text-slate-700">{cl.dobPlace || cl.nativePlace || cl.city}</td>
                      <td className="py-2.5 px-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEditClientModal(cl)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                            title={lang === 'ta' ? 'விவரங்களைத் திருத்து & மொபைல் எண் சேர்க்க' : 'Edit Client Details & Add Mobile'}
                          >
                            <span>✏️</span>
                            <span>{lang === 'ta' ? 'திருத்து' : 'Edit'}</span>
                          </button>

                          {/* WhatsApp Credentials trigger */}
                          {cl.mobile ? (
                            <button
                              onClick={() => handleSendWhatsAppQuick(cl)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                              title={lang === 'ta' ? 'வாட்ஸ்அப்பில் உள்நுழைவு விவரங்களை அனுப்புக' : 'Send WhatsApp Login Credentials'}
                            >
                              <span>📲</span>
                              <span>WhatsApp</span>
                            </button>
                          ) : null}

                          {/* Receipt */}
                          <button
                            onClick={() => handleViewClientReceipt(cl.id)}
                            className="bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-900 border border-amber-300 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                            title="Print / Share Official Registration Receipt"
                          >
                            <span>🧾</span>
                            <span>Receipt</span>
                          </button>

                          {/* View in Horoscope */}
                          <button
                            onClick={() => {
                              selectClient(cl);
                              refreshCalculations();
                              setActiveTab('horoscope');
                              handleSelectClient(cl.mobile || cl.clientCode || cl.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            title={lang === 'ta' ? 'ஜாதகத்தில் திறக்க' : 'Open Client in Horoscope'}
                          >
                            {lang === 'ta' ? 'பார்க்க' : 'View'}
                          </button>

                          {/* Delete referred client */}
                          <button
                            onClick={() => handleDeleteReferredClient(cl)}
                            disabled={deletingClientId === (cl.id || cl.clientCode || cl.mobile)}
                            className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                            title={lang === 'ta' ? 'வாடிக்கையாளரை நீக்கு' : 'Delete Client'}
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{lang === 'ta' ? 'நீக்கு' : 'Delete'}</span>
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
                    {lang === 'ta' ? 'ஜோதிடர் பெயர்' : 'Astrologer Name'}
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

                {/* Astrologer Logo Upload (Right Side of 1-Page Title) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ta' ? 'ஜோதிடர் / நிலைய லோகோ படம் (வலது பக்கம்)' : 'Astrologer / Centre Logo Image (Right Side of Title)'}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {profileForm.pagerHeader.astrologerLogo ? (
                      <img
                        src={profileForm.pagerHeader.astrologerLogo}
                        alt="Astrologer Logo"
                        className="w-12 h-12 object-contain rounded-lg border border-slate-300 bg-white p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">
                        {lang === 'ta' ? 'லோகோ' : 'Logo'}
                      </div>
                    )}
                    <label className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs cursor-pointer border border-amber-300 transition-colors">
                      <span>{lang === 'ta' ? 'படம் பதிவேற்றுக' : 'Upload Logo Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setProfileForm(prev => ({
                              ...prev,
                              pagerHeader: { ...prev.pagerHeader, astrologerLogo: ev.target?.result || '' }
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {profileForm.pagerHeader.astrologerLogo && (
                      <button
                        type="button"
                        onClick={() => setProfileForm(prev => ({
                          ...prev,
                          pagerHeader: { ...prev.pagerHeader, astrologerLogo: '' }
                        }))}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer"
                      >
                        {lang === 'ta' ? 'நீக்கு' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>

                {/* REAL-TIME LIVE 1-PAGER HEADER PREVIEW BOX */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 flex items-center gap-1.5">
                    <span>👁️</span>
                    <span>{lang === 'ta' ? '1-பேஜர் தாளில் தோன்றும் நேரடி முன்தோற்றம் (Live Header Preview):' : 'Live Preview as Printed on 1-Pager Sheet:'}</span>
                  </span>
                  <div className="border border-black p-2.5 rounded-xs bg-white text-black shadow-2xs font-serif min-h-[54px] flex items-center justify-between gap-2">
                    <img src="/astrojit-logo.webp" alt="AstroJit" className="h-10 w-auto object-contain shrink-0" />
                    <div className="flex-1 text-center space-y-0.5 min-w-0">
                      {profileForm.pagerHeader.line1 && (
                        <div className="text-sm sm:text-base font-black tracking-tight">
                          {profileForm.pagerHeader.line1}
                        </div>
                      )}
                      {profileForm.pagerHeader.line2 && (
                        <div className="text-xs font-bold">
                          {profileForm.pagerHeader.line2}
                        </div>
                      )}
                      {(profileForm.pagerHeader.address1 || profileForm.pagerHeader.address2) && (
                        <div className="text-[10px] text-stone-700 leading-tight">
                          {profileForm.pagerHeader.address1}{profileForm.pagerHeader.address1 && profileForm.pagerHeader.address2 ? ' • ' : ''}{profileForm.pagerHeader.address2}
                        </div>
                      )}
                      {profileForm.pagerHeader.phoneEmail && (
                        <div className="text-[9.5px] font-mono font-semibold text-stone-800">
                          {profileForm.pagerHeader.phoneEmail}
                        </div>
                      )}
                      {!profileForm.pagerHeader.line1 && !profileForm.pagerHeader.line2 && !profileForm.pagerHeader.address1 && !profileForm.pagerHeader.address2 && !profileForm.pagerHeader.phoneEmail && (
                        <div className="text-xs text-stone-400 italic py-1">
                          {lang === 'ta' ? '(விவரங்கள் எதுவும் உள்ளிடப்படவில்லை - வெற்றுத் தாள்)' : '(No letterhead details entered - will be blank)'}
                        </div>
                      )}
                    </div>
                    {profileForm.pagerHeader.astrologerLogo ? (
                      <img src={profileForm.pagerHeader.astrologerLogo} alt="Astrologer Logo" className="w-10 h-10 object-contain rounded border border-black/30 p-0.5 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 shrink-0" />
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

      {/* Astrologer Edit Client Particulars & Trigger WhatsApp Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#FAF7F2] rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>✏️</span>
                  <span>{lang === 'ta' ? 'வாடிக்கையாளர் விவரங்களைத் திருத்து' : 'Edit Client Profile & Login'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Client ID: <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">{editingClient.clientCode || 'CLI-Client'}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200 text-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-3.5 text-xs">
              {editClientSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{editClientSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'முழு பெயர் *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.name}
                    onChange={(e) => setEditClientForm({ ...editClientForm, name: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                    placeholder="Full Name"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'வாடிக்கையாளர் மொபைல் (10 இலக்கம்)' : 'Client Mobile No. (10 Digits)'}
                  </label>
                  <div className="flex">
                    <span className="bg-stone-200 px-2.5 py-2 rounded-l-xl text-xs font-bold text-stone-600 border border-r-0 border-stone-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={editClientForm.mobile}
                      onChange={(e) => setEditClientForm({ ...editClientForm, mobile: clean10DigitMobile(e.target.value) })}
                      className="w-full bg-[#FAF6EF] border border-stone-300 rounded-r-xl px-3 py-2 text-stone-900 font-mono font-bold focus:outline-none"
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    {lang === 'ta' ? 'உள்நுழைவு பயனர்பெயராகவும் வாட்ஸ்அப்பிற்கும் பயன்படும்.' : 'Used as login username & for WhatsApp.'}
                  </span>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'போர்ட்டல் கடவுச்சொல்' : 'Client Portal Password'}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.password}
                    onChange={(e) => setEditClientForm({ ...editClientForm, password: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:outline-none"
                    placeholder="Client@123"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    {lang === 'ta' ? 'வாடிக்கையாளரின் ஆரம்ப கடவுச்சொல்.' : 'Initial password for client login.'}
                  </span>
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'பாலினம்' : 'Gender'}
                  </label>
                  <select
                    value={editClientForm.gender}
                    onChange={(e) => setEditClientForm({ ...editClientForm, gender: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="male">{lang === 'ta' ? 'ஆண் (Male)' : 'Male'}</option>
                    <option value="female">{lang === 'ta' ? 'பெண் (Female)' : 'Female'}</option>
                  </select>
                </div>

                {/* Native Place */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'சொந்த ஊர்' : 'Native Place'}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.nativePlace}
                    onChange={(e) => setEditClientForm({ ...editClientForm, nativePlace: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                    placeholder="Native place"
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'பிறந்த தேதி' : 'Date of Birth (YYYY-MM-DD)'}
                  </label>
                  <input
                    type="date"
                    value={editClientForm.dob}
                    onChange={(e) => setEditClientForm({ ...editClientForm, dob: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                  />
                </div>

                {/* Birth Time */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'பிறந்த நேரம்' : 'Birth Time (HH:MM / AM/PM)'}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.dobTime}
                    onChange={(e) => setEditClientForm({ ...editClientForm, dobTime: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                    placeholder="e.g. 05:15:00 AM"
                  />
                </div>

                {/* Birth Place */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'பிறந்த இடம்' : 'Birth Place / City'}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.dobPlace}
                    onChange={(e) => setEditClientForm({ ...editClientForm, dobPlace: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                    placeholder="e.g. Hosur, Tamil Nadu"
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'தந்தை பெயர்' : "Father's Name"}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.fatherName}
                    onChange={(e) => setEditClientForm({ ...editClientForm, fatherName: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                    placeholder="Father's Name"
                  />
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    {lang === 'ta' ? 'தாய் பெயர்' : "Mother's Name"}
                  </label>
                  <input
                    type="text"
                    value={editClientForm.motherName}
                    onChange={(e) => setEditClientForm({ ...editClientForm, motherName: e.target.value })}
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                    placeholder="Mother's Name"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-2xl flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {lang === 'ta' ? 'ரத்து செய்' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => handleSaveEditClient(false)}
                disabled={savingEditClient}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingEditClient ? (lang === 'ta' ? 'சேமிக்கிறது...' : 'Saving...') : (lang === 'ta' ? 'மாற்றங்களைச் சேமிக்க' : 'Save Changes')}
              </button>

              <button
                type="button"
                onClick={() => handleSaveEditClient(true)}
                disabled={savingEditClient}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                title="Save client details and open WhatsApp with login credentials"
              >
                <span>📲</span>
                <span>{lang === 'ta' ? 'சேமித்து வாட்ஸ்அப் அனுப்ப' : 'Save & Send WhatsApp'}</span>
              </button>
            </div>
          </div>
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
