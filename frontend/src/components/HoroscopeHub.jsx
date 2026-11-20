import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  User,
  Calendar,
  Clock,
  Globe,
  Building,
  MapPin,
  Sparkles,
  Printer,
  Eye,
  Share2,
  PlusCircle,
  CheckCircle,
  X,
  Phone,
  Users,
  Compass,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useLang } from '../i18n';
import { API } from '../api';
import ClientRegistrationReceiptModal from './ClientRegistrationReceiptModal';
import ThirukanithaHoroscopeView from './ThirukanithaHoroscopeView';
import HoroscopePagerView from './HoroscopePagerView';
import { COUNTRIES, GEO_DATA, lookupCoordinates, parseCoordinateToDec } from '../data/geoCoordinates';
import { calculateThirukanithaHoroscope } from '../utils/thirukanithaEngine';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function parse12HourTime(tStr) {
  if (!tStr) return { hour: '09', minute: '04', second: '00', period: 'PM' };
  const str = tStr.trim();
  const ampmMatch = str.match(/(AM|PM)/i);
  let period = ampmMatch ? ampmMatch[1].toUpperCase() : 'AM';
  const clean = str.replace(/(AM|PM)/i, '').trim();
  const parts = clean.split(':').map(p => p.trim());
  let h = parseInt(parts[0] || '9', 10);
  const m = String(parseInt(parts[1] || '4', 10)).padStart(2, '0');
  const s = String(parseInt(parts[2] || '0', 10)).padStart(2, '0');

  if (!ampmMatch && h >= 12) {
    period = 'PM';
    if (h > 12) h -= 12;
  } else if (!ampmMatch && h === 0) {
    h = 12;
    period = 'AM';
  } else if (h === 0) {
    h = 12;
  }
  return {
    hour: String(h).padStart(2, '0'),
    minute: m,
    second: s,
    period
  };
}

