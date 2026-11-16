import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Compass, Globe, Navigation } from 'lucide-react';
import { COUNTRIES, GEO_DATA, lookupCoordinates } from '../data/geoCoordinates';

/**
 * BirthCoordinatesPicker
 * Provides:
 * 1. 12-hour Time of Birth with Hours (01-12), Minutes (00-59), Seconds (00-59), and AM/PM toggle.
 * 2. Cascading Country -> State -> City dropdowns with immediate Latitude & Longitude display.
 */
export default function BirthCoordinatesPicker({
  country = 'India',
  state = 'Tamil Nadu',
  city = 'Hosur',
  latitude = "12° 44' N",
  longitude = "77° 49' E",
  dobTime = '10:55:00',
  dobTime12 = '10:55:00 AM',
  onChange,
}) {
  // Parse initial 12-hr time from dobTime or dobTime12
  const parseInitialTime = () => {
    let rawTime = dobTime12 || dobTime || '10:55:00 AM';
    let isPM = /pm/i.test(rawTime);
    let isAM = /am/i.test(rawTime);
    let clean = rawTime.replace(/[^\d:]/g, '');
    let [hStr = '10', mStr = '55', sStr = '00'] = clean.split(':');
    let hNum = parseInt(hStr, 10) || 10;
    let mNum = parseInt(mStr, 10) || 0;
    let sNum = parseInt(sStr, 10) || 0;

    let period = 'AM';
    let hour12 = hNum;

    if (isPM) {
      period = 'PM';
      if (hour12 > 12) hour12 -= 12;
    } else if (isAM) {
      period = 'AM';
      if (hour12 === 0) hour12 = 12;
    } else {
      // 24-hr format was passed
      if (hNum >= 12) {
        period = 'PM';
        hour12 = hNum === 12 ? 12 : hNum - 12;
      } else {
        period = 'AM';
        hour12 = hNum === 0 ? 12 : hNum;
      }
    }

    return {
      hour: hour12.toString().padStart(2, '0'),
      minute: mNum.toString().padStart(2, '0'),
      second: sNum.toString().padStart(2, '0'),
      period,
    };
  };

  const [timeState, setTimeState] = useState(parseInitialTime);
  const [selectedCountry, setSelectedCountry] = useState(country || 'India');
  const [selectedState, setSelectedState] = useState(state || 'Tamil Nadu');
  const [selectedCity, setSelectedCity] = useState(city || 'Hosur');
  const [citySearch, setCitySearch] = useState('');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityName, setCustomCityName] = useState('');
  const [customLat, setCustomLat] = useState(latitude || "12° 44' N");
  const [customLon, setCustomLon] = useState(longitude || "77° 49' E");

  // Sync props from parent if updated from outside (e.g. presets, customer profile)
  useEffect(() => {
    if (country && country !== selectedCountry) setSelectedCountry(country);
  }, [country]);

  useEffect(() => {
    if (state && state !== selectedState) setSelectedState(state);
  }, [state]);

  useEffect(() => {
    if (city && city !== selectedCity && !isCustomCity) {
      setSelectedCity(city);
    }
  }, [city, isCustomCity]);

  useEffect(() => {
    if (latitude && latitude !== customLat) setCustomLat(latitude);
    if (longitude && longitude !== customLon) setCustomLon(longitude);
  }, [latitude, longitude]);

  // Available states for selected country
  const availableStates = Object.keys(GEO_DATA[selectedCountry] || {});

  // Available cities for selected country & state
  const availableCities = GEO_DATA[selectedCountry]?.[selectedState] || [];

  const filteredCities = citySearch.trim()
    ? availableCities.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase()))
    : availableCities;

  // Guarantee that selectedCity is always present in selectOptions so the dropdown never shows wrong city
  const selectOptions = [...filteredCities];
  if (!isCustomCity && selectedCity && !selectOptions.some((c) => c.name === selectedCity)) {
    const currentObj = availableCities.find((c) => c.name === selectedCity) || lookupCoordinates(selectedCountry, selectedState, selectedCity);
    if (currentObj) {
      selectOptions.unshift(currentObj);
    }
  }

  const isFirstMount = React.useRef(true);

  // Update coordinates whenever country, state, or city changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (isCustomCity) {
        const fullPlace = `${customCityName || 'Custom City'} (${selectedState}, ${selectedCountry})`;
        onChange({
          country: selectedCountry,
          state: selectedState,
          city: customCityName,
          dobPlace: fullPlace,
          nativePlace: fullPlace,
          latitude: customLat,
          longitude: customLon,
          coordinates: `${customLat} , ${customLon}`,
        });
        return;
      }

      const geo = lookupCoordinates(selectedCountry, selectedState, selectedCity);
      const fullPlace = `${geo.name} (${selectedState}, ${selectedCountry})`;

      onChange({
        country: selectedCountry,
        state: selectedState,
        city: geo.name,
        dobPlace: fullPlace,
        nativePlace: fullPlace,
        latitude: geo.lat,
        longitude: geo.lon,
        coordinates: `${geo.lat} , ${geo.lon}`,
        latDec: geo.latDec,
        lonDec: geo.lonDec,
        timezone: geo.tz,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedCountry, selectedState, selectedCity, isCustomCity, customCityName, customLat, customLon]);

  // Update time whenever hour, minute, second, or period changes
  const updateTimeField = (field, value) => {
    setTimeState((prev) => {
      const nextState = { ...prev, [field]: value };
      const { hour, minute, second, period } = nextState;
      let hNum = parseInt(hour, 10) || 12;
      let h24 = hNum;
      if (period === 'PM' && hNum < 12) h24 = hNum + 12;
      if (period === 'AM' && hNum === 12) h24 = 0;

      const time24Str = `${h24.toString().padStart(2, '0')}:${minute}:${second}`;
      const time12Str = `${hour}:${minute}:${second} ${period}`;

      onChange({
        dobTime: time24Str,
        dobTime12: time12Str,
      });

      return nextState;
    });
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setCitySearch('');
    const newStates = Object.keys(GEO_DATA[newCountry] || {});
    const newState = newStates[0] || '';
    setSelectedState(newState);
    const newCities = GEO_DATA[newCountry]?.[newState] || [];
    const newCity = newCities[0]?.name || '';
    setSelectedCity(newCity);
    setIsCustomCity(false);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setCitySearch('');
    const newCities = GEO_DATA[selectedCountry]?.[newState] || [];
    const newCity = newCities[0]?.name || '';
    setSelectedCity(newCity);
    setIsCustomCity(false);
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCity(true);
      setCustomCityName('');
    } else {
      setIsCustomCity(false);
      setSelectedCity(val);
      setCitySearch(val);
    }
  };

  const handleCitySearchChange = (e) => {
    const val = e.target.value;
    setCitySearch(val);
    if (val.trim()) {
      const matches = availableCities.filter((c) =>
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      if (matches.length > 0) {
        setSelectedCity(matches[0].name);
        setIsCustomCity(false);
      }
    }
  };

  const currentCoords = isCustomCity
    ? { lat: customLat, lon: customLon, tz: '+05:30' }
    : lookupCoordinates(selectedCountry, selectedState, selectedCity);

  return (
    <div className="space-y-3.5 bg-slate-50/70 border border-slate-200 p-3 sm:p-4 rounded-2xl">
      {/* ROW 1: 12-Hour Time of Birth Selector */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Time of Birth (12-Hour AM/PM Format)</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300">
            {timeState.hour}:{timeState.minute}:{timeState.second} {timeState.period}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          {/* Hours (01 - 12) */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Hour (1-12)</span>
            <select
              value={timeState.hour}
              onChange={(e) => updateTimeField('hour', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs"
            >
              {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((h) => (
                <option key={h} value={h}>
                  {h} Hr
                </option>
              ))}
            </select>
          </div>

          {/* Minutes (00 - 59) */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Minute (0-59)</span>
            <select
              value={timeState.minute}
              onChange={(e) => updateTimeField('minute', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs"
            >
              {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                <option key={m} value={m}>
                  {m} Min
                </option>
              ))}
            </select>
          </div>

          {/* Seconds (00 - 59) */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Second (0-59)</span>
            <select
              value={timeState.second}
              onChange={(e) => updateTimeField('second', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs"
            >
              {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((s) => (
                <option key={s} value={s}>
                  {s} Sec
                </option>
              ))}
            </select>
          </div>

          {/* AM / PM Toggle */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Meridiem (AM/PM)</span>
            <div className="flex rounded-xl overflow-hidden border border-slate-300 shadow-2xs">
              <button
                type="button"
                onClick={() => updateTimeField('period', 'AM')}
                className={`flex-1 py-2 font-black text-xs transition-all cursor-pointer ${
                  timeState.period === 'AM'
                    ? 'bg-amber-600 text-white shadow-inner'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => updateTimeField('period', 'PM')}
                className={`flex-1 py-2 font-black text-xs transition-all cursor-pointer ${
                  timeState.period === 'PM'
                    ? 'bg-indigo-700 text-white shadow-inner'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Hierarchical Country -> State -> City Dropdowns */}
      <div>
        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-700" />
          <span>Place of Birth (Country • State/Province • City)</span>
          <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Country Selection */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-0.5">Country</span>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State / Province Selection */}
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] text-slate-500 font-bold block">State / Province</span>
              <span className="text-[9.5px] text-slate-400 font-mono font-semibold">
                {availableStates.length} states
              </span>
            </div>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs"
            >
              {availableStates.map((st) => {
                const count = GEO_DATA[selectedCountry]?.[st]?.length || 0;
                return (
                  <option key={st} value={st}>
                    {st} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* City Selection */}
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] text-slate-500 font-bold block">City / Town</span>
              <span className="text-[9.5px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-mono font-bold">
                {filteredCities.length} of {availableCities.length}
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                value={citySearch}
                onChange={handleCitySearchChange}
                placeholder="🔍 Search city in state..."
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
              />

              <select
                value={isCustomCity ? '__custom__' : selectedCity}
                onChange={handleCityChange}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-2xs"
              >
                {selectOptions.map((ct) => (
                  <option key={ct.name} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
                {selectOptions.length === 0 && (
                  <option disabled value="">
                    ❌ No city matching "{citySearch}"
                  </option>
                )}
                <option value="__custom__">✍️ Other / Custom City...</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom City & Custom Coordinates Input if Selected */}
        {isCustomCity && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-amber-900 font-bold block mb-0.5">Enter City Name</span>
              <input
                type="text"
                required
                value={customCityName}
                onChange={(e) => setCustomCityName(e.target.value)}
                placeholder="e.g. Tirupattur"
                className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 font-bold block mb-0.5">Custom Latitude</span>
              <input
                type="text"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="e.g. 12° 30' N"
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 font-bold block mb-0.5">Custom Longitude</span>
              <input
                type="text"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                placeholder="e.g. 78° 34' E"
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        )}

        {/* LATITUDE & LONGITUDE DISPLAY PLAQUE */}
        <div className="mt-2.5 bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-100/80 border border-amber-300/80 rounded-xl p-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-600 text-white rounded-lg shadow-xs">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 block">
                Geographic Coordinates (Ephemeris Precision)
              </span>
              <span className="text-xs font-bold text-slate-800">
                {isCustomCity ? (customCityName || 'Custom City') : selectedCity}, {selectedState} ({selectedCountry})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300 font-mono">
              <span className="text-[10px] text-slate-500 font-bold mr-1">LAT:</span>
              <strong className="text-indigo-950 font-black">{currentCoords.lat}</strong>
            </div>
            <div className="bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300 font-mono">
              <span className="text-[10px] text-slate-500 font-bold mr-1">LON:</span>
              <strong className="text-indigo-950 font-black">{currentCoords.lon}</strong>
            </div>
            {currentCoords.tz && (
              <div className="bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300 font-mono text-[11px] text-slate-600">
                <span className="text-[10px] text-slate-500 font-bold mr-1">TZ:</span>
                <strong>{currentCoords.tz}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
