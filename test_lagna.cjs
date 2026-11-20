
const { calculateThirukanithaHoroscope } = require('./frontend/src/utils/thirukanithaEngine.js');
const res = calculateThirukanithaHoroscope({
  dob: '1983-01-03',
  dobTime: '04:50',
  lat: 11.1389,
  lon: 78.1374,
  utcOffset: 5.5
});
console.log('lagnaDeg360:', res.summary.lagnaDeg360);
console.log('lagnaRasi:', res.summary.lagnaRasi);
console.log('planets:', res.planets.map(p => ({ id: p.id, rasi: p.rasi, deg: p.longitude })));
