import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  User,
  Calendar,
  Clock,
  Globe,
  Building,
  MapPin,
  Sparkles,
  Lock,
  Key,
  Share2,
  PlusCircle,
  CheckCircle,
  X,
  Phone,
  Users,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useClientBirth } from '../context/ClientBirthContext';
import { API } from '../api';
import ClientRegistrationReceiptModal from './ClientRegistrationReceiptModal';
import { COUNTRIES, GEO_DATA, parseCoordinateToDec } from '../data/geoCoordinates';
import { clean10DigitMobile } from '../utils/phoneUtils';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function BirthDetailsIntakeCard({
  module = 'horoscope', // 'horoscope' | 'search' | 'matchmaking'
  onCalculate,
  hideClientLookup = false
}) {
  const { lang } = useLang();
  const { user } = useAuth();
  const isTa = lang === 'ta';

  const {
    clientData,
    updateField,
    updateFields,
    selectClient,
    clearClientData,
    refreshCalculations
  } = useClientBirth();

  const shouldHideLookup = Boolean(hideClientLookup || user?.role === 'client');

  // Search state for previous clients
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchBoxRef = useRef(null);

  // City search input filter
  const [citySearch, setCitySearch] = useState('');

  // UI feedback & modals
  const [actionFeedback, setActionFeedback] = useState(null);
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Client account registration with password prompt
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [clientPasswordInput, setClientPasswordInput] = useState('Client@123');
  const [showPasswordText, setShowPasswordText] = useState(false);

  // Client multi-profile state
  const [clientProfiles, setClientProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState('primary');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch client profiles when in client portal view
  useEffect(() => {
    if (shouldHideLookup) {
      async function loadProfiles() {
        try {
          const res = await API.getClientProfiles();
          if (res && res.profiles) {
            setClientProfiles(res.profiles);
          }
        } catch (err) {
          // ignore
        }
      }
      loadProfiles();
    }
  }, [shouldHideLookup]);

  const currentCountry = typeof clientData.country === 'object' && clientData.country !== null
    ? clientData.country.name || 'India'
    : (clientData.country || 'India');

  const currentState = typeof clientData.state === 'object' && clientData.state !== null
    ? clientData.state.name || 'Tamil Nadu'
    : (clientData.state || 'Tamil Nadu');

  // Country, State, City cascading lists
  const availableStates = useMemo(() => {
    return Object.keys(GEO_DATA[currentCountry] || {});
  }, [currentCountry]);

  const availableCities = useMemo(() => {
    return GEO_DATA[currentCountry]?.[currentState] || [];
  }, [currentCountry, currentState]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return availableCities;
    const q = citySearch.toLowerCase();
    return availableCities.filter(c => (c.name || '').toLowerCase().includes(q));
  }, [availableCities, citySearch]);

  // Handle previous client lookup search
  const handleClientSearch = async (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await API.searchClients(q);
      const list = Array.isArray(res) ? res : (res?.clients || []);
      setSearchResults(list);
      setShowDropdown(true);
    } catch (err) {
      console.warn('Failed to search clients:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectClient = (c) => {
    selectClient(c);
    setShowDropdown(false);
    setSearchQuery(`${c.name} (${c.mobile || c.dob || ''})`);
    setActionFeedback({
      type: 'success',
      message: isTa
        ? `வாடிக்கையாளர் "${c.name}" விவரங்கள் அனைத்து மாடியூல்களிலும் தானாக புதுப்பிக்கப்பட்டது!`
        : `Client "${c.name}" details loaded and synchronized across Horoscope, Search & Matchmaking!`
    });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleClearForNewProfile = () => {
    clearClientData();
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setActiveProfileId('new');
    setActionFeedback({
      type: 'info',
      message: isTa
        ? 'படிவம் அழிக்கப்பட்டது! புதிய விவரங்களை உள்ளிட்டு "Calculate & View" அல்லது "Save Client" கொடுக்கவும்.'
        : 'Form cleared! Enter new details; they will sync across all three modules.'
    });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleCountryChange = (cName) => {
    if (!cName) {
      updateFields({
        country: '',
        state: '',
        city: '',
        lat: '',
        lon: '',
        utcOffset: ''
      });
      setCitySearch('');
      return;
    }
    const states = Object.keys(GEO_DATA[cName] || {});
    const firstState = states[0] || '';
    const cities = GEO_DATA[cName]?.[firstState] || [];
    const firstCity = cities[0];

    updateFields({
      country: cName,
      state: firstState,
      city: firstCity ? firstCity.name : '',
      lat: firstCity ? firstCity.latDec : '',
      lon: firstCity ? firstCity.lonDec : '',
      utcOffset: firstCity && firstCity.tz ? `${firstCity.tz.startsWith('+') ? firstCity.tz.slice(1) : firstCity.tz} UTC` : '05:30 UTC'
    });
    setCitySearch('');
  };

  const handleStateChange = (sName) => {
    if (!sName) {
      updateFields({
        state: '',
        city: '',
        lat: '',
        lon: '',
        utcOffset: ''
      });
      setCitySearch('');
      return;
    }
    const cities = GEO_DATA[clientData.country]?.[sName] || [];
    const firstCity = cities[0];

    updateFields({
      state: sName,
      city: firstCity ? firstCity.name : '',
      lat: firstCity ? firstCity.latDec : clientData.lat,
      lon: firstCity ? firstCity.lonDec : clientData.lon,
      utcOffset: firstCity && firstCity.tz ? `${firstCity.tz.startsWith('+') ? firstCity.tz.slice(1) : firstCity.tz} UTC` : clientData.utcOffset
    });
    setCitySearch('');
  };

  const handleCityChange = (cityName) => {
    const cObj = availableCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    let newLat = clientData.lat;
    let newLon = clientData.lon;
    let newTz = clientData.utcOffset;

    if (cObj) {
      newLat = cObj.latDec;
      newLon = cObj.lonDec;
      if (cObj.tz) {
        const raw = cObj.tz.trim();
        newTz = `${raw.startsWith('+') ? raw.slice(1) : raw} UTC`;
      }
    }

    updateFields({
      city: cityName,
      lat: newLat,
      lon: newLon,
      utcOffset: newTz
    });
  };

  const handleCalculateClick = (e) => {
    if (e) e.preventDefault();
    if (!clientData.name?.trim() || !clientData.dob?.trim()) {
      setActionFeedback({
        type: 'error',
        message: isTa
          ? 'தயவுசெய்து வாடிக்கையாளர் பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.'
          : 'Please enter both Client Name and Date of Birth.'
      });
      setTimeout(() => setActionFeedback(null), 4000);
      return;
    }
    refreshCalculations();
    if (onCalculate) onCalculate();
    setActionFeedback({
      type: 'success',
      message: isTa
        ? 'திருக்கணித ஜாதகக் கணிப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!'
        : 'Horoscope calculations refreshed across all modules!'
    });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleCreateClientAccount = () => {
    if (!clientData.name?.trim()) {
      alert(isTa ? 'தயவுசெய்து முழு பெயரை உள்ளிடவும்.' : 'Please enter Full Name.');
      return;
    }
    const cleanMobile = clean10DigitMobile(clientData.mobile);
    if (!cleanMobile || cleanMobile.length !== 10) {
      alert(isTa ? 'தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setShowPasswordModal(true);
  };

  const handleConfirmCreateAccount = async () => {
    const cleanMobile = clean10DigitMobile(clientData.mobile);
    if (!clientPasswordInput.trim() || clientPasswordInput.length < 6) {
      alert(isTa ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்களாக இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
      return;
    }
    setIsRegistering(true);
    setShowPasswordModal(false);

    try {
      const time12Str = `${clientData.timeState?.hour || '12'}:${clientData.timeState?.minute || '00'}:${clientData.timeState?.second || '00'} ${clientData.timeState?.period || 'AM'}`;
      const payload = {
        name: clientData.name.trim(),
        mobile: cleanMobile,
        password: clientPasswordInput.trim(),
        dob: clientData.dob,
        dobTime12: time12Str,
        dobPlace: clientData.city,
        gender: clientData.gender || 'male',
        fatherName: clientData.father?.trim() || '',
        motherName: clientData.mother?.trim() || '',
        nativePlace: clientData.nativePlace?.trim() || '',
        country: clientData.country,
        state: clientData.state,
        lat: clientData.lat,
        lon: clientData.lon,
        utcOffset: clientData.utcOffset
      };

      const res = await API.registerClientFromAstrologer(payload);

      setReceiptModalData({
        client: res.client,
        plainPassword: clientPasswordInput.trim(),
        astrologer: res.astrologer,
        loginUrl: `${window.location.origin}/login`
      });

      refreshCalculations();
      setActionFeedback({
        type: 'success',
        message: isTa
          ? 'வாடிக்கையாளர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!'
          : 'Client account created successfully!'
      });
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      alert(isTa ? `கணக்கு உருவாக்க முடியவில்லை: ${err.message}` : `Failed to create account: ${err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div id="birth-intake-card" className="bg-white/95 dark:bg-[#251E1A] p-4 sm:p-6 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4 text-xs">
      {/* Header & Client Lookup Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-900/10 dark:border-amber-500/15 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">
            {module === 'search' || module === 'matchmaking' ? '🔍' : '📝'}
          </span>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B]">
                {module === 'search'
                  ? (isTa ? 'வாடிக்கையாளர் தேடல் (Client Mobile & Profile Lookup)' : 'Client Mobile & Profile Lookup')
                  : module === 'matchmaking'
                  ? (isTa ? 'வாடிக்கையாளர் தேடல் (Client Lookup for Matchmaking)' : 'Client Lookup for Matchmaking')
                  : (isTa ? 'பிறப்பு விவரப் படிவம் (Birth Details Intake)' : 'Birth Details Intake (Compute & Generate Pager)')}
              </h2>

              {/* + New Profile Button - ONLY for horoscope module */}
              {module === 'horoscope' && (
                <button
                  type="button"
                  onClick={handleClearForNewProfile}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  title={isTa ? 'படிவத்தை அழித்து புதிய விவரங்களை உள்ளிடவும்' : 'Clear all fields to enter a new client profile'}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isTa ? '+ புதிய சுயவிவரம் (New Profile)' : '+ New Profile'}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {module === 'search'
                ? (isTa
                    ? 'முந்தைய வாடிக்கையாளர் விவரங்களை மொபைல் எண், பெயர் அல்லது பிறந்த தேதி மூலம் தேடவும்.'
                    : 'Search existing clients by mobile number, name, DOB, or place to view active profile.')
                : module === 'matchmaking'
                ? (isTa
                    ? 'பொருத்தம் பார்க்க விரும்பும் வாடிக்கையாளரை தேடி தேர்வு செய்யவும்.'
                    : 'Search and select an active client for Kundli matchmaking comparison.')
                : (isTa
                    ? 'முந்தைய வாடிக்கையாளர் விவரங்களை தேடவும் அல்லது புதிய விவரங்களை உள்ளிடவும் (ஜாதகம், மொபைல் தேடல் & பொருத்தம் மூன்றுக்கும் தானாக இணையும்)'
                    : 'Search existing clients by mobile/name/dob/place, or enter new birth data (syncs automatically across Horoscope, Client Search & Matchmaking)')}
            </p>
          </div>
        </div>

        {/* Quick Badges: Time & Timezone - shown only in horoscope module */}
        {module === 'horoscope' && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-amber-900/10">
              🕒 {clientData.timeState?.hour || '12'}:{clientData.timeState?.minute || '00'}:{clientData.timeState?.second || '00'} {clientData.timeState?.period || 'AM'}
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-indigo-900/10">
              🌐 {clientData.utcOffset || '05:30 UTC'}
            </span>
          </div>
        )}
      </div>

      {/* Action feedback banner */}
      {actionFeedback && (
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
          actionFeedback.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : actionFeedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-900 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 font-medium">
            <span>{actionFeedback.type === 'error' ? '⚠️' : actionFeedback.type === 'success' ? '✓' : 'ℹ️'}</span>
            <span>{actionFeedback.message}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-stone-400 hover:text-stone-700 ml-2 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Previous Client Lookup Bar */}
      {!shouldHideLookup && (
        <div ref={searchBoxRef} className="relative">
          <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
            🔍 {isTa ? 'முந்தைய வாடிக்கையாளர் தேடல் (மொபைல் எண் அல்லது பெயர் + பிறந்த தேதி + இடம்):' : 'Previous Client Lookup (Search by Mobile No. or Name + D.O.B + Place):'}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleClientSearch(e); }}
                placeholder={isTa ? 'மொபைல் எண் அல்லது பெயர் + தேதி உள்ளிடவும்...' : 'Enter Mobile No. OR Name + D.O.B + Place...'}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-[#7A1A22] outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setShowDropdown(false); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleClientSearch}
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-[#7A1A22] hover:bg-[#99222C] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {isSearching ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>{isTa ? 'தேடுக' : 'Search'}</span>
            </button>
          </div>

          {/* Search Dropdown Results */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-[#1E1815] rounded-2xl border border-amber-900/20 dark:border-amber-500/20 shadow-2xl max-h-60 overflow-y-auto divide-y divide-amber-900/10 dark:divide-amber-500/10">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500">
                  {isTa ? 'வாடிக்கையாளர் கிடைக்கவில்லை' : 'No clients found matching query'}
                </div>
              ) : (
                searchResults.map(c => (
                  <button
                    key={c.id || c.mobile}
                    type="button"
                    onClick={() => handleSelectClient(c)}
                    className="w-full text-left p-2.5 sm:p-3 hover:bg-amber-50/70 dark:hover:bg-stone-800 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 group-hover:underline flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{c.name}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2 mt-0.5">
                        <span>📱 {c.mobile}</span>
                        <span>•</span>
                        <span>📅 {c.dob} ({c.dobTime})</span>
                        {c.dobPlace && (
                          <>
                            <span>•</span>
                            <span>📍 {c.dobPlace}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shrink-0">
                      {isTa ? 'தேர்வு செய்க' : 'Select'}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Intake Form - ONLY rendered for horoscope module */}
      {module === 'horoscope' && (
        <form onSubmit={handleCalculateClick} className="space-y-3 pt-1">
        {/* ROW 1: Name, DOB, 12-Hour AM/PM Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Full Name */}
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <User className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
              {isTa ? 'பெயர் (Full Name)' : 'Full Name'}
            </label>
            <input
              type="text"
              value={clientData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder={isTa ? 'முழு பெயரை உள்ளிடவும்' : 'Enter Full Name'}
              required
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22]"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
              {isTa ? 'பிறந்த தேதி (Date of Birth)' : 'Date of Birth'}
            </label>
            <input
              type="date"
              value={clientData.dob}
              onChange={e => updateField('dob', e.target.value)}
              required
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22]"
            />
          </div>

          {/* 12-Hour AM/PM Time (Hours, Mins, Secs, Period) */}
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
              {isTa ? 'பிறந்த நேரம் (12-Hour AM/PM)' : 'Birth Time (12-Hour AM/PM)'}
            </label>
            <div className="flex items-center gap-1">
              <select
                value={clientData.timeState?.hour || '12'}
                onChange={e => updateField('timeState', { ...clientData.timeState, hour: e.target.value })}
                className="bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:outline-none"
              >
                {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="font-bold text-stone-400">:</span>
              <select
                value={clientData.timeState?.minute || '00'}
                onChange={e => updateField('timeState', { ...clientData.timeState, minute: e.target.value })}
                className="bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:outline-none"
              >
                {MINUTES_60.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="font-bold text-stone-400">:</span>
              <select
                value={clientData.timeState?.second || '00'}
                onChange={e => updateField('timeState', { ...clientData.timeState, second: e.target.value })}
                className="bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:outline-none"
              >
                {SECONDS_60.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button
                type="button"
                onClick={() => updateField('timeState', {
                  ...clientData.timeState,
                  period: clientData.timeState?.period === 'AM' ? 'PM' : 'AM'
                })}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  clientData.timeState?.period === 'AM'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-indigo-900 text-amber-200 shadow-xs'
                }`}
              >
                {clientData.timeState?.period || 'AM'}
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Country, State, City/Place */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Country */}
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <Globe className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
              {isTa ? 'நாடு (Country)' : 'Country'}
            </label>
            <select
              value={currentCountry}
              onChange={e => handleCountryChange(e.target.value)}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="">{isTa ? '-- நாடு தேர்ந்தெடுக்கவும் --' : '-- Select Country --'}</option>
              {COUNTRIES.map(c => {
                const cName = typeof c === 'object' && c !== null ? c.name : c;
                const cCode = typeof c === 'object' && c !== null ? c.code : c;
                return (
                  <option key={cCode || cName} value={cName}>
                    {cName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <Building className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
              {isTa ? 'மாநிலம் (State)' : 'State'}
            </label>
            <select
              value={currentState}
              onChange={e => handleStateChange(e.target.value)}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="">{isTa ? '-- மாநிலம் தேர்ந்தெடுக்கவும் --' : '-- Select State --'}</option>
              {availableStates.map(s => {
                const sName = typeof s === 'object' && s !== null ? s.name || String(s) : s;
                return (
                  <option key={sName} value={sName}>
                    {sName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* City / Place */}
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
              {isTa ? 'பிறந்த இடம் (City / Place)' : 'City / Place'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={citySearch || clientData.city || ''}
                onChange={e => {
                  setCitySearch(e.target.value);
                  updateField('city', e.target.value);
                }}
                placeholder={isTa ? 'ஊரைத் தேடுக...' : 'Search place...'}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
              />
              {citySearch && filteredCities.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-[#1E1815] rounded-xl border border-stone-300 dark:border-stone-700 max-h-48 overflow-y-auto shadow-xl">
                  {filteredCities.slice(0, 15).map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        handleCityChange(c.name);
                        setCitySearch('');
                      }}
                      className="w-full text-left p-2 hover:bg-amber-50 dark:hover:bg-stone-800 text-xs flex justify-between cursor-pointer"
                    >
                      <span className="font-bold text-stone-900 dark:text-stone-100">{c.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">({c.latDec.toFixed(2)}°, {c.lonDec.toFixed(2)}°)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 3: Latitude, Longitude, UTC Offset */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold mb-1 opacity-90">
              {isTa ? 'அட்சரேகை (Latitude °N)' : 'Latitude (°N)'}
            </label>
            <input
              type="text"
              value={clientData.lat !== undefined && clientData.lat !== null ? clientData.lat : ''}
              onChange={e => updateField('lat', e.target.value)}
              placeholder="11.6643"
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90">
              {isTa ? 'தீர்க்கரேகை (Longitude °E)' : 'Longitude (°E)'}
            </label>
            <input
              type="text"
              value={clientData.lon !== undefined && clientData.lon !== null ? clientData.lon : ''}
              onChange={e => updateField('lon', e.target.value)}
              placeholder="78.1460"
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90">
              {isTa ? 'நேர மண்டலம் (UTC Offset)' : 'UTC Offset (Timezone)'}
            </label>
            <input
              type="text"
              value={clientData.utcOffset || ''}
              onChange={e => updateField('utcOffset', e.target.value)}
              placeholder="05:30 UTC"
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* ROW 4: Father, Mother, Native Place, Mobile No. */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-bold mb-1 opacity-90">
              <User className="w-3.5 h-3.5 inline mr-1 text-purple-700" />
              {isTa ? 'தந்தை பெயர் (Father)' : "Father's Name"}
            </label>
            <input
              type="text"
              value={clientData.father}
              onChange={e => updateField('father', e.target.value)}
              placeholder={isTa ? 'தந்தை பெயர்' : "Enter Father's Name"}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90">
              <User className="w-3.5 h-3.5 inline mr-1 text-rose-600" />
              {isTa ? 'தாய் பெயர் (Mother)' : "Mother's Name"}
            </label>
            <input
              type="text"
              value={clientData.mother}
              onChange={e => updateField('mother', e.target.value)}
              placeholder={isTa ? 'தாய் பெயர்' : "Enter Mother's Name"}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-emerald-700" />
              {isTa ? 'சொந்த ஊர் (Native Place)' : 'Native Place / Town'}
            </label>
            <input
              type="text"
              value={clientData.nativePlace}
              onChange={e => updateField('nativePlace', e.target.value)}
              placeholder={isTa ? 'சொந்த ஊர்' : 'Native Place / Town'}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90">
              <Phone className="w-3.5 h-3.5 inline mr-1 text-blue-700" />
              {isTa ? 'வாடிக்கையாளர் மொபைல்' : 'Client Mobile No.'}
            </label>
            <div className="flex items-center">
              <span className="bg-stone-200 dark:bg-stone-800 px-2.5 py-2 rounded-l-xl text-xs font-bold text-stone-600 dark:text-stone-400 border border-r-0 border-stone-300 dark:border-stone-700">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={clean10DigitMobile(clientData.mobile)}
                onChange={e => updateField('mobile', clean10DigitMobile(e.target.value))}
                placeholder="----------"
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-r-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-900/10 dark:border-amber-500/15">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">⚡</span>
            <span>{isTa ? 'சுத்த திருக்கணித பராசர முறையில் கணிக்கப்படுகிறது.' : 'Calculated strictly following pure Thirukanitha Drik Ganitha ephemeris.'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Button 1: Calculate & View Horoscope */}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] hover:from-[#5C1017] hover:to-[#7A1A22] text-amber-100 text-xs font-bold shadow-md shadow-red-950/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTa ? 'ஜாதகம் கணிக்க & பார்க்க' : 'Calculate & View Horoscope'}</span>
            </button>

            {/* Button 2 FOR ASTROLOGER: Create Client Account & Share */}
            {!shouldHideLookup && (
              <button
                type="button"
                onClick={handleCreateClientAccount}
                disabled={isRegistering}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-1.5"
                title="Save client birth details, set password, and create client login account"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isRegistering ? (isTa ? 'சேமிக்கப்படுகிறது...' : 'Saving...') : (isTa ? 'கிளையண்ட் கணக்கு & பகிர்வு' : 'Create Client Account & Share')}</span>
              </button>
            )}
          </div>
        </div>
      </form>
      )}

      {/* Password Modal when Astrologer clicks 'Create Client Account & Share' */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1E1815] border border-amber-900/20 dark:border-amber-500/20 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-500/15">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#7A1A22] dark:text-[#E8838B]">
                    {isTa ? 'வாடிக்கையாளர் உள்நுழைவு கடவுச்சொல்' : 'Set Client Login Password'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isTa ? 'புதிய வாடிக்கையாளர் கணக்கிற்கான கடவுச்சொல்லை அமைக்கவும்' : 'Set credentials for client portal login'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Summary Box */}
            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400 font-medium">{isTa ? 'வாடிக்கையாளர் பெயர்:' : 'Client Name:'}</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{clientData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400 font-medium">{isTa ? 'உள்நுழைவு மொபைல் (பயனர்பெயர்):' : 'Username (Mobile):'}</span>
                <span className="font-mono font-black text-amber-800 dark:text-amber-400 bg-white dark:bg-stone-900 px-2 py-0.5 rounded-lg border border-amber-900/15">
                  {clean10DigitMobile(clientData.mobile)}
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>{isTa ? 'கடவுச்சொல் (Password):' : 'Client Password:'}</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  value={clientPasswordInput}
                  onChange={(e) => setClientPasswordInput(e.target.value)}
                  placeholder={isTa ? 'கடவுச்சொல்லை உள்ளிடவும் (குறைந்தது 6 எழுத்துக்கள்)' : 'Enter password (min 6 characters)'}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
                  title={showPasswordText ? 'Hide password' : 'Show password'}
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                {isTa
                  ? 'வாடிக்கையாளர் இந்த 10-இலக்க மொபைல் எண்ணை பயனர்பெயராகவும், இந்த கடவுச்சொல்லையும் பயன்படுத்தி உள்நுழையலாம்.'
                  : 'The client will use their 10-digit mobile number as username and this password to log in to the Client Portal.'}
              </p>
            </div>

            {/* Dialog Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-900/10 dark:border-amber-500/15">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {isTa ? 'ரத்து செய்' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmCreateAccount}
                disabled={isRegistering}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black shadow-md shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isRegistering ? (isTa ? 'உருவாக்கப்படுகிறது...' : 'Creating...') : (isTa ? 'கணக்கை உருவாக்கு & ரசீது காட்டு' : 'Create Account & Generate Receipt')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Receipt Modal with WhatsApp & Print */}
      {receiptModalData && (
        <ClientRegistrationReceiptModal
          data={receiptModalData}
          onClose={() => setReceiptModalData(null)}
        />
      )}
    </div>
  );
}
