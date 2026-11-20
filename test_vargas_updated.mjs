import { calculateThirukanithaHoroscope, getVargaSign } from './frontend/src/utils/thirukanithaEngine.js';

const res = calculateThirukanithaHoroscope({
  dob: '1983-01-03',
  dobTime: '04:50',
  lat: 11.2189,
  lon: 78.1674,
  utcOffset: 5.5
});

const lagnaLon = res.summary.lagnaDeg360;
const planetMap = {};
for (const p of res.planets) {
  if (p.id !== 'lagna') {
    planetMap[p.id === 'mandi' ? 'maandi' : p.id] = p.longitude;
  }
}

console.log('Lagna Lon:', lagnaLon);
console.log('Planet Map:', planetMap);

const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'maandi'];
const labels = {
  sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
  venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்'
};

const buildChart = (vargaNum) => {
  const cells = Array(12).fill('').map(() => []);
  cells[getVargaSign(lagnaLon, vargaNum)].push('1-லக்');
  for (const k of grahaKeys) {
    if (planetMap[k] !== undefined) {
      cells[getVargaSign(planetMap[k], vargaNum)].push(labels[k]);
    }
  }
  const southOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return southOrder.map(s => cells[s].join(' '));
};

for (const v of [2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60]) {
  console.log(`D${v}:`, JSON.stringify(buildChart(v)));
}
