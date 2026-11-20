
const { compute18PageBookletData } = require('./frontend/src/utils/thirukanithaEngine.js');
const res = compute18PageBookletData({
  name: 'Mr. M',
  dob: '1983-01-03',
  dobTime: '04:50',
  lat: 11.1389,
  lon: 78.1374,
  utcOffset: 5.5
});
console.log('sripatiChart:', res.p6.sripatiChart);
console.log('drekkanaChart:', res.p6.drekkanaChart);
