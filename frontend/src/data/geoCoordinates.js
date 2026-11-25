/**
 * Geographic Database for Vedic Horoscope Ephemeris Calculations
 * Provides Countries -> States/Provinces -> Cities with exact Latitude, Longitude, and Timezone
 * Covers all 28 States of India + 8 Union Territories (4,470+ cities/towns) + International Astrology Centers (52,900+ cities total)
 */

import geoDataJson from './geoData.json';

export const COUNTRIES = [
  {
    "code": "IN",
    "name": "India",
    "defaultState": "Tamil Nadu",
    "defaultCity": "Hosur"
  },
  {
    "code": "US",
    "name": "United States",
    "defaultState": "California",
    "defaultCity": "San Francisco"
  },
  {
    "code": "GB",
    "name": "United Kingdom",
    "defaultState": "England",
    "defaultCity": "London"
  },
  {
    "code": "CA",
    "name": "Canada",
    "defaultState": "Ontario",
    "defaultCity": "Toronto"
  },
  {
    "code": "AU",
    "name": "Australia",
    "defaultState": "New South Wales",
    "defaultCity": "Sydney"
  },
  {
    "code": "SG",
    "name": "Singapore",
    "defaultState": "Singapore",
    "defaultCity": "Singapore"
  },
  {
    "code": "MY",
    "name": "Malaysia",
    "defaultState": "Federal Territory",
    "defaultCity": "Kuala Lumpur"
  },
  {
    "code": "AE",
    "name": "United Arab Emirates",
    "defaultState": "Dubai",
    "defaultCity": "Dubai"
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "defaultState": "Western Province",
    "defaultCity": "Colombo"
  },
  {
    "code": "DE",
    "name": "Germany",
    "defaultState": "Berlin",
    "defaultCity": "Berlin"
  },
  {
    "code": "FR",
    "name": "France",
    "defaultState": "Île-de-France",
    "defaultCity": "Paris"
  },
  {
    "code": "CH",
    "name": "Switzerland",
    "defaultState": "Zurich",
    "defaultCity": "Zurich"
  },
  {
    "code": "JP",
    "name": "Japan",
    "defaultState": "Kanto",
    "defaultCity": "Tokyo"
  }
];

export const GEO_DATA = geoDataJson;

export function parseCoordinateToDec(coord, fallback = 0) {
  if (typeof coord === 'number') return coord;
  if (!coord) return fallback;
  const str = String(coord).trim();
  const dmsMatch = str.match(/([0-9.]+)[°\s]+([0-9.]+)?['\s]*([0-9.]+)?["\s]*([NSEWnsew])?/);
  if (dmsMatch) {
    const deg = parseFloat(dmsMatch[1] || '0');
    const min = parseFloat(dmsMatch[2] || '0');
    const sec = parseFloat(dmsMatch[3] || '0');
    const dir = (dmsMatch[4] || '').toUpperCase();
    let dec = deg + min / 60 + sec / 3600;
    if (dir === 'S' || dir === 'W') dec = -dec;
    return isNaN(dec) ? fallback : dec;
  }
  const num = parseFloat(str);
  return isNaN(num) ? fallback : num;
}

export function lookupCoordinates(arg1 = 'India', arg2 = 'Tamil Nadu', arg3 = 'Hosur') {
  // Support both (country, state, city) and (city, state, country)
  let country = 'India';
  let state = 'Tamil Nadu';
  let city = 'Hosur';

  if (GEO_DATA[arg1]) {
    country = arg1;
    state = arg2 || 'Tamil Nadu';
    city = arg3 || 'Hosur';
  } else if (GEO_DATA[arg3]) {
    country = arg3;
    state = arg2 || 'Tamil Nadu';
    city = arg1 || 'Hosur';
  } else {
    city = arg1 || 'Hosur';
    state = arg2 || 'Tamil Nadu';
    country = arg3 || 'India';
  }

  // Clean city name (e.g. "Krishnagiri (Tamil Nadu, India)" -> "Krishnagiri")
  const cleanCity = String(city).replace(/\(.*\)/g, '').split(/[,/-]/)[0].trim().toLowerCase();

  const stateData = GEO_DATA[country]?.[state];
  if (stateData) {
    const cityObj = stateData.find(c => {
      const cLow = c.name.toLowerCase();
      return cLow === cleanCity || cleanCity.includes(cLow) || cLow.includes(cleanCity);
    });
    if (cityObj) {
      return {
        ...cityObj,
        latDec: parseCoordinateToDec(cityObj.latDec !== undefined ? cityObj.latDec : cityObj.lat, 12.725),
        lonDec: parseCoordinateToDec(cityObj.lonDec !== undefined ? cityObj.lonDec : cityObj.lon, 77.825)
      };
    }
  }

  // Fallback scan across all states in country
  const allStates = GEO_DATA[country];
  if (allStates) {
    for (const [stName, cities] of Object.entries(allStates)) {
      const cityObj = cities.find(c => {
        const cLow = c.name.toLowerCase();
        return cLow === cleanCity || cleanCity.includes(cLow) || cLow.includes(cleanCity);
      });
      if (cityObj) {
        return {
          ...cityObj,
          state: stName,
          latDec: parseCoordinateToDec(cityObj.latDec !== undefined ? cityObj.latDec : cityObj.lat, 12.725),
          lonDec: parseCoordinateToDec(cityObj.lonDec !== undefined ? cityObj.lonDec : cityObj.lon, 77.825)
        };
      }
    }
  }

  // Default Hosur coordinates (Traditional temple benchmark)
  return {
    name: city || 'Hosur',
    lat: "12° 43' 30\" N",
    lon: "77° 49' 30\" E",
    latDec: 12.725,
    lonDec: 77.825,
    tz: '+05:30',
  };
}
