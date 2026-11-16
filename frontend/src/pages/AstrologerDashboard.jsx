import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';
import OnePageHoroscope from '../components/OnePageHoroscope';
import FullHoroscopeDossier from '../components/FullHoroscopeDossier';
import ClientRegistrationReceiptModal from '../components/ClientRegistrationReceiptModal';
import BirthCoordinatesPicker from '../components/BirthCoordinatesPicker';
import KundliMatchmaking from '../components/KundliMatchmaking';
import TamilPoruthamCard from '../components/TamilPoruthamCard';
import DetailedHoroscopeScreen from '../components/horoscope/DetailedHoroscopeScreen';
import { MATCH_I18N } from '../matchmakingI18n';

const DOSSIER_FORMAT_OPTIONS = [
  { id: '1page', labelKey: 'fmt1Page', defaultLabel: '1 Page', pages: 1, icon: '📄', tag: 'Brief' },
  { id: '7page', labelKey: 'fmt7Page', defaultLabel: '7 Pages', pages: 7, icon: '📑', tag: 'Compact' },
  { id: '18page', labelKey: 'fmt18Page', defaultLabel: '18 Pages', pages: 18, icon: '📗', tag: 'Standard' },
  { id: '21page', labelKey: 'fmt21Page', defaultLabel: '21 Pages', pages: 21, icon: '📘', tag: 'Vedic' },
  { id: '25page', labelKey: 'fmt25Page', defaultLabel: '25 Pages', pages: 25, icon: '📙', tag: 'Detailed' },
  { id: '33page', labelKey: 'fmt33Page', defaultLabel: '33 Pages', pages: 33, icon: '📕', tag: 'Shodashavarga' },
  { id: '51page', labelKey: 'fmt51Page', defaultLabel: '51 Pages', pages: 51, icon: '👑', tag: 'Encyclopedia' },
];

