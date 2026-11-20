import { calculateThirukanithaHoroscope, computeHoroscopePagerData } from './frontend/src/utils/thirukanithaEngine.js';

try {
  const pData = computeHoroscopePagerData({
    name: 'Sample',
    dob: '2026-10-30',
    dobTime: '05:30',
    placeName: 'Bangalore',
    lat: 12.9716,
    lon: 77.5946
  });
  console.log('Success! Sample Pager Data summary:', pData.header);
} catch (err) {
  console.error('Error in computeHoroscopePagerData:', err);
}
