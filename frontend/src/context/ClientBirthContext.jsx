import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { parseCoordinateToDec } from '../data/geoCoordinates';
import { calculateThirukanithaHoroscope } from '../utils/thirukanithaEngine';

const ClientBirthContext = createContext(null);

export function parse12HourTime(tStr) {
  if (!tStr) return { hour: '12', minute: '00', second: '00', period: 'AM' };
  const str = String(tStr).trim();
  const ampmMatch = str.match(/(AM|PM)/i);
  let period = ampmMatch ? ampmMatch[1].toUpperCase() : 'AM';
  const clean = str.replace(/(AM|PM)/i, '').trim();
  const parts = clean.split(':').map(p => p.trim());
  let h = parseInt(parts[0] || '12', 10);
  const m = String(parseInt(parts[1] || '0', 10)).padStart(2, '0');
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

export function to24HourTime(hStr, mStr, sStr, period) {
  let h = parseInt(hStr || '12', 10);
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${mStr || '00'}:${sStr || '00'}`;
}

const DEFAULT_CLIENT_DATA = {
  name: '',
  dob: '',
  timeState: { hour: '12', minute: '00', second: '00', period: 'AM' },
  country: '',
  state: '',
  city: '',
  lat: '',
  lon: '',
  utcOffset: '',
  father: '',
  mother: '',
  nativePlace: '',
  mobile: '',
  gender: 'male',
  selectedClient: null
};

export function ClientBirthProvider({ children }) {
  // Load initial state from sessionStorage if available
  const [clientData, setClientData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('astrojit_shared_client_birth');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Discard any old demo or default data (e.g., Native, 1990-05-15, Salem)
        if (!parsed.name || parsed.name === 'Native' || parsed.dob === '1990-05-15' || parsed.city === 'Salem') {
          sessionStorage.removeItem('astrojit_shared_client_birth');
          return DEFAULT_CLIENT_DATA;
        }
        if (typeof parsed.country === 'object' && parsed.country !== null) {
          parsed.country = parsed.country.name || '';
        }
        if (typeof parsed.state === 'object' && parsed.state !== null) {
          parsed.state = parsed.state.name || '';
        }
        return { ...DEFAULT_CLIENT_DATA, ...parsed };
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_CLIENT_DATA;
  });

  const [calcKey, setCalcKey] = useState(1);

  // Synchronize clientData into sessionStorage
  useEffect(() => {
    try {
      if (clientData.name || clientData.dob) {
        sessionStorage.setItem('astrojit_shared_client_birth', JSON.stringify(clientData));
      } else {
        sessionStorage.removeItem('astrojit_shared_client_birth');
      }
    } catch (e) {
      // ignore
    }
  }, [clientData]);

  // Compute activeBirthData for Thirukanitha Engine whenever clientData or calcKey updates
  const activeBirthData = useMemo(() => {
    const time24 = to24HourTime(
      clientData.timeState?.hour,
      clientData.timeState?.minute,
      clientData.timeState?.second,
      clientData.timeState?.period
    );
    const time12 = `${clientData.timeState?.hour || '12'}:${clientData.timeState?.minute || '00'}:${clientData.timeState?.second || '00'} ${clientData.timeState?.period || 'AM'}`;

    const safeCountry = typeof clientData.country === 'object' && clientData.country !== null
      ? clientData.country.name || ''
      : (clientData.country || '');

    const safeState = typeof clientData.state === 'object' && clientData.state !== null
      ? clientData.state.name || ''
      : (clientData.state || '');

    return {
      name: clientData.name?.trim() || '',
      dob: clientData.dob || '',
      dobTime: time24,
      dobTime12: time12,
      country: safeCountry,
      state: safeState,
      placeName: clientData.city || '',
      city: clientData.city || '',
      lat: clientData.lat ? parseCoordinateToDec(clientData.lat, 11.6643) : 11.6643,
      lon: clientData.lon ? parseCoordinateToDec(clientData.lon, 78.1460) : 78.1460,
      utcOffset: clientData.utcOffset || '05:30 UTC',
      father: clientData.father?.trim() || '',
      mother: clientData.mother?.trim() || '',
      nativePlace: clientData.nativePlace?.trim() || '',
      mobile: clientData.mobile?.trim() || '',
      gender: clientData.gender || 'male',
      clientId: clientData.selectedClient?.id || null
    };
  }, [clientData, calcKey]);

  // Compute the live Thirukanitha Horoscope for this client so all modules can access results
  const calculatedHoroscope = useMemo(() => {
    if (!activeBirthData.dob) return null;
    try {
      const [y, m, d] = activeBirthData.dob.split('-').map(Number);
      if (!y || !m || !d) return null;
      return calculateThirukanithaHoroscope({
        name: activeBirthData.name,
        dob: activeBirthData.dob,
        dobTime: activeBirthData.dobTime || '10:30',
        dobTime12: activeBirthData.dobTime12,
        country: activeBirthData.country,
        state: activeBirthData.state,
        city: activeBirthData.city,
        placeName: activeBirthData.placeName,
        lat: activeBirthData.lat,
        lon: activeBirthData.lon,
        utcOffset: activeBirthData.utcOffset,
        gender: activeBirthData.gender,
        father: activeBirthData.father,
        mother: activeBirthData.mother,
        nativePlace: activeBirthData.nativePlace,
        mobile: activeBirthData.mobile
      });
    } catch (err) {
      console.warn('Error calculating shared horoscope:', err);
      return null;
    }
  }, [activeBirthData, calcKey]);

  // Update a single field
  const updateField = useCallback((field, value) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Update multiple fields
  const updateFields = useCallback((fieldsObj) => {
    setClientData(prev => ({
      ...prev,
      ...fieldsObj
    }));
  }, []);

  // Select an existing client from search/lookup
  const selectClient = useCallback((client) => {
    if (!client) return;
    const timeParsed = parse12HourTime(client.dobTime12 || client.dobTime || '12:00:00 AM');
    const place = client.dobPlace || client.place || client.city || 'Salem';

    const safeCountry = typeof client.country === 'object' && client.country !== null
      ? client.country.name || 'India'
      : (client.country || 'India');

    const safeState = typeof client.state === 'object' && client.state !== null
      ? client.state.name || 'Tamil Nadu'
      : (client.state || 'Tamil Nadu');

    setClientData({
      name: client.name || '',
      dob: client.dob || '',
      timeState: timeParsed,
      country: safeCountry,
      state: safeState,
      city: place,
      lat: client.lat ? parseCoordinateToDec(client.lat, 11.6643) : 11.6643,
      lon: client.lon ? parseCoordinateToDec(client.lon, 78.1460) : 78.1460,
      utcOffset: client.utcOffset || '05:30 UTC',
      father: client.fatherName || client.father || '',
      mother: client.motherName || client.mother || '',
      nativePlace: client.nativePlace || '',
      mobile: client.mobile || '',
      gender: client.gender || 'male',
      selectedClient: client
    });
    setCalcKey(k => k + 1);
  }, []);

  // Reset/Clear for new profile
  const clearClientData = useCallback(() => {
    setClientData({
      name: '',
      dob: '',
      timeState: { hour: '12', minute: '00', second: '00', period: 'AM' },
      country: '',
      state: '',
      city: '',
      lat: '',
      lon: '',
      utcOffset: '',
      father: '',
      mother: '',
      nativePlace: '',
      mobile: '',
      gender: 'male',
      selectedClient: null
    });
    try {
      sessionStorage.removeItem('astrojit_shared_client_birth');
    } catch (e) {
      // ignore
    }
    setCalcKey(k => k + 1);
  }, []);

  // Explicit recalculate / refresh (used when switching pagers/tabs or pressing Calculate)
  const refreshCalculations = useCallback(() => {
    setCalcKey(k => k + 1);
  }, []);

  return (
    <ClientBirthContext.Provider
      value={{
        clientData,
        calcKey,
        activeBirthData,
        calculatedHoroscope,
        updateField,
        updateFields,
        selectClient,
        clearClientData,
        refreshCalculations
      }}
    >
      {children}
    </ClientBirthContext.Provider>
  );
}

export function useClientBirth() {
  const ctx = useContext(ClientBirthContext);
  if (!ctx) {
    throw new Error('useClientBirth must be used within a ClientBirthProvider');
  }
  return ctx;
}
