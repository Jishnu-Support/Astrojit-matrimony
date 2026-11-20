import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, MapPin, Building, ChevronDown, Check } from 'lucide-react';
import { COUNTRIES, GEO_DATA, lookupCoordinates } from '../data/geoCoordinates';

export default function LocationHierarchyInput({
  labelCity = 'City / Town *',
  cityPlaceholder = 'Type city name (e.g. S, C, M...)',
  country = 'India',
  setCountry,
  state = 'Tamil Nadu',
  setState,
  city = '',
  setCity,
  onLocationChange,
  required = true,
  theme = 'amber' // 'amber' | 'indigo' | 'emerald'
}) {
  const [cityInput, setCityInput] = useState(city);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Sync internal city input when parent changes externally
  useEffect(() => {
    setCityInput(city);
  }, [city]);

  // Available states for the selected country
  const availableStates = useMemo(() => {
    const states = Object.keys(GEO_DATA[country] || {});
    return states;
  }, [country]);

  // When country changes, ensure state is valid
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    const countryObj = COUNTRIES.find(c => c.name === newCountry);
    const nextStates = Object.keys(GEO_DATA[newCountry] || {});
    const nextState = countryObj?.defaultState || nextStates[0] || '';
    setState(nextState);
    setCity('');
    setCityInput('');
    if (onLocationChange) {
      onLocationChange({ country: newCountry, state: nextState, city: '', lat: null, lon: null });
    }
  };

  // When state changes
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setState(newState);
    setCity('');
    setCityInput('');
    if (onLocationChange) {
      onLocationChange({ country, state: newState, city: '', lat: null, lon: null });
    }
  };

  // Filter city suggestions based on user input (starting from 1 letter!)
  const suggestions = useMemo(() => {
    const query = (cityInput || '').trim().toLowerCase();
    if (query.length < 1) return [];

    const stateCities = GEO_DATA[country]?.[state] || [];
    // Priority 1: Cities in current state that start with query
    const startsInState = stateCities.filter(c => c.name.toLowerCase().startsWith(query));
    // Priority 2: Cities in current state that contain query
    const containsInState = stateCities.filter(c => !c.name.toLowerCase().startsWith(query) && c.name.toLowerCase().includes(query));

    let combined = [...startsInState, ...containsInState];

    // Priority 3: If matches in current state are fewer than 6, search across other states of the country
    if (combined.length < 6) {
      const allStates = Object.keys(GEO_DATA[country] || {});
      for (const st of allStates) {
        if (st === state) continue;
        const otherCities = GEO_DATA[country]?.[st] || [];
        for (const c of otherCities) {
          if (c.name.toLowerCase().includes(query)) {
            combined.push({ ...c, otherState: st });
            if (combined.length >= 15) break;
          }
        }
        if (combined.length >= 15) break;
      }
    }

    return combined.slice(0, 15);
  }, [country, state, cityInput]);

  // Handle selecting a city from suggestions
  const handleSelectSuggestion = (item) => {
    const selectedCity = item.name;
    const finalState = item.otherState || state;

    if (item.otherState && item.otherState !== state) {
      setState(item.otherState);
    }
    setCity(selectedCity);
    setCityInput(selectedCity);
    setShowSuggestions(false);

    if (onLocationChange) {
      onLocationChange({
        country,
        state: finalState,
        city: selectedCity,
        lat: item.latDec || item.lat,
        lon: item.lonDec || item.lon
      });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const borderFocusClass =
    theme === 'indigo'
      ? 'focus:border-indigo-500'
      : theme === 'emerald'
      ? 'focus:border-emerald-500'
      : 'focus:border-amber-500';

  const accentColorClass =
    theme === 'indigo'
      ? 'text-indigo-600'
      : theme === 'emerald'
      ? 'text-emerald-600'
      : 'text-amber-600';

  return (
    <div ref={wrapperRef} className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Country Selection */}
        <div>
          <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
            <Globe className={`w-3.5 h-3.5 ${accentColorClass}`} /> Country *
          </label>
          <select
            value={country}
            onChange={handleCountryChange}
            required={required}
            className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 font-medium focus:outline-none ${borderFocusClass}`}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. State / Province Selection */}
        <div>
          <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
            <Building className={`w-3.5 h-3.5 ${accentColorClass}`} /> State / Province *
          </label>
          {availableStates.length > 0 ? (
            <select
              value={state}
              onChange={handleStateChange}
              required={required}
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 font-medium focus:outline-none ${borderFocusClass}`}
            >
              {availableStates.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={state}
              onChange={handleStateChange}
              placeholder="State or Province"
              required={required}
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none ${borderFocusClass}`}
            />
          )}
        </div>

        {/* 3. City / Birth Place with Instant 1-Letter Auto-Suggestions */}
        <div className="relative">
          <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
            <MapPin className={`w-3.5 h-3.5 ${accentColorClass}`} /> {labelCity}
          </label>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (cityInput.trim().length >= 1) setShowSuggestions(true);
            }}
            placeholder={cityPlaceholder}
            required={required}
            autoComplete="off"
            className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none ${borderFocusClass}`}
          />

          {/* Instant Auto-Suggestion Dropdown Popup */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-1.5 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between border-b border-slate-200">
                <span>Matching Cities ({suggestions.length})</span>
                <span className="text-[9px] text-slate-400">Click to select</span>
              </div>
              {suggestions.map((item, idx) => {
                const isSelected = city.toLowerCase() === item.name.toLowerCase();
                return (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer ${
                      isSelected ? 'bg-amber-50/70 text-slate-950 font-bold' : 'text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${accentColorClass} shrink-0`} />
                      <span className="font-semibold">{item.name}</span>
                      {item.otherState && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({item.otherState})
                        </span>
                      )}
                    </div>
                    {item.lat && item.lon && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {typeof item.lat === 'number' ? `${item.lat.toFixed(2)}°N` : item.lat}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
