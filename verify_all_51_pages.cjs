const {
  compute51PageBookletData,
  compute33PageBookletData,
  compute25PageBookletData,
  compute18PageBookletData
} = require('./frontend/src/utils/thirukanithaEngine.js');

console.log('Testing Mr. M 51-Page Booklet...');
const mrM = compute51PageBookletData({
  name: 'Mr. M',
  gender: 'male',
  dob: '1983-01-03',
  dobTime: '04:50',
  placeName: 'Namakkal',
  lat: 11.1389,
  lon: 78.1374,
  utcOffset: 5.5
});

for (let p = 1; p <= 51; p++) {
  const page = mrM['p' + p];
  if (!page || (typeof page === 'object' && Object.keys(page).length === 0)) {
    console.error(`FAILED: Page ${p} is empty or missing!`);
    process.exit(1);
  }
}
console.log('SUCCESS: All 51 pages populated for Mr. M!');

console.log('Testing Fresh Dynamic Birth Input (Salem)...');
const dynamicTest = compute51PageBookletData({
  name: 'Test Native',
  gender: 'female',
  dob: '2026-11-05',
  dobTime: '21:04',
  placeName: 'Salem',
  lat: 11.65,
  lon: 78.20,
  utcOffset: 5.5
});

for (let p = 1; p <= 51; p++) {
  const page = dynamicTest['p' + p];
  if (!page || (typeof page === 'object' && Object.keys(page).length === 0)) {
    console.error(`FAILED: Dynamic Page ${p} is empty or missing!`);
    process.exit(1);
  }
}
console.log('SUCCESS: All 51 pages populated dynamically for fresh input!');
