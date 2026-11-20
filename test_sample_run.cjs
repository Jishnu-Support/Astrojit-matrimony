
const { compute51PageBookletData } = require('./frontend/src/utils/thirukanithaEngine.js');

const sRes = compute51PageBookletData({
  name: 'Sample',
  gender: 'male',
  dob: '2026-10-30',
  dobTime: '10:55:08',
  placeName: 'Bangalore',
  lat: 12.9716,
  lon: 77.5946,
  utcOffset: 5.5
});
console.log('Sample p3 (Janana Vivaram):', sRes.p3);
console.log('Sample p4 (Janana Nakshatra):', sRes.p4);
console.log('Sample p6 (Planet Table) 1-Lagna:', sRes.p6?.rows?.find(r => r.graha.includes('1-லக்னம்')));
console.log('Sample p6 Mandi:', sRes.p6?.rows?.find(r => r.graha.includes('மாந்தி')));
