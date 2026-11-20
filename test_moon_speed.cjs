
const { calculateThirukanithaHoroscope } = require('./frontend/src/utils/thirukanithaEngine.js');
const h1 = calculateThirukanithaHoroscope({ dob: '1983-01-03', dobTime: '04:50', lat: 11.1389, lon: 78.1374, utcOffset: 5.5 });
const h2 = calculateThirukanithaHoroscope({ dob: '1983-01-04', dobTime: '04:50', lat: 11.1389, lon: 78.1374, utcOffset: 5.5 });
const m1 = h1.planets.find(p => p.id === 'moon').longitude;
const m2 = h2.planets.find(p => p.id === 'moon').longitude;
let diff = (m2 - m1 + 360) % 360;
console.log('Daily Moon motion for Mr. M:', diff);
const totalNazh = (40 / 3 / diff) * 60;
console.log('Total Nazhigai:', totalNazh);