function to24HourTime(hStr, mStr, sStr, period) {
  let h = parseInt(hStr || '9', 10);
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${mStr || '00'}:${sStr || '00'}`;
}

export default function HoroscopeHub({ initialSubView = 'screen', initialClient = null, onClose }) {
  const { lang, tr } = useLang();
  const isTa = lang === 'ta';

  // View mode: 'screen' (Thirukanitha Horoscope) | 'print' (Horoscope Pagers A4)
  const [subView, setSubView] = useState(initialSubView);

  // Search state for previous clients
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState(initialClient);

  const searchBoxRef = useRef(null);

  // Form State for Birth Details Intake
  const [name, setName] = useState(initialClient?.name || '');
  const [dob, setDob] = useState(initialClient?.dob || '');
  const [mobile, setMobile] = useState(initialClient?.mobile || '');
  const [timeState, setTimeState] = useState(() =>
    initialClient?.dobTime12 || initialClient?.dobTime ? parse12HourTime(initialClient.dobTime12 || initialClient.dobTime) : { hour: '12', minute: '00', second: '00', period: 'AM' }
  );

  const [country, setCountry] = useState(initialClient?.country || 'India');
  const [state, setState] = useState(initialClient?.state || 'Tamil Nadu');
  const [city, setCity] = useState(initialClient?.dobPlace || initialClient?.place || initialClient?.city || 'Salem');
  const [citySearch, setCitySearch] = useState('');

  const [lat, setLat] = useState(initialClient?.lat || 11.6643);
  const [lon, setLon] = useState(initialClient?.lon || 78.1460);
  const [utcOffset, setUtcOffset] = useState(initialClient?.utcOffset || '05:30 UTC');

  const [father, setFather] = useState(initialClient?.fatherName || initialClient?.father || '');
  const [mother, setMother] = useState(initialClient?.motherName || initialClient?.mother || '');
  const [nativePlace, setNativePlace] = useState(initialClient?.nativePlace || '');
  const [gender, setGender] = useState(initialClient?.gender || 'male');

  // Active calculated client birth data passed into children
  const [calcKey, setCalcKey] = useState(1);
  const [activeBirthData, setActiveBirthData] = useState(() => ({
    name: initialClient?.name || '',
    dob: initialClient?.dob || '',
    dobTime: initialClient?.dobTime || '',
    dobTime12: initialClient?.dobTime12 || '',
    country: initialClient?.country || 'India',
    state: initialClient?.state || 'Tamil Nadu',
    placeName: 'Salem',
    city: 'Salem',
    lat: 11.6643,
    lon: 78.1460,
    utcOffset: '05:30 UTC',
    father: initialClient?.fatherName || initialClient?.father || '',
    mother: initialClient?.motherName || initialClient?.mother || '',
    nativePlace: initialClient?.nativePlace || '',
    mobile: initialClient?.mobile || '',
    gender: 'male'
  }));

  // Registration receipt modal state
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

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

  // Update available states and cities based on country/state
  const availableStates = Object.keys(GEO_DATA[country] || {});
  const availableCities = GEO_DATA[country]?.[state] || [];
  const filteredCities = citySearch.trim()
    ? availableCities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))
    : availableCities;

  // Handle Country Change
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    const states = Object.keys(GEO_DATA[newCountry] || {});
    const firstState = states[0] || '';
    setState(firstState);
    const cities = GEO_DATA[newCountry]?.[firstState] || [];
    const firstCity = cities[0]?.name || '';
    setCity(firstCity);
    if (cities[0]) {
      setLat(cities[0].latDec !== undefined ? cities[0].latDec : parseCoordinateToDec(cities[0].lat, 11.6643));
      setLon(cities[0].lonDec !== undefined ? cities[0].lonDec : parseCoordinateToDec(cities[0].lon, 78.1460));
      setUtcOffset(cities[0].utcOffset || '05:30 UTC');
    }
  };

  // Handle State Change
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setState(newState);
    const cities = GEO_DATA[country]?.[newState] || [];
    const firstCity = cities[0]?.name || '';
    setCity(firstCity);
    if (cities[0]) {
      setLat(cities[0].latDec !== undefined ? cities[0].latDec : parseCoordinateToDec(cities[0].lat, 11.6643));
      setLon(cities[0].lonDec !== undefined ? cities[0].lonDec : parseCoordinateToDec(cities[0].lon, 78.1460));
      setUtcOffset(cities[0].utcOffset || '05:30 UTC');
    }
  };

  // Handle City Change
  const handleCityChange = (e) => {
    const newCityName = e.target.value;
    setCity(newCityName);
    const geo = lookupCoordinates(country, state, newCityName);
    if (geo) {
      setLat(geo.latDec !== undefined ? geo.latDec : parseCoordinateToDec(geo.lat, 11.6643));
      setLon(geo.lonDec !== undefined ? geo.lonDec : parseCoordinateToDec(geo.lon, 78.1460));
      if (geo.utcOffset || geo.tz) setUtcOffset(geo.utcOffset || `${geo.tz} UTC`);
    }
  };

  // Handle previous client search
  const handleSearchClients = async (queryText) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await API.searchClients(q);
      const list = res.clients || [];
      setSearchResults(list);
      setShowDropdown(true);
    } catch (err) {
      console.error('Failed to search clients:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select client from search results
  const handleSelectClient = (c) => {
    setSelectedClient(c);
    setName(c.name || '');
    setMobile(c.mobile || '');
    setDob(c.dob || '');

    const rawTime = c.dobTime12 || c.dobTime || '21:04:00';
    const parsedTime = parse12HourTime(rawTime);
    setTimeState(parsedTime);

    const cCountry = c.country || 'India';
    const cState = c.state || 'Tamil Nadu';
    const cCity = c.dobPlace || c.place || c.city || 'Salem';

    setCountry(cCountry);
    setState(cState);
    setCity(cCity);

    const geo = lookupCoordinates(cCountry, cState, cCity);
    const cLat = typeof c.lat === 'number' && !isNaN(c.lat)
      ? c.lat
      : (geo?.latDec !== undefined ? geo.latDec : parseCoordinateToDec(geo?.lat, 11.6643));
    const cLon = typeof c.lon === 'number' && !isNaN(c.lon)
      ? c.lon
      : (geo?.lonDec !== undefined ? geo.lonDec : parseCoordinateToDec(geo?.lon, 78.1460));
    const cUtc = c.utcOffset || geo?.utcOffset || (geo?.tz ? `${geo.tz} UTC` : '05:30 UTC');

    setLat(cLat);
    setLon(cLon);
    setUtcOffset(cUtc);

    setFather(c.fatherName || c.father || '');
    setMother(c.motherName || c.mother || '');
    setNativePlace(c.nativePlace || '');
    setGender(c.gender || 'male');

    setShowDropdown(false);
    setSearchQuery('');

    // Trigger instant compute
    const time24 = to24HourTime(parsedTime.hour, parsedTime.minute, parsedTime.second, parsedTime.period);
    const time12 = `${parsedTime.hour}:${parsedTime.minute}:${parsedTime.second} ${parsedTime.period}`;

    const newBirthData = {
      name: c.name || '',
      dob: c.dob || '',
      dobTime: time24,
      dobTime12: time12,
      country: cCountry,
      state: cState,
      placeName: cCity,
      city: cCity,
      lat: cLat,
      lon: cLon,
      utcOffset: cUtc,
      father: c.fatherName || c.father || '',
      mother: c.motherName || c.mother || '',
      nativePlace: c.nativePlace || '',
      mobile: c.mobile || '',
      gender: c.gender || 'male',
      clientId: c.id
    };

    setActiveBirthData(newBirthData);
    setCalcKey(prev => prev + 1);

    setActionFeedback({
      type: 'success',
      msg: isTa
        ? `வாடிக்கையாளர் தரவு வெற்றிகரமாக பெறப்பட்டது: ${c.name} (${c.mobile})`
        : `Client details loaded successfully: ${c.name} (${c.mobile})`
    });
    setTimeout(() => setActionFeedback(null), 5000);
  };

  // Reset / Clear client selection
  const handleClearClient = () => {
    setSelectedClient(null);
    setName('');
    setMobile('');
    setFather('');
    setMother('');
    setNativePlace('');
  };

  // Calculate & Refresh Horoscope
  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !dob.trim()) {
      setActionFeedback({
        type: 'error',
        msg: isTa
          ? 'தயவுசெய்து வாடிக்கையாளர் பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.'
          : 'Please enter both Client Name and Date of Birth to compute horoscope.'
      });
      setTimeout(() => setActionFeedback(null), 4000);
      return;
    }
    const time24 = to24HourTime(timeState.hour, timeState.minute, timeState.second, timeState.period);
    const time12 = `${timeState.hour}:${timeState.minute}:${timeState.second} ${timeState.period}`;

    const updatedData = {
      name: name.trim(),
      dob: dob.trim(),
      dobTime: time24,
      dobTime12: time12,
      country,
      state,
      placeName: city,
      city,
      lat: parseCoordinateToDec(lat, 11.6643),
      lon: parseCoordinateToDec(lon, 78.1460),
      utcOffset,
      father,
      mother,
      nativePlace,
      mobile,
      gender,
      clientId: selectedClient?.id || null
    };

    setActiveBirthData(updatedData);
    setCalcKey(prev => prev + 1);

    setActionFeedback({
      type: 'success',
      msg: isTa ? 'ஜாதகக் கணிப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Horoscope calculated & updated successfully!'
    });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Create Client Account for New Client
  const handleCreateClientAccount = async () => {
    if (!name.trim()) {
      alert(isTa ? 'தயவுசெய்து வாடிக்கையாளர் பெயரை உள்ளிடவும்.' : 'Please enter the client name.');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      alert(isTa ? 'கணக்கு உருவாக்க செல்லுபடியாகும் 10-இலக்க மொபைல் எண் தேவை.' : 'A valid 10-digit mobile number is required to create a client account.');
      return;
    }

    const time24 = to24HourTime(timeState.hour, timeState.minute, timeState.second, timeState.period);
    const time12 = `${timeState.hour}:${timeState.minute}:${timeState.second} ${timeState.period}`;

    setIsRegistering(true);
    try {
      // Compute astrological snapshot for the official registration receipt
      let astrologicalSnapshot = null;
      try {
        const horo = calculateThirukanithaHoroscope({
          name: name.trim(),
          dob,
          dobTime: time24,
          dobTime12: time12,
          country,
          state,
          placeName: city,
          city,
          lat: parseCoordinateToDec(lat, 11.6643),
          lon: parseCoordinateToDec(lon, 78.1460),
          utcOffset,
          gender
        });
        if (horo && horo.summary) {
          astrologicalSnapshot = {
            starBasis: 'moon',
            starBasisLabel: 'Moon Star (Chandra Nakshatra)',
            nakshatra: horo.summary.nakshatra || '',
            pada: horo.summary.pada || 1,
            moonSign: horo.summary.rasi || '',
            lagna: horo.summary.lagna || '',
            lagnaSubhas: horo.summary.subhas || 'Jupiter, Venus, Mercury',
            lagnaPapas: horo.summary.papas || 'Saturn, Mars, Rahu, Ketu',
            lagnaSubhaPavar: horo.summary.subhaPavar || 'Jupiter, Sun',
            dashaBalance: horo.summary.dashaBalance || '',
            gana: horo.summary.gana || '',
            yoni: horo.summary.yoni || ''
          };
        }
      } catch (calcErr) {
        console.warn('Snapshot calculation fallback:', calcErr);
      }

      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),
        dob,
        dobTime: time24,
        dobTime12: time12,
        dobPlace: city || 'Chennai',
        fatherName: father.trim(),
        motherName: mother.trim(),
        nativePlace: (nativePlace || city).trim(),
        country,
        state,
        city,
        latitude: lat,
        longitude: lon,
        gender,
        astrologicalSnapshot
      };

      const res = await API.registerClientByAstrologer(payload);
      const receipt = res.receipt || res;
      setReceiptModalData(receipt);
      setSelectedClient({ ...payload, id: receipt.clientCode || 'CLI-NEW' });

      // Automatically sync active data
      handleCalculate();

      setActionFeedback({
        type: 'success',
        msg: isTa
          ? `வாடிக்கையாளர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! அத்தாட்சி ரசீது தயார்.`
          : `Client account created successfully! Registration receipt generated.`
      });
    } catch (err) {
      alert(isTa ? `வாடிக்கையாளர் கணக்கு உருவாக்க தோல்வி: ${err.message}` : `Failed to create client account: ${err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSwitchSubView = (targetView) => {
    const time24 = to24HourTime(timeState.hour, timeState.minute, timeState.second, timeState.period);
    const time12 = `${timeState.hour}:${timeState.minute}:${timeState.second} ${timeState.period}`;
    const syncedData = {
      name: name.trim() || '',
      dob,
      dobTime: time24,
      dobTime12: time12,
      country,
      state,
      placeName: city,
      city,
      lat: parseCoordinateToDec(lat, 11.6643),
      lon: parseCoordinateToDec(lon, 78.1460),
      utcOffset,
      father: father.trim(),
      mother: mother.trim(),
      nativePlace: nativePlace.trim(),
      mobile: mobile.trim(),
      gender,
      clientId: selectedClient?.id || null
    };
    setActiveBirthData(syncedData);
    setCalcKey(prev => prev + 1);
    setSubView(targetView);
  };

  return (
    <div className="space-y-5">
      {/* ======================================================== */}
      {/* 1. HOROSCOPE MAIN TITLE & SCREEN/PRINT VIEW SWITCHER */}
      {/* ======================================================== */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#7A1A22] to-[#99222C] text-amber-200 flex items-center justify-center text-xl sm:text-2xl shadow-md shadow-red-950/20 shrink-0">
            🪐
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight flex items-center gap-2">
              <span>{isTa ? 'ஜாதகம்' : 'Horoscope'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                {isTa ? 'திருக்கணித பராசர முறை' : 'Thirukanitha Parashara'}
              </span>
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {isTa
                ? 'திருக்கணித வாக்கிய முறைப்படி அமைக்கப்பட்ட வேத ஜோதிடக் கணிப்பு & அச்சிடக்கூடிய ஜாதக ஏடு'
                : 'Complete Thirukanitha Sidereal Ephemeris Engine, Interactive Screen View & A4 Printouts'}
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleSwitchSubView('screen')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subView === 'screen'
                ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isTa ? 'திரைக் காட்சி (Horoscope Screen View)' : 'Horoscope Screen View'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchSubView('print')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subView === 'print'
                ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{isTa ? 'ஜாதக ஏடு அச்சு (Horoscope Print)' : 'Horoscope Print'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionFeedback.msg}</span>
          </div>
          <button type="button" onClick={() => setActionFeedback(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BIRTH DETAILS INTAKE FORM WITH PREVIOUS CLIENT SEARCH */}
      {/* ======================================================== */}
      <div id="birth-intake-card" className="bg-white/95 dark:bg-[#251E1A] p-4 sm:p-6 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4 no-print text-xs">
        {/* Header & Client Lookup Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-900/10 dark:border-amber-500/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B]">
                {isTa ? 'பிறப்பு விவரப் படிவம் (Birth Details Intake)' : 'Birth Details Intake (Compute & Generate Pager)'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {isTa
                  ? 'முந்தைய வாடிக்கையாளர் விவரங்களை தேடவும் அல்லது புதிய விவரங்களை உள்ளிடவும்'
                  : 'Search existing clients by mobile/name/dob/place, or enter new client birth data'}
              </p>
            </div>
          </div>

          {/* Quick Badges: Time & Timezone */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-amber-900/10">
              🕒 {timeState.hour}:{timeState.minute}:{timeState.second} {timeState.period}
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-indigo-900/10">
              🌐 {utcOffset}
            </span>
          </div>
        </div>

        {/* OPTION FOR PREVIOUS CLIENTS (Search by Mobile OR Name + D.O.B + Place) */}
        <div ref={searchBoxRef} className="relative p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>
                {isTa
                  ? 'முந்தைய வாடிக்கையாளர் தேடல் (Previous Client Lookup):'
                  : 'Previous Client Lookup (Search by Mobile No. or Name + D.O.B + Place):'}
              </span>
            </label>

            {selectedClient && (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                <span>✓ {selectedClient.name} ({selectedClient.mobile})</span>
                <button
                  type="button"
                  onClick={handleClearClient}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                  title="Clear selected client"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  handleSearchClients(e.target.value);
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder={
                  isTa
                    ? 'வாடிக்கையாளர் மொபைல் எண் அல்லது பெயர் + பிறந்த தேதி + ஊர் உள்ளிடவும்...'
                    : 'Enter Mobile No. OR Name + D.O.B + Place...'
                }
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#7A1A22] shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <button
              type="button"
              onClick={() => handleSearchClients()}
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-[#7A1A22] text-amber-100 hover:bg-[#5C1017] font-bold text-xs transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
            >
              {isSearching ? '...' : (isTa ? 'தேடுக' : 'Search')}
            </button>
          </div>

          {/* Search Results Dropdown List */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
              {searchResults.length === 0 ? (
                <div className="p-3 text-center text-stone-500 text-xs">
                  {isTa ? 'பொருந்தும் வாடிக்கையாளர் எவரும் காணப்படவில்லை.' : 'No matching clients found.'}
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

        {/* INTAKE FORM FIELDS */}
        <form onSubmit={handleCalculate} className="space-y-3 pt-1">
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
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={isTa ? "முழு பெயர் உள்ளிடவும்" : "Enter Full Name"}
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
                value={dob}
                onChange={e => setDob(e.target.value)}
                required
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold font-mono focus:outline-none focus:border-[#7A1A22]"
              />
            </div>

            {/* 12-Hour AM/PM Time */}
            <div>
              <label className="block font-bold mb-1 opacity-90">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
                {isTa ? 'பிறந்த நேரம் (12-Hour AM/PM)' : 'Birth Time (12-Hour AM/PM)'}
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={timeState.hour}
                  onChange={e => setTimeState(prev => ({ ...prev, hour: e.target.value }))}
                  className="flex-1 bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-1.5 py-2 text-xs font-mono font-bold text-center cursor-pointer"
                >
                  {HOURS_12.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="font-bold">:</span>
                <select
                  value={timeState.minute}
                  onChange={e => setTimeState(prev => ({ ...prev, minute: e.target.value }))}
                  className="flex-1 bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-1.5 py-2 text-xs font-mono font-bold text-center cursor-pointer"
                >
                  {MINUTES_60.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="font-bold">:</span>
                <select
                  value={timeState.second}
                  onChange={e => setTimeState(prev => ({ ...prev, second: e.target.value }))}
                  className="flex-1 bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-1.5 py-2 text-xs font-mono font-bold text-center cursor-pointer"
                >
                  {SECONDS_60.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="flex bg-stone-200 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-300 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setTimeState(prev => ({ ...prev, period: 'AM' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                      timeState.period === 'AM'
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeState(prev => ({ ...prev, period: 'PM' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                      timeState.period === 'PM'
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Place of Birth (Country -> State -> City) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-amber-900/10">
            {/* Country */}
            <div>
              <label className="block font-bold mb-1 opacity-90">
                <Globe className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
                {isTa ? 'நாடு (Country)' : 'Country'}
              </label>
              <select
                value={country}
                onChange={handleCountryChange}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22] cursor-pointer"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block font-bold mb-1 opacity-90">
                <Building className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
                {isTa ? 'மாநிலம் (State)' : 'State'}
              </label>
              <select
                value={state}
                onChange={handleStateChange}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22] cursor-pointer"
              >
                {availableStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* City / Place */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold opacity-90">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#7A1A22]" />
                  {isTa ? 'ஊர் / நகரம் (City / Place)' : 'City / Place'}
                </label>
                {availableCities.length > 8 && (
                  <input
                    type="text"
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    placeholder="Search place..."
                    className="w-24 text-[10px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-300"
                  />
                )}
              </div>
              <select
                value={city}
                onChange={handleCityChange}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7A1A22] cursor-pointer"
              >
                {filteredCities.map(ct => (
                  <option key={ct.name} value={ct.name}>
                    {ct.name} ({ct.lat}°N, {ct.lon}°E)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 3: Latitude, Longitude, UTC Offset */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-amber-900/10">
            <div>
              <label className="block font-bold mb-1 opacity-90">{isTa ? 'அட்சரேகை (Latitude °N)' : 'Latitude (°N)'}</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={e => setLat(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 opacity-90">{isTa ? 'தீர்க்கரேகை (Longitude °E)' : 'Longitude (°E)'}</label>
              <input
                type="number"
                step="any"
                value={lon}
                onChange={e => setLon(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 opacity-90">{isTa ? 'நேர வலயம் (UTC Offset)' : 'UTC Offset (Timezone)'}</label>
              <input
                type="text"
                value={utcOffset}
                onChange={e => setUtcOffset(e.target.value)}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* ROW 4: Family Lineage & Mobile (Required for creating client account) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 border-t border-amber-900/10">
            <div>
              <label className="block font-bold mb-1 opacity-90">👤 {isTa ? 'தந்தை பெயர்' : "Father's Name"}</label>
              <input
                type="text"
                value={father}
                onChange={e => setFather(e.target.value)}
                placeholder={isTa ? "தந்தை பெயர் உள்ளிடவும்" : "Enter Father's Name"}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 opacity-90">🤍 {isTa ? 'தாய் பெயர்' : "Mother's Name"}</label>
              <input
                type="text"
                value={mother}
                onChange={e => setMother(e.target.value)}
                placeholder={isTa ? "தாய் பெயர் உள்ளிடவும்" : "Enter Mother's Name"}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 opacity-90">🏠 {isTa ? 'பூர்வீகம் / சொந்த ஊர்' : 'Native Place / Town'}</label>
              <input
                type="text"
                value={nativePlace}
                onChange={e => setNativePlace(e.target.value)}
                placeholder={isTa ? "பூர்வீகம் / சொந்த ஊர் உள்ளிடவும்" : "Enter Native Place / Town"}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 opacity-90">📱 {isTa ? 'வாடிக்கையாளர் மொபைல் எண்' : 'Client Mobile No.'}</label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder={isTa ? "10 இலக்க மொபைல் எண் உள்ளிடவும்" : "Enter 10-digit mobile number"}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#7A1A22] dark:text-amber-300"
              />
            </div>
          </div>

          {/* ACTION BUTTONS: Calculate & Create Account */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-900/10">
            <span className="text-[11px] text-stone-500 font-serif">
              ⚡ {isTa ? 'தூய திருக்கணிதத் துல்லிய கணித முறைப்படி கணிக்கப்படுகிறது.' : 'Calculated strictly following pure Thirukanitha Drik Ganitha ephemeris.'}
            </span>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Button 1: Calculate / Update */}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 hover:from-[#5C1017] hover:to-[#7A1A22] text-xs font-black shadow-md shadow-red-950/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isTa ? 'ஜாதகம் கணிக்க & காட்சிப்படுத்து' : 'Calculate & View Horoscope'}</span>
              </button>

              {/* Button 2: If New Client, Create Client Account & Share */}
              <button
                type="button"
                onClick={handleCreateClientAccount}
                disabled={isRegistering}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-1.5"
                title="Create client account, generate login credentials and print/share acknowledgement slip"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isRegistering ? (isTa ? 'கணக்கு உருவாக்கப்படுகிறது...' : 'Creating Account...') : (isTa ? 'புதிய கணக்கு உருவாக்கி பகிர்' : 'Create Client Account & Share')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* 3. HOROSCOPE VIEWS: SCREEN VIEW VS PRINT PAGE */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {subView === 'screen' ? (
          <div>
            {/* Screen View: Thirukanitha Horoscope */}
            <ThirukanithaHoroscopeView
              key={`screen-${calcKey}`}
              initialData={activeBirthData}
              onClose={onClose}
            />
          </div>
        ) : (
          <div>
            {/* Print Page: Horoscope Pagers A4 Sheet */}
            <HoroscopePagerView
              key={`print-${calcKey}`}
              initialBirthData={activeBirthData}
              onClose={onClose}
            />
          </div>
        )}
      </div>

      {/* Official Client Registration Acknowledgement Receipt Modal */}
      {receiptModalData && (
        <ClientRegistrationReceiptModal
          receipt={receiptModalData}
          onClose={() => setReceiptModalData(null)}
        />
      )}
    </div>
  );
}
