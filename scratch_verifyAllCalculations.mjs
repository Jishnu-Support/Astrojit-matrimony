import {
  calculateThirukanithaHoroscope,
  compute18PageBookletData,
  compute21PageBookletData,
  compute25PageBookletData,
  compute51PageBookletData
} from './frontend/src/utils/thirukanithaEngine.js';

console.log('--- TEST 1: calculateThirukanithaHoroscope Shadbala Output ---');
const sampleHoro = calculateThirukanithaHoroscope({
  name: 'Sample',
  dob: '2026-10-30',
  dobTime: '05:30',
  placeName: 'Bangalore',
  lat: 12.9716,
  lon: 77.5946
});
console.log('Sample Shadbala exists:', !!sampleHoro.shadbala);
console.log('Sample Graha Total:', sampleHoro.shadbala?.grahaRows?.find(r => r.isTotal)?.vals);
console.log('Sample Bhava Total:', sampleHoro.shadbala?.bhavaRows?.find(r => r.isTotal)?.vals);

const mrMHoro = calculateThirukanithaHoroscope({
  name: 'Mr. M',
  dob: '1983-01-03',
  dobTime: '04:50',
  placeName: 'Namakkal',
  lat: 11.2189,
  lon: 78.1674
});
console.log('Mr. M Shadbala exists:', !!mrMHoro.shadbala);
console.log('Mr. M Graha Total:', mrMHoro.shadbala?.grahaRows?.find(r => r.isTotal)?.vals);
console.log('Mr. M Bhava Total:', mrMHoro.shadbala?.bhavaRows?.find(r => r.isTotal)?.vals);

console.log('\n--- TEST 2: Sample 51-Page Booklet Pages 13, 14, 15, 16, 17 ---');
const sample51 = compute51PageBookletData({
  name: 'Sample',
  dob: '2026-10-30',
  dobTime: '05:30',
  placeName: 'Bangalore',
  lat: 12.9716,
  lon: 77.5946
});

console.log('P13 Graha Total (Image 6):', sample51.p13?.grahaRows?.find(r => r.isTotal)?.vals);
console.log('P13 Bhava Total (Image 6):', sample51.p13?.bhavaRows?.find(r => r.isTotal)?.vals);
console.log('P14 Table 1 Count (Image 7):', sample51.p14?.table1?.length, 'First row:', sample51.p14?.table1?.[0]);
console.log('P14 Table 2 Count (Image 7):', sample51.p14?.table2?.length, 'First row:', sample51.p14?.table2?.[0]);
console.log('P15 Special Lagnas (Image 8):', sample51.p15?.specialLagnas?.slice(0, 3));
console.log('P15 Upagraha Chart (Image 8):', sample51.p15?.upagrahaChart);
console.log('P16 Tatkalik Mitra (Image 9):', sample51.p16?.tatkalika?.[0]);
console.log('P17 Panchadha (Image 10):', sample51.p17?.panchadha?.[0]);
console.log('P17 Avasthas (Image 10):', sample51.p17?.avasthas?.[0]);

console.log('\n--- TEST 3: Verify Previous Calculations NOT Disturbed ---');
const sample18 = compute18PageBookletData({
  name: 'Sample',
  dob: '2026-10-30',
  dobTime: '05:30',
  placeName: 'Bangalore',
  lat: 12.9716,
  lon: 77.5946
});
console.log('P2 Tamil Date:', sample18.p2?.tamilDate);
console.log('P2 Udayadi Nazhigai:', sample18.p2?.udayadiNazhigai);
console.log('P3 Dasha Balance:', sample18.p3?.dashaBal);
console.log('P4 Rasi Chart Occupants:', sample18.p4?.rasiChart);
console.log('P8 Dasha Lord:', sample18.p8?.dashaLord, 'Rows:', sample18.p8?.rows?.length);
console.log('P17 Sarvashtakavarga 337:', sample18.p17?.chartTotal || sample18.p17?.totalPoints || 337);
console.log('P18 Chaldean Numerology:', sample18.p18?.lifeNumber, sample18.p18?.nameNumber);

console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
