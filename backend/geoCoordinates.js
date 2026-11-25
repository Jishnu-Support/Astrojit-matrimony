const geoDataJson = require('./geoData.json');

const COUNTRIES = [
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

const GEO_DATA = geoDataJson;

function lookupCoordinates(country = 'India', state = 'Tamil Nadu', city = 'Hosur') {
  const stateData = GEO_DATA[country]?.[state];
  if (stateData) {
    const cityObj = stateData.find(c => c.name.toLowerCase() === city.toLowerCase() || city.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(city.toLowerCase()));
    if (cityObj) return cityObj;
  }

  const allStates = GEO_DATA[country];
  if (allStates) {
    for (const [stName, cities] of Object.entries(allStates)) {
      const cityObj = cities.find(c => c.name.toLowerCase() === city.toLowerCase() || city.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(city.toLowerCase()));
      if (cityObj) return { ...cityObj, state: stName };
    }
  }

  return {
    name: city || 'Hosur',
    lat: "12° 43' 30\" N",
    lon: "77° 49' 30\" E",
    latDec: 12.725,
    lonDec: 77.825,
    tz: '+05:30',
  };
}

module.exports = {
  COUNTRIES,
  GEO_DATA,
  lookupCoordinates,
};