export default function AstrologerDashboard({ activeTab: propTab, onTabChange }) {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [internalTab, setInternalTab] = useState('appointments');
  const activeTab = propTab || internalTab;
  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedClientMobile, setSelectedClientMobile] = useState(null);
  const [clientHoroscope, setClientHoroscope] = useState(null);
  const [clientNotes, setClientNotes] = useState([]);
  const [loadingHoroscope, setLoadingHoroscope] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referredData, setReferredData] = useState({ totalReferred: 0, clients: [] });

  const [isOnline, setIsOnline] = useState(true);
  const [ratePerMinute, setRatePerMinute] = useState(25);
  const [availableSlots, setAvailableSlots] = useState(['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM']);

  // Horoscope Dedicated Tab State
  const [horoFormat, setHoroFormat] = useState('1page'); // '1page' or '21page'
  const [horoInputMode, setHoroInputMode] = useState('custom'); // 'custom' or 'referred'
  const [activeHoroscope, setActiveHoroscope] = useState(null);
  const [generatingHoro, setGeneratingHoro] = useState(false);
  const [customHoroForm, setCustomHoroForm] = useState({
    name: 'Sample',
    fatherName: 'Sample father',
    motherName: 'Sample Mother',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Hosur',
    latitude: "12° 44' N",
    longitude: "77° 49' E",
    coordinates: "12° 44' N , 77° 49' E",
    nativePlace: 'Hosur (Tamil Nadu, India)',
    dob: '2026-10-30',
    dobTime: '10:55:00',
    dobTime12: '10:55:00 AM',
    dobPlace: 'Hosur (Tamil Nadu, India)',
    gender: 'male',
    mobile: '',
    email: '',
    gotra: 'Vishwamitra',
    initialPassword: 'Astro@' + Math.floor(100 + Math.random() * 900),
    starBasis: 'moon',
    autoRegisterClient: false,
  });
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState(null);
  const [isRegisteringClient, setIsRegisteringClient] = useState(false);
  const [horoViewMode, setHoroViewMode] = useState('print'); // 'print' or 'screen'
  const [showHoroForm, setShowHoroForm] = useState(true);

  useEffect(() => {
    if (activeTab === 'thirukanitha' || activeTab === 'quickpredictions') {
      setHoroViewMode('screen');
    }
  }, [activeTab]);

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
  const [showManualCalculator, setShowManualCalculator] = useState(false);

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

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSelectedClientMobile(null);
    setClientHoroscope(null);
    try {
      const res = await API.searchClients(searchQuery);
      setSearchResults(res.clients || []);
    } catch (err) {
      alert('Error searching clients: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectClient = async (mobile) => {
    setSelectedClientMobile(mobile);
    setLoadingHoroscope(true);
    try {
      const data = await API.getClientHoroscopeByMobile(mobile);
      setClientHoroscope(data);
      setClientNotes(data.consultationHistory || []);
    } catch (err) {
      alert('Failed to load client horoscope: ' + err.message);
    } finally {
      setLoadingHoroscope(false);
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

  const handleGenerateCustomHoroscope = async (e) => {
    if (e) e.preventDefault();
    setGeneratingHoro(true);
    try {
      const shouldRegister = customHoroForm.autoRegisterClient || horoInputMode === 'register';
      if (shouldRegister) {
        if (!customHoroForm.mobile || customHoroForm.mobile.trim().length < 10) {
          alert('Client Mobile Number (at least 10 digits) is required to register an account and generate official login credentials.');
          setGeneratingHoro(false);
          return;
        }
        setIsRegisteringClient(true);
        const res = await API.registerClientByAstrologer(customHoroForm);
        const horo = res.horoscope;
        if (horo) {
          horo.gender = customHoroForm.gender || horo.gender || 'male';
          if (horo.client) horo.client.gender = customHoroForm.gender || horo.client.gender || 'male';
        }
        setActiveHoroscope(horo);
        setSelectedReceiptForModal(res.receipt);
        // Refresh referred clients list so the new client appears immediately
        const refRes = await API.getReferredClients();
        setReferredData(refRes);
      } else {
        const data = await API.generateAstrologerHoroscope(customHoroForm);
        if (data) {
          data.gender = customHoroForm.gender || data.gender || 'male';
          if (data.client) data.client.gender = customHoroForm.gender || data.client.gender || 'male';
        }
        setActiveHoroscope(data);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setGeneratingHoro(false);
      setIsRegisteringClient(false);
    }
  };

  const handleSelectReferredClientForHoro = async (client) => {
    setGeneratingHoro(true);
    try {
      const data = await API.getClientHoroscopeByMobile(client.mobile);
      setActiveHoroscope(data);
      setCustomHoroForm({
        name: client.name || '',
        fatherName: client.fatherName || 'Father',
        motherName: client.motherName || 'Mother',
        country: client.country || 'India',
        state: client.state || 'Tamil Nadu',
        city: client.city || 'Hosur',
        latitude: client.latitude || "12° 44' N",
        longitude: client.longitude || "77° 49' E",
        coordinates: client.coordinates || "12° 44' N , 77° 49' E",
        nativePlace: client.nativePlace || client.dobPlace || 'Hosur (Tamil Nadu, India)',
        dob: client.dob || '2026-10-30',
        dobTime: client.dobTime || '10:55:00',
        dobTime12: client.dobTime12 || client.dobTime || '10:55:00 AM',
        dobPlace: client.dobPlace || 'Hosur (Tamil Nadu, India)',
        gender: client.gender || 'male',
        mobile: client.mobile || '',
        email: client.email || '',
        gotra: client.gotra || '',
        starBasis: client.starBasis || 'moon',
        initialPassword: 'Astro@' + Math.floor(100 + Math.random() * 900),
        autoRegisterClient: false,
      });
    } catch (err) {
      alert('Failed to load client horoscope: ' + err.message);
    } finally {
      setGeneratingHoro(false);
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
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar whitespace-nowrap">
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
            onClick={() => {
              setActiveTab('horoscope');
              if (!activeHoroscope) {
                handleGenerateCustomHoroscope();
              }
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'horoscope' || activeTab === 'thirukanitha' || activeTab === 'quickpredictions'
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

      {/* TAB: Dedicated Horoscope Generation & Dossier (Unified Module) */}
      {(activeTab === 'horoscope' || activeTab === 'thirukanitha' || activeTab === 'quickpredictions') && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header & Options Strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>{lang === 'ta' ? 'ஜாதக கணிப்பு & திருக்கணித ஆய்வு' : 'Vedic Horoscope & Thirukanitha Ephemeris'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ta'
                    ? 'பிறப்பு விவரங்களை உள்ளிட்டு ஜாதக அச்சு காட்சி மற்றும் விரிவான திரை காட்சி இரண்டையும் ஒரே தொகுதியில் பார்க்கலாம்.'
                    : 'Enter birth details to synthesize authentic horoscope. Toggle seamlessly between Print View and Screen View.'}
                </p>
              </div>

              {/* View Switcher: Print View vs Screen View */}
              <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setHoroViewMode('print')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      horoViewMode === 'print'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === 'ta' ? 'ஜாதக அச்சு காட்சி' : 'Horoscope Print View'}</span>
                    <span className="text-[10px] font-normal opacity-85">(Kundli Dossier)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHoroViewMode('screen')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      horoViewMode === 'screen'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{lang === 'ta' ? 'விரிவான திரை காட்சி' : 'Horoscope Screen View'}</span>
                    <span className="text-[10px] font-normal opacity-85">(Detailed)</span>
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">PRO</span>
                  </button>
                </div>

                {/* If in Print View, show format pills */}
                {horoViewMode === 'print' && (
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {DOSSIER_FORMAT_OPTIONS.map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setHoroFormat(fmt.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          horoFormat === fmt.id
                            ? 'bg-white text-indigo-950 shadow-xs border border-slate-300'
                            : 'text-slate-600 hover:text-slate-950'
                        }`}
                      >
                        <span>{fmt.icon} {t(fmt.labelKey, fmt.defaultLabel)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Toggle Details Form Expand/Collapse */}
                <button
                  type="button"
                  onClick={() => setShowHoroForm(!showHoroForm)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {showHoroForm
                      ? (lang === 'ta' ? 'படிவத்தை மறைக்க' : 'Hide Details Form')
                      : (lang === 'ta' ? 'விவரங்களை மாற்ற / திருத்த' : 'Edit / Change Birth Details')}
                  </span>
                </button>
              </div>
            </div>

            {/* Input Selection Tabs & Details Form */}
            {showHoroForm && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setHoroInputMode('custom');
                  setCustomHoroForm(prev => ({ ...prev, autoRegisterClient: false }));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  horoInputMode === 'custom'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs font-black'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{t('manualCoordsTab')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHoroInputMode('register');
                  setCustomHoroForm(prev => ({
                    ...prev,
                    autoRegisterClient: true,
                    name: prev.name === 'Sample' ? '' : prev.name,
                    fatherName: prev.fatherName === 'Sample father' ? '' : prev.fatherName,
                    motherName: prev.motherName === 'Sample Mother' ? '' : prev.motherName,
                    nativePlace: prev.nativePlace === 'Bangalore (Karnataka)' ? '' : prev.nativePlace,
                    dobPlace: prev.dobPlace === 'Bangalore (Karnataka)' ? '' : prev.dobPlace,
                    initialPassword: prev.initialPassword || ('Astro@' + Math.floor(100 + Math.random() * 900)),
                  }));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  horoInputMode === 'register'
                    ? 'bg-amber-100 text-amber-950 border border-amber-400 shadow-2xs font-black'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{t('registerClientTab') || '➕ Register & Save New Client'}</span>
                <span className="text-[9px] bg-amber-600 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Receipt
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHoroInputMode('referred')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  horoInputMode === 'referred'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs font-black'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{t('selectReferredTab')} ({referredData.clients.length})</span>
              </button>
            </div>

            {/* Mode A & Mode C: Custom Quick Coordinates or Full Client Registration */}
            {(horoInputMode === 'custom' || horoInputMode === 'register') && (
              <form onSubmit={handleGenerateCustomHoroscope} className="space-y-3 pt-2 text-xs">
                {horoInputMode === 'register' && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                        <UserCheck className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-black text-slate-950 text-sm">
                          Direct Client Account Registration & Official Receipt Generation
                        </h4>
                        <p className="text-[11px] text-amber-950/80">
                          Register client account with login credentials, auto-link to referral code <strong className="font-mono text-indigo-700 font-bold">{referredData.referralCode || 'PANDIT101'}</strong>, compute certified Janma Kundli, and generate official printable Acknowledgement Receipt.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-300 text-amber-900 shrink-0">
                      Auto Client Code: CLI-NEW
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {t('nativeNameLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customHoroForm.name}
                      onChange={(e) => setCustomHoroForm({ ...customHoroForm, name: e.target.value })}
                      placeholder="e.g. Aarav Kumar Sharma"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Mobile Number is mandatory for registration */}
                  {(horoInputMode === 'register' || customHoroForm.autoRegisterClient) ? (
                    <div>
                      <label className="font-bold text-amber-950 block mb-1 flex items-center justify-between">
                        <span>Mobile (Login ID) <span className="text-red-500">*</span></span>
                        <span className="text-[10px] text-amber-700 font-normal">Username</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customHoroForm.mobile}
                        onChange={(e) => setCustomHoroForm({ ...customHoroForm, mobile: e.target.value.replace(/[^0-9]/g, '') })}
                        placeholder="e.g. 9123456789"
                        className="w-full bg-amber-50/50 border-2 border-amber-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">{t('fatherNameLabel')}</label>
                      <input
                        type="text"
                        value={customHoroForm.fatherName}
                        onChange={(e) => setCustomHoroForm({ ...customHoroForm, fatherName: e.target.value })}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {/* Password / Access PIN field in registration mode */}
                  {(horoInputMode === 'register' || customHoroForm.autoRegisterClient) ? (
                    <div>
                      <label className="font-bold text-amber-950 block mb-1 flex items-center justify-between">
                        <span>Initial Password / PIN <span className="text-red-500">*</span></span>
                        <button
                          type="button"
                          onClick={() => setCustomHoroForm({ ...customHoroForm, initialPassword: 'Astro@' + Math.floor(100 + Math.random() * 900) })}
                          className="text-[10px] text-indigo-700 hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Generate</span>
                        </button>
                      </label>
                      <input
                        type="text"
                        required
                        value={customHoroForm.initialPassword}
                        onChange={(e) => setCustomHoroForm({ ...customHoroForm, initialPassword: e.target.value })}
                        placeholder="e.g. Astro@123"
                        className="w-full bg-amber-50/50 border-2 border-amber-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-800 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">{t('motherNameLabel')}</label>
                      <input
                        type="text"
                        value={customHoroForm.motherName}
                        onChange={(e) => setCustomHoroForm({ ...customHoroForm, motherName: e.target.value })}
                        placeholder="e.g. Sunita Sharma"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{t('genderLabel')}</label>
                    <select
                      value={customHoroForm.gender}
                      onChange={(e) => setCustomHoroForm({ ...customHoroForm, gender: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="male">Male (ஆண் / पुरुष)</option>
                      <option value="female">Female (பெண் / महिला)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {t('dobLabel')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={customHoroForm.dob}
                      onChange={(e) => setCustomHoroForm({ ...customHoroForm, dob: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{t('nativePlaceLabel')}</label>
                    <input
                      type="text"
                      value={customHoroForm.nativePlace}
                      onChange={(e) => setCustomHoroForm({ ...customHoroForm, nativePlace: e.target.value })}
                      placeholder="e.g. Hosur, Tamil Nadu"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1 flex items-center justify-between">
                      <span>Rasi Calculation Star <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-amber-700 font-bold uppercase">Star Basis</span>
                    </label>
                    <select
                      value={customHoroForm.starBasis || 'moon'}
                      onChange={(e) => setCustomHoroForm({ ...customHoroForm, starBasis: e.target.value })}
                      className="w-full bg-amber-50/80 border-2 border-amber-300 rounded-xl px-3 py-2 text-slate-950 font-bold focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs text-xs sm:text-sm"
                    >
                      <option value="moon">🌙 Moon Star (Chandra Nakshatra - Janma Rasi)</option>
                      <option value="sun">☀️ Sun Star (Surya Nakshatra - Surya Rasi)</option>
                    </select>
                  </div>

                  {/* 12-Hour Time Picker & Cascading Country -> State -> City Coordinates Selector */}
                  <div className="col-span-1 sm:col-span-2 md:col-span-4">
                    <BirthCoordinatesPicker
                      country={customHoroForm.country || 'India'}
                      state={customHoroForm.state || 'Tamil Nadu'}
                      city={customHoroForm.city || 'Hosur'}
                      latitude={customHoroForm.latitude || "12° 44' N"}
                      longitude={customHoroForm.longitude || "77° 49' E"}
                      dobTime={customHoroForm.dobTime || '10:55:00'}
                      dobTime12={customHoroForm.dobTime12 || '10:55:00 AM'}
                      onChange={(coords) => setCustomHoroForm(prev => ({ ...prev, ...coords }))}
                    />
                  </div>

                  {(horoInputMode === 'register' || customHoroForm.autoRegisterClient) && (
                    <>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">{t('fatherNameLabel')}</label>
                        <input
                          type="text"
                          value={customHoroForm.fatherName}
                          onChange={(e) => setCustomHoroForm({ ...customHoroForm, fatherName: e.target.value })}
                          placeholder="e.g. Vikram Sharma"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">{t('motherNameLabel')}</label>
                        <input
                          type="text"
                          value={customHoroForm.motherName}
                          onChange={(e) => setCustomHoroForm({ ...customHoroForm, motherName: e.target.value })}
                          placeholder="e.g. Sunita Sharma"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          value={customHoroForm.email}
                          onChange={(e) => setCustomHoroForm({ ...customHoroForm, email: e.target.value })}
                          placeholder="e.g. client@example.com"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Gotra (Lineage)</label>
                        <input
                          type="text"
                          value={customHoroForm.gotra}
                          onChange={(e) => setCustomHoroForm({ ...customHoroForm, gotra: e.target.value })}
                          placeholder="e.g. Vishwamitra / Kashyapa"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* In Custom mode: Checkbox to toggle account registration */}
                {horoInputMode === 'custom' && (
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 hover:text-amber-900">
                      <input
                        type="checkbox"
                        checked={customHoroForm.autoRegisterClient}
                        onChange={(e) => setCustomHoroForm({ ...customHoroForm, autoRegisterClient: e.target.checked })}
                        className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Register client account & create login credentials (Save to My Clients & issue official receipt)</span>
                    </label>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2.5">
                  <button
                    type="submit"
                    disabled={generatingHoro}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      (horoInputMode === 'register' || customHoroForm.autoRegisterClient)
                        ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white active:scale-98'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {generatingHoro ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>
                      {(horoInputMode === 'register' || customHoroForm.autoRegisterClient)
                        ? '💾 Register Client, Generate Dossier & Issue Official Receipt'
                        : t('generateHoroBtn')}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Mode B: Referred Clients Selector */}
            {horoInputMode === 'referred' && (
              <div className="pt-2">
                {referredData.clients.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    {t('noReferredClientsHoroNotice')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {referredData.clients.map((cl) => (
                      <div
                        key={cl.id}
                        onClick={() => handleSelectReferredClientForHoro(cl)}
                        className="bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-400 p-3 rounded-xl transition-all cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-xs group-hover:text-indigo-700 transition-colors">
                            {cl.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {t('born')}: {cl.dob} ({cl.dobTime}) • {cl.dobPlace}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewClientReceipt(cl.id);
                            }}
                            className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-lg transition-all shadow-2xs"
                            title="View Registration Receipt & Login Credentials"
                          >
                            🧾 Receipt
                          </button>
                          <span className="text-[11px] font-bold text-indigo-600 bg-white border border-slate-200 group-hover:border-indigo-400 px-2 py-0.5 rounded-lg">
                            {t('generateArrow')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Horoscope Display: Render either Print View (Dossier / 1-Page) or Screen View (Detailed Thirukanitha) */}
      {generatingHoro ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-spin mb-3" />
          <p className="text-slate-600 text-sm font-semibold">{t('synthesizingEphemeris')}</p>
        </div>
      ) : (
        <div>
          {horoViewMode === 'print' ? (
            activeHoroscope ? (
              horoFormat === '1page' ? (
                <OnePageHoroscope
                  horoscope={{
                    ...activeHoroscope,
                    gender: activeHoroscope?.client?.gender || activeHoroscope?.gender || customHoroForm.gender || 'male',
                    client: {
                      ...activeHoroscope?.client,
                      gender: activeHoroscope?.client?.gender || activeHoroscope?.gender || customHoroForm.gender || 'male',
                    }
                  }}
                  clientNotes={clientNotes}
                  onAddNote={handleAddNote}
                  isAstrologer={true}
                />
              ) : (
                <FullHoroscopeDossier
                  horoscope={{
                    ...activeHoroscope,
                    gender: activeHoroscope?.client?.gender || activeHoroscope?.gender || customHoroForm.gender || 'male',
                    client: {
                      ...activeHoroscope?.client,
                      gender: activeHoroscope?.client?.gender || activeHoroscope?.gender || customHoroForm.gender || 'male',
                    }
                  }}
                  dossierPages={
                    horoFormat === '7page' ? 7 :
                    horoFormat === '18page' ? 18 :
                    horoFormat === '25page' ? 25 :
                    horoFormat === '33page' ? 33 :
                    horoFormat === '51page' ? 51 : 21
                  }
                  clientNotes={clientNotes}
                  onAddNote={handleAddNote}
                  isAstrologer={true}
                />
              )
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <p className="text-sm font-bold">
                  {lang === 'ta' ? 'பிறப்பு விவரங்களை உள்ளிட்டு "ஜாதகம் கணிக்க" கிளிக் செய்யவும்.' : 'Please enter birth details above and click "Generate Horoscope".'}
                </p>
              </div>
            )
          ) : (
            <DetailedHoroscopeScreen
              client={{
                name: customHoroForm.name || activeHoroscope?.name,
                fatherName: customHoroForm.fatherName || activeHoroscope?.fatherName,
                motherName: customHoroForm.motherName || activeHoroscope?.motherName,
                gender: customHoroForm.gender || activeHoroscope?.gender || 'male',
                dob: customHoroForm.dob || activeHoroscope?.dob,
                dobTime: customHoroForm.dobTime || activeHoroscope?.dobTime,
                dobPlace: customHoroForm.dobPlace || activeHoroscope?.pob || customHoroForm.nativePlace,
                latitude: customHoroForm.latitude || "12° 44' N",
                longitude: customHoroForm.longitude || "77° 49' E",
                starBasis: customHoroForm.starBasis || 'moon'
              }}
              isEmbedded={true}
            />
          )}
        </div>
      )}
    </div>
  )}

      {/* TAB 1: Search for Client by Mobile Number & View Horoscope */}
      {activeTab === 'search' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
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
                onChange={(e) => setSearchQuery(e.target.value)}
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

            <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>{t('quickTestLabel')}</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('9123456789');
                  API.searchClients('9123456789').then((res) => setSearchResults(res.clients || []));
                }}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                9123456789 (Aarav)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('9345678901');
                  API.searchClients('9345678901').then((res) => setSearchResults(res.clients || []));
                }}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                9345678901 (Pooja)
              </button>
            </div>
          </div>

          {searchResults.length > 0 && !selectedClientMobile && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
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

          {selectedClientMobile && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-700">
                  {t('viewingKundliFor')} <strong className="text-amber-800">{clientHoroscope?.client?.name} ({selectedClientMobile})</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedClientMobile(null);
                    setClientHoroscope(null);
                  }}
                  className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                >
                  {t('backToSearch')}
                </button>
              </div>

              {loadingHoroscope ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-spin mb-3" />
                  <p className="text-slate-500 text-xs">{t('computingBirthChart')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Format Toggle for Searched Client */}
                  <div className="flex flex-wrap items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl w-fit shadow-2xs">
                    {DOSSIER_FORMAT_OPTIONS.map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setHoroFormat(fmt.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          horoFormat === fmt.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>{fmt.icon} {t(fmt.labelKey, fmt.defaultLabel)}</span>
                      </button>
                    ))}
                  </div>

                  {horoFormat === '1page' ? (
                    <OnePageHoroscope
                      horoscope={clientHoroscope}
                      clientNotes={clientNotes}
                      onAddNote={handleAddNote}
                      isAstrologer={true}
                    />
                  ) : (
                    <FullHoroscopeDossier
                      horoscope={clientHoroscope}
                      dossierPages={
                        horoFormat === '7page' ? 7 :
                        horoFormat === '18page' ? 18 :
                        horoFormat === '25page' ? 25 :
                        horoFormat === '33page' ? 33 :
                        horoFormat === '51page' ? 51 : 21
                      }
                      clientNotes={clientNotes}
                      onAddNote={handleAddNote}
                      isAstrologer={true}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Kundli Matchmaking Requests & Review Panel */}
      {activeTab === 'matchmaking' && (
        <div className="space-y-4 sm:space-y-6">
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

          {/* Optional Toggle to Manual Match Calculator */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <button
              onClick={() => setShowManualCalculator(!showManualCalculator)}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition-all"
            >
              <span>{showManualCalculator ? t('hideManualCalcToggle') : t('needManualCalcToggle')}</span>
            </button>
            {showManualCalculator && (
              <div className="mt-4 text-left">
                <KundliMatchmaking />
              </div>
            )}
          </div>
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
                            {t('btnViewKundli')}
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

      {/* Official Client Registration Acknowledgement Receipt Modal */}
      {selectedReceiptForModal && (
        <ClientRegistrationReceiptModal
          receipt={selectedReceiptForModal}
          onClose={() => setSelectedReceiptForModal(null)}
          onOpenDossier={() => {
            setSelectedReceiptForModal(null);
            setActiveTab('horoscope');
          }}
        />
      )}
    </div>
  );
}
