import { calculateThirukanithaHoroscope, RASHIS } from './frontend/src/utils/thirukanithaEngine.js';

const res = calculateThirukanithaHoroscope({
  dob: '1983-01-03',
  dobTime: '04:50',
  lat: 11.2189,
  lon: 78.1674,
  utcOffset: 5.5
});

for (const k of ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60']) {
  const chart = res.charts[k];
  const occupied = [];
  for (const s of chart) {
    if (s.occupants.length > 0) {
      occupied.push(`${RASHIS[s.rasi].shortTa}: ${s.occupants.map(o => o.labelTa).join(' ')}`);
    }
  }
  console.log(`${k}: ${occupied.join(' | ')}`);
}
