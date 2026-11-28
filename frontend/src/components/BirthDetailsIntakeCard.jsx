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
  UserPlus,
  Compass
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useClientBirth, to24HourTime } from '../context/ClientBirthContext';
import { API } from '../api';
import ClientRegistrationReceiptModal from './ClientRegistrationReceiptModal';
import { COUNTRIES, GEO_DATA, parseCoordinateToDec, lookupCoordinates } from '../data/geoCoordinates';
import { clean10DigitMobile } from '../utils/phoneUtils';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function BirthDetailsIntakeCard({
  module = 'horoscope', // 'horoscope' | 'search' | 'matchmaking'
  onCalculate,
  hideClientLookup = false,
  onClientSaved
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

  // City search autocomplete state
  const [cityInput, setCityInput] = useState(clientData.city || 'Hosur');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityBoxRef = useRef(null);

  // Sync internal city input when clientData.city changes externally
  useEffect(() => {
    if (clientData.city !== undefined && clientData.city !== cityInput) {
      setCityInput(clientData.city || '');
    }
  }, [clientData.city]);

  // UI feedback & modals
  const [actionFeedback, setActionFeedback] = useState(null);
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Client account registration with password prompt
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [clientPasswordInput, setClientPasswordInput] = useState('Client@123');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [sendWhatsAppOnCreate, setSendWhatsAppOnCreate] = useState(true);

  // Client multi-profile state
  const [clientProfiles, setClientProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState('primary');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Close search and city dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target)) {
        setShowCityDropdown(false);
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

  // Instant Letter-by-Letter city matching strictly for the selected state
  const citySuggestions = useMemo(() => {
    const q = (cityInput || '').trim().toLowerCase();
    const stateCities = GEO_DATA[currentCountry]?.[currentState] || [];

    // If query is empty, show top 30 cities for current state
    if (!q) {
      return stateCities.slice(0, 30);
    }

    // 1. Cities in current state starting with query letter(s)
    const startsInState = stateCities.filter(c => (c.name || '').toLowerCase().startsWith(q));
    // 2. Cities in current state containing query letter(s)
    const containsInState = stateCities.filter(c => !(c.name || '').toLowerCase().startsWith(q) && (c.name || '').toLowerCase().includes(q));

    // Strictly return only cities from the selected state
    return [...startsInState, ...containsInState].slice(0, 100);
  }, [cityInput, currentCountry, currentState]);

  // Search debounce timer ref
  const searchTimeoutRef = useRef(null);

  // Core search executor: searches matching clients and displays results dropdown
  const performClientSearch = async (queryText) => {
    const q = (typeof queryText === 'string' ? queryText : searchQuery).trim();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const res = await API.searchClients(q);
      const list = Array.isArray(res) ? res : (res?.clients || []);
      setSearchResults(list);
      setShowDropdown(true);
    } catch (err) {
      console.warn('Real-time client search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Immediate search trigger as the user types even a single letter/digit
  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    // Immediately open dropdown and display loading status
    setShowDropdown(true);
    setIsSearching(true);

    // Debounce fast typing with 60ms (imperceptible delay, instant update)
    searchTimeoutRef.current = setTimeout(() => {
      performClientSearch(val);
    }, 60);
  };

  // Handle manual search (pressing Enter or clicking Search button)
  const handleClientSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    await performClientSearch(searchQuery);
  };

  const handleSelectClient = (c) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    selectClient(c);
    setShowDropdown(false);
    setIsSearching(false);
    setSearchQuery(`${c.name} (${c.mobile || c.dob || ''})`);
    setActionFeedback({
      type: 'success',
      message: isTa
        ? `வாடிக்கையாளர் "${c.name}" விவரங்கள் அனைத்து மாடியூல்களிலும் தானாக புதுப்பிக்கப்பட்டது!`
        : `Client "${c.name}" details loaded and synchronized across Horoscope, Client Horoscope History & Matchmaking!`
    });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleClearForNewProfile = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    clearClientData();
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setIsSearching(false);
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
      setCityInput('');
      return;
    }
    const states = Object.keys(GEO_DATA[cName] || {});
    const firstState = states[0] || '';
    const cities = GEO_DATA[cName]?.[firstState] || [];
    const firstCity = cities[0];

    setCityInput(firstCity ? firstCity.name : '');
    updateFields({
      country: cName,
      state: firstState,
      city: firstCity ? firstCity.name : '',
      lat: firstCity ? firstCity.latDec : '',
      lon: firstCity ? firstCity.lonDec : '',
      utcOffset: firstCity && firstCity.tz ? `${firstCity.tz.startsWith('+') ? firstCity.tz.slice(1) : firstCity.tz} UTC` : '05:30 UTC'
    });
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
      setCityInput('');
      return;
    }
    const cities = GEO_DATA[clientData.country]?.[sName] || [];
    const firstCity = cities[0];

    setCityInput(firstCity ? firstCity.name : '');
    updateFields({
      state: sName,
      city: firstCity ? firstCity.name : '',
      lat: firstCity ? firstCity.latDec : clientData.lat,
      lon: firstCity ? firstCity.lonDec : clientData.lon,
      utcOffset: firstCity && firstCity.tz ? `${firstCity.tz.startsWith('+') ? firstCity.tz.slice(1) : firstCity.tz} UTC` : clientData.utcOffset
    });
  };

  const handleSelectCitySuggestion = (c) => {
    const cityName = c.name;

    const latVal = c.latDec !== undefined ? c.latDec : c.lat;
    const lonVal = c.lonDec !== undefined ? c.lonDec : c.lon;
    const tzVal = c.tz ? `${c.tz.startsWith('+') ? c.tz.slice(1) : c.tz} UTC` : '05:30 UTC';

    setCityInput(cityName);
    setShowCityDropdown(false);

    updateFields({
      state: currentState,
      city: cityName,
      lat: latVal,
      lon: lonVal,
      utcOffset: tzVal
    });
  };

  const handleCityChange = (cityName) => {
    if (!cityName) {
      updateFields({ city: '', lat: '', lon: '', utcOffset: '' });
      setCityInput('');
      return;
    }
    const cObj = availableCities.find(c => c.name.toLowerCase() === cityName.toLowerCase()) || lookupCoordinates(currentCountry, currentState, cityName);
    let newLat = clientData.lat;
    let newLon = clientData.lon;
    let newTz = clientData.utcOffset;

    if (cObj) {
      newLat = cObj.latDec !== undefined ? cObj.latDec : cObj.lat;
      newLon = cObj.lonDec !== undefined ? cObj.lonDec : cObj.lon;
      if (cObj.tz) {
        const raw = cObj.tz.trim();
        newTz = `${raw.startsWith('+') ? raw.slice(1) : raw} UTC`;
      }
    }

    setCityInput(cityName);
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
      const time24Str = to24HourTime(clientData.timeState?.hour, clientData.timeState?.minute, clientData.timeState?.second, clientData.timeState?.period);
      const placeStr = (typeof clientData.city === 'object' ? clientData.city?.name : (clientData.city || clientData.nativePlace || clientData.place || clientData.placeName || 'Salem')).trim();
      const dobStr = (clientData.dob || '1995-01-01').trim();

      const payload = {
        name: clientData.name.trim(),
        mobile: cleanMobile,
        username: cleanMobile,
        password: clientPasswordInput.trim(),
        initialPassword: clientPasswordInput.trim(),
        dob: dobStr,
        dobTime: time24Str || time12Str,
        dobTime12: time12Str,
        dobPlace: placeStr,
        city: placeStr,
        gender: clientData.gender || 'male',
        fatherName: clientData.father?.trim() || '',
        motherName: clientData.mother?.trim() || '',
        nativePlace: clientData.nativePlace?.trim() || placeStr,
        country: currentCountry || 'India',
        state: currentState || 'Tamil Nadu',
        lat: clientData.lat || '11.6643',
        lon: clientData.lon || '78.1460',
        utcOffset: clientData.utcOffset || '05:30 UTC'
      };

      const registerFn = API.registerClientFromAstrologer || API.registerClientByAstrologer;
      const res = await registerFn(payload);

      // Notify parent components and global event listeners immediately
      if (typeof onClientSaved === 'function') {
        try {
          onClientSaved(res);
        } catch (callbackErr) {
          console.error('onClientSaved callback error:', callbackErr);
        }
      }
      window.dispatchEvent(new CustomEvent('astrojit:client-registered', { detail: res }));
      window.dispatchEvent(new CustomEvent('astrojit:refresh-referred-clients', { detail: res }));

      const receiptPayload = res.receipt || {
        client: res.client || payload,
        credentials: {
          username: cleanMobile,
          initialPassword: clientPasswordInput.trim(),
          portalUrl: `${window.location.origin}/login`
        },
        astrologer: user || {},
        loginUrl: `${window.location.origin}/login`
      };

      if (res.client) {
        selectClient(res.client);
      }

      setReceiptModalData(receiptPayload);

      // WhatsApp Message Formulation
      const cleanPhone = cleanMobile.replace(/[^0-9]/g, '');
      const phoneParam = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const loginUrl = `${window.location.origin}/login`;
      const waText = `🕉️ *ASTROJIT VEDIC ASTROLOGY - CLIENT REGISTRATION & LOGIN CREDENTIALS*

வணக்கம் / Greetings *${payload.name}*,
உங்கள் வேத ஜாதகக் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டுள்ளது!
Your Astrojit Client Portal account has been created successfully.

----------------------------------------
🔐 *YOUR LOGIN DETAILS*
*Portal URL:* ${loginUrl}
*Username (Mobile):* ${cleanMobile}
*Password:* ${clientPasswordInput.trim()}

----------------------------------------
👤 *NATIVE DETAILS*
*DOB:* ${dobStr} | ${time12Str}
*Place:* ${placeStr}
*Client Code:* ${receiptPayload.clientCode || 'CLI-' + cleanMobile.slice(-4)}

*Astrologer:* ${receiptPayload.astrologer?.name || user?.name || 'Astrojit Astrologer'}
*Contact:* ${receiptPayload.astrologer?.mobile || user?.mobile || ''}

_You can log in anytime to view your complete Vedic Horoscope, Predictions, Daily Panchangam, and Matchmaking services._
Shubham Bhavatu! 🙏`;

      const waUrl = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(waText)}`;

      // WhatsApp auto-open if enabled
      if (sendWhatsAppOnCreate) {
        window.open(waUrl, '_blank');
      }

      refreshCalculations();
      setActionFeedback({
        type: 'success',
        message: isTa
          ? `வாடிக்கையாளர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! (${cleanMobile})`
          : `Client account created successfully for ${payload.name} (${cleanMobile})!`,
        whatsappUrl: waUrl
      });
      setTimeout(() => setActionFeedback(null), 8000);
    } catch (err) {
      alert(isTa ? `கணக்கு உருவாக்க முடியவில்லை: ${err.message}` : `Failed to create account: ${err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSaveClientProfile = async () => {
    if (!clientData.name?.trim()) {
      alert(isTa ? 'தயவுசெய்து முழு பெயரை உள்ளிடவும்.' : 'Please enter Full Name.');
      return;
    }
    setIsRegistering(true);

    try {
      const time12Str = `${clientData.timeState?.hour || '12'}:${clientData.timeState?.minute || '00'}:${clientData.timeState?.second || '00'} ${clientData.timeState?.period || 'AM'}`;
      const time24Str = to24HourTime(clientData.timeState?.hour, clientData.timeState?.minute, clientData.timeState?.second, clientData.timeState?.period);
      const placeStr = (typeof clientData.city === 'object' ? clientData.city?.name : (clientData.city || clientData.nativePlace || clientData.place || clientData.placeName || 'Salem')).trim();
      const dobStr = (clientData.dob || '1995-01-01').trim();

      const payload = {
        name: clientData.name.trim(),
        mobile: '',
        username: '',
        dob: dobStr,
        dobTime: time24Str || time12Str,
        dobTime12: time12Str,
        dobPlace: placeStr,
        city: placeStr,
        gender: clientData.gender || 'male',
        fatherName: clientData.father?.trim() || '',
        motherName: clientData.mother?.trim() || '',
        nativePlace: clientData.nativePlace?.trim() || placeStr,
        country: currentCountry || 'India',
        state: currentState || 'Tamil Nadu',
        lat: clientData.lat || '11.6643',
        lon: clientData.lon || '78.1460',
        utcOffset: clientData.utcOffset || '05:30 UTC'
      };

      const registerFn = API.registerClientFromAstrologer || API.registerClientByAstrologer;
      const res = await registerFn(payload);

      // Notify parent components and global event listeners immediately
      if (typeof onClientSaved === 'function') {
        try {
          onClientSaved(res);
        } catch (callbackErr) {
          console.error('onClientSaved callback error:', callbackErr);
        }
      }
      window.dispatchEvent(new CustomEvent('astrojit:client-registered', { detail: res }));
      window.dispatchEvent(new CustomEvent('astrojit:refresh-referred-clients', { detail: res }));

      const savedClient = res.client || payload;
      const clientCode = savedClient.clientCode || res.receipt?.clientCode || '';

      updateField('clientCode', clientCode);
      if (res.client) {
        selectClient(res.client);
      }

      refreshCalculations();
      setActionFeedback({
        type: 'success',
        message: isTa
          ? `வாடிக்கையாளர் சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது! (Client ID: ${clientCode})`
          : `Client profile saved successfully with Client ID: ${clientCode}! (Mobile number can be added later in Referrals)`,
      });
      setTimeout(() => setActionFeedback(null), 6000);
    } catch (err) {
      alert(isTa ? `சுயவிவரம் சேமிக்க முடியவில்லை: ${err.message}` : `Failed to save profile: ${err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const hasValidMobile = Boolean(clean10DigitMobile(clientData.mobile)?.length === 10);

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
                  ? (isTa ? 'வாடிக்கையாளர் ஜாதக வரலாறு (Client Horoscope History)' : 'Client Horoscope History')
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
          </div>
        </div>
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
          <div className="flex items-center gap-2">
            {actionFeedback.whatsappUrl && (
              <a
                href={actionFeedback.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
              >
                <span>📲</span>
                <span>{isTa ? 'வாட்ஸ்அப் அனுப்புக' : 'WhatsApp Client'}</span>
              </a>
            )}
            <button onClick={() => setActionFeedback(null)} className="text-stone-400 hover:text-stone-700 ml-1 font-bold cursor-pointer">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Previous Client Lookup Bar */}
      {!shouldHideLookup && (
        <div ref={searchBoxRef} className="relative z-20">
          <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
            🔍 {isTa ? 'முந்தைய வாடிக்கையாளர் தேடல் (Client ID CLI-..., மொபைல், பெயர், பிறந்த தேதி, இடம்):' : 'Previous Client Lookup (Search by Client ID CLI-..., Mobile No., Name, D.O.B or Place):'}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => { if (searchQuery.trim().length > 0) performClientSearch(searchQuery); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleClientSearch(e); }}
                placeholder={isTa ? 'Client ID (CLI-...), மொபைல் அல்லது பெயர் + தேதி உள்ளிடவும்...' : 'Enter Client ID (CLI-...), Mobile No., Name + D.O.B + Place...'}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-[#7A1A22] outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                    setIsSearching(false);
                  }}
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
          {showDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-20 bg-white dark:bg-[#1E1815] rounded-2xl border border-amber-900/20 dark:border-amber-500/20 shadow-2xl max-h-72 overflow-y-auto divide-y divide-amber-900/10 dark:divide-amber-500/10">
              {isSearching && searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#7A1A22]" />
                  <span>{isTa ? 'தேடப்படுகிறது...' : `Searching...`}</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500">
                  {isTa ? `"${searchQuery}" க்கு வாடிக்கையாளர் கிடைக்கவில்லை` : `No clients found matching "${searchQuery}"`}
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
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 group-hover:underline flex items-center gap-1.5 flex-wrap">
                        <User className="w-3.5 h-3.5" />
                        <span>{c.name}</span>
                        {c.clientCode && (
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                            {c.clientCode}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2 mt-0.5">
                        {c.mobile ? <span>📱 {c.mobile}</span> : <span className="text-amber-700 dark:text-amber-400 italic">No mobile</span>}
                        {c.dob && (
                          <>
                            <span>•</span>
                            <span>📅 {c.dob} {c.dobTime ? `(${c.dobTime})` : ''}</span>
                          </>
                        )}
                        {(c.dobPlace || c.nativePlace || c.city) && (
                          <>
                            <span>•</span>
                            <span>📍 {c.dobPlace || c.nativePlace || c.city}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Full Name */}
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <User className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
              {isTa ? 'பெயர்' : 'Full Name'}
            </label>
            <input
              type="text"
              value={clientData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder={isTa ? 'முழு பெயரை உள்ளிடவும்' : 'Enter Full Name'}
              required
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22] dark:focus:border-amber-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
              {isTa ? 'பிறந்த தேதி' : 'Date of Birth'}
            </label>
            <input
              type="date"
              value={clientData.dob}
              onChange={e => updateField('dob', e.target.value)}
              required
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22] dark:focus:border-amber-500"
            />
          </div>

          {/* 12-Hour AM/PM Time (Hours, Mins, Secs, Period) */}
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
              {isTa ? 'பிறந்த நேரம் (12 மணி AM/PM)' : 'Birth Time (12-Hour AM/PM)'}
            </label>
            <div className="flex flex-wrap items-center gap-1">
              <select
                value={clientData.timeState?.hour || '12'}
                onChange={e => updateField('timeState', { ...clientData.timeState, hour: e.target.value })}
                className="bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:outline-none"
              >
                {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="font-bold text-stone-400">:</span>
              <select
                value={clientData.timeState?.minute || '00'}
                onChange={e => updateField('timeState', { ...clientData.timeState, minute: e.target.value })}
                className="bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:outline-none"
              >
                {MINUTES_60.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="font-bold text-stone-400">:</span>
              <select
                value={clientData.timeState?.second || '00'}
                onChange={e => updateField('timeState', { ...clientData.timeState, second: e.target.value })}
                className="bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:outline-none"
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

        {/* ROW 1.5: Gender & Chart Format (South Indian Box / North Indian Diamond) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/60 dark:bg-stone-900/60 p-2.5 rounded-xl border border-amber-900/10 dark:border-amber-500/15">
          {/* Gender Selector */}
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <User className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
              {isTa ? 'பாலினம்' : 'Gender'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('gender', 'male')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  (clientData.gender || 'male') === 'male'
                    ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>👨</span>
                <span>{isTa ? 'ஆண்' : 'Male'}</span>
              </button>
              <button
                type="button"
                onClick={() => updateField('gender', 'female')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  clientData.gender === 'female'
                    ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>👩</span>
                <span>{isTa ? 'பெண்' : 'Female'}</span>
              </button>
            </div>
          </div>

          {/* Chart Format / Style (South Indian / North Indian) */}
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <Compass className="w-3.5 h-3.5 inline mr-1 text-amber-700 dark:text-amber-400" />
              {isTa ? 'ஜாதக சக்கர வடிவம்' : 'Chart Format / System'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('chartStyle', 'south')}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  (clientData.chartStyle || 'south') === 'south'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50'
                }`}
                title={isTa ? 'தென்னிந்திய கட்டச் சக்கரம்' : 'South Indian Square Box Chart'}
              >
                <span>⏹️</span>
                <span>{isTa ? 'தென்னிந்தியா' : 'South Indian'}</span>
              </button>
              <button
                type="button"
                onClick={() => updateField('chartStyle', 'north')}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  clientData.chartStyle === 'north'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50'
                }`}
                title={isTa ? 'வடஇந்திய வைரச் சக்கரம் (குண்டலி)' : 'North Indian Diamond Chart (Kundli)'}
              >
                <span>💠</span>
                <span>{isTa ? 'வடஇந்தியா' : 'North Indian'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Country, State, City/Place */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Country */}
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <Globe className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
              {isTa ? 'நாடு' : 'Country'}
            </label>
            <select
              value={currentCountry}
              onChange={e => handleCountryChange(e.target.value)}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
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
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <Building className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
              {isTa ? 'மாநிலம்' : 'State'}
            </label>
            <select
              value={currentState}
              onChange={e => handleStateChange(e.target.value)}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
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

          {/* City / Place - Manual search by letter with instant results dropdown */}
          <div ref={cityBoxRef} className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold opacity-90 text-stone-800 dark:text-stone-200">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22] dark:text-amber-400" />
                {isTa ? 'பிறந்த இடம்' : 'City / Place'}
              </label>
              {showCityDropdown && citySuggestions.length > 0 && (
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                  {citySuggestions.length} {isTa ? 'ஊர்கள்' : 'cities'}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={cityInput}
                onChange={e => {
                  const val = e.target.value;
                  setCityInput(val);
                  updateField('city', val);
                  setShowCityDropdown(true);

                  // If exact match found in current state, auto-update coordinates as they type
                  const exact = (GEO_DATA[currentCountry]?.[currentState] || []).find(
                    c => c.name.toLowerCase() === val.trim().toLowerCase()
                  );
                  if (exact) {
                    updateFields({
                      lat: exact.latDec !== undefined ? exact.latDec : exact.lat,
                      lon: exact.lonDec !== undefined ? exact.lonDec : exact.lon
                    });
                  }
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder={isTa ? 'ஊர் பெயர் தட்டச்சு செய்க (எ.கா. S, M, C, H...)' : 'Type city name (e.g. S, M, C, H...)'}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold focus:outline-none focus:border-[#7A1A22] dark:focus:border-amber-500 shadow-2xs"
                autoComplete="off"
              />

              {cityInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCityInput('');
                    updateField('city', '');
                    setShowCityDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold cursor-pointer"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Letter-by-Letter Auto-Suggestions Dropdown */}
            {showCityDropdown && citySuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1E1815] border border-amber-900/20 dark:border-amber-500/30 rounded-xl shadow-2xl z-20 max-h-56 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-1.5 bg-amber-50/70 dark:bg-stone-900/80 text-[10px] text-amber-900 dark:text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between border-b border-amber-100 dark:border-stone-800">
                  <span>
                    {cityInput.trim()
                      ? `${isTa ? 'பொருந்தும் ஊர்கள்' : 'Matching Cities'} (${citySuggestions.length})`
                      : `${currentState} (${citySuggestions.length})`}
                  </span>
                  <span className="text-[9px] text-stone-400">
                    {isTa ? 'கிளிக் செய்து தேர்ந்தெடுக்கவும்' : 'Click to select'}
                  </span>
                </div>
                {citySuggestions.map((item, idx) => {
                  const isSelected = (clientData.city || '').toLowerCase() === item.name.toLowerCase();
                  return (
                    <button
                      key={`${item.name}-${idx}`}
                      type="button"
                      onClick={() => handleSelectCitySuggestion(item)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50/80 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100/70 dark:bg-amber-900/30 font-bold text-stone-950 dark:text-stone-100'
                          : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#7A1A22] dark:text-amber-400 shrink-0" />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                        ({typeof item.latDec === 'number' ? item.latDec.toFixed(4) : item.lat}°, {typeof item.lonDec === 'number' ? item.lonDec.toFixed(4) : item.lon}°)
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ROW 3: Latitude, Longitude, UTC Offset */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              {isTa ? 'அட்சரேகை (°N)' : 'Latitude (°N)'}
            </label>
            <input
              type="text"
              value={clientData.lat !== undefined && clientData.lat !== null ? clientData.lat : ''}
              onChange={e => updateField('lat', e.target.value)}
              placeholder="11.6643"
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              {isTa ? 'தீர்க்கரேகை (°E)' : 'Longitude (°E)'}
            </label>
            <input
              type="text"
              value={clientData.lon !== undefined && clientData.lon !== null ? clientData.lon : ''}
              onChange={e => updateField('lon', e.target.value)}
              placeholder="78.1460"
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              {isTa ? 'நேர மண்டலம் (UTC)' : 'UTC Offset (Timezone)'}
            </label>
            <input
              type="text"
              value={clientData.utcOffset || ''}
              onChange={e => updateField('utcOffset', e.target.value)}
              placeholder="05:30 UTC"
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* ROW 4: Father, Mother, Native Place, Mobile No. (All Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <User className="w-3.5 h-3.5 inline mr-1 text-purple-700 dark:text-purple-400" />
              {isTa ? 'தந்தை பெயர் (விருப்பத்தேர்வு)' : "Father's Name (Optional)"}
            </label>
            <input
              type="text"
              value={clientData.father}
              onChange={e => updateField('father', e.target.value)}
              placeholder={isTa ? 'தந்தை பெயர் (விருப்பத்தேர்வு)' : "Father's Name (Optional)"}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <User className="w-3.5 h-3.5 inline mr-1 text-rose-600 dark:text-rose-400" />
              {isTa ? 'தாய் பெயர் (விருப்பத்தேர்வு)' : "Mother's Name (Optional)"}
            </label>
            <input
              type="text"
              value={clientData.mother}
              onChange={e => updateField('mother', e.target.value)}
              placeholder={isTa ? 'தாய் பெயர் (விருப்பத்தேர்வு)' : "Mother's Name (Optional)"}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-emerald-700 dark:text-emerald-400" />
              {isTa ? 'சொந்த ஊர் (விருப்பத்தேர்வு)' : 'Native Place / Town (Optional)'}
            </label>
            <input
              type="text"
              value={clientData.nativePlace}
              onChange={e => updateField('nativePlace', e.target.value)}
              placeholder={isTa ? 'சொந்த ஊர் (விருப்பத்தேர்வு)' : 'Native Place / Town (Optional)'}
              className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 opacity-90 text-stone-800 dark:text-stone-200">
              <Phone className="w-3.5 h-3.5 inline mr-1 text-blue-700 dark:text-blue-400" />
              {isTa ? 'வாடிக்கையாளர் மொபைல் (விருப்பத்தேர்வு)' : 'Client Mobile No. (Optional)'}
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
                placeholder="Optional (10 digits)"
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-r-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-amber-900/10 dark:border-amber-500/15">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Button 1: Calculate & View Horoscope */}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] hover:from-[#5C1017] hover:to-[#7A1A22] text-amber-100 text-xs font-bold shadow-md shadow-red-950/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTa ? 'ஜாதகம் கணிக்க & பார்க்க' : 'Calculate & View Horoscope'}</span>
            </button>

            {/* Button 2 FOR ASTROLOGER: Create Client Account & Share OR Save Client Profile */}
            {!shouldHideLookup && (
              <button
                type="button"
                onClick={hasValidMobile ? handleCreateClientAccount : handleSaveClientProfile}
                disabled={isRegistering}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                title={hasValidMobile ? 'Create client login account with mobile and share credentials' : 'Save client profile to database and referrals without mobile number'}
              >
                {hasValidMobile ? (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isRegistering ? (isTa ? 'சேமிக்கப்படுகிறது...' : 'Saving...') : (isTa ? 'கிளையண்ட் கணக்கு & பகிர்வு' : 'Create Client Account & Share')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isRegistering ? (isTa ? 'சேமிக்கப்படுகிறது...' : 'Saving...') : (isTa ? 'சுயவிவரத்தை சேமிக்க' : 'Save Client Profile')}</span>
                  </>
                )}
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

            {/* WhatsApp Notification Option */}
            <label className="flex items-start gap-2.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={sendWhatsAppOnCreate}
                onChange={(e) => setSendWhatsAppOnCreate(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <span className="text-sm">📲</span>
                  <span>{isTa ? 'வாட்ஸ்அப்பில் உள்நுழைவு விவரங்களை உடனடியாக அனுப்பவும்' : 'Send login credentials to client via WhatsApp immediately'}</span>
                </span>
                <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {isTa ? 'உருவாக்கியவுடன் லாகின் இணைப்பு, பயனர்பெயர் மற்றும் கடவுச்சொல்லுடன் வாட்ஸ்அப் திறக்கப்படும்' : 'Opens WhatsApp with portal URL, username, and password ready to send'}
                </p>
              </div>
            </label>

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
