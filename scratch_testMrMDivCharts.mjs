import { computeDivisionalCharts } from './frontend/src/utils/thirukanithaEngine.js';

const planetMap = {
  sun: 258.38,
  moon: 127.28,
  mars: 294.95,
  mercury: 277.47,
  jupiter: 217.90,
  venus: 272.92,
  saturn: 189.43,
  rahu: 70.13,
  ketu: 250.13
};
const lagnaLon = 233.0; // Mr. M lagna

const charts = computeDivisionalCharts(planetMap, lagnaLon);
console.log('Mr. M D60:', JSON.stringify(charts.d60));
console.log('Mr. M D30:', JSON.stringify(charts.d30));
console.log('Mr. M D10:', JSON.stringify(charts.d10));
console.log('Mr. M D16:', JSON.stringify(charts.d16));
console.log('Mr. M D4:', JSON.stringify(charts.d4));
console.log('Mr. M D12:', JSON.stringify(charts.d12));
