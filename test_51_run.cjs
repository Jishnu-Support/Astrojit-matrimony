const { compute51PageBookletData } = require('./frontend/src/utils/thirukanithaEngine.js');

try {
  const res = compute51PageBookletData({
    name: 'Mr. M',
    gender: 'male',
    dob: '1983-01-03',
    dobTime: '04:50',
    placeName: 'Namakkal',
    lat: 11.1389,
    lon: 78.1374,
    utcOffset: 5.5
  });

  console.log('=== Page 8 (D3, D7) ===');
  console.log('D3 Mesham:', res.p8?.leftChart?.cells?.[1]);
  console.log('D7 Kumbham:', res.p8?.rightChart?.cells?.[11]);
  console.log('D7 Makaram:', res.p8?.rightChart?.cells?.[10]);

  console.log('=== Page 12 (D2 Hora) ===');
  console.log('Hora Cancer:', JSON.stringify(res.p12?.horaChart?.[4]));
  console.log('Hora Leo:', JSON.stringify(res.p12?.horaChart?.[5]));

  console.log('=== Page 13 (Shadbala & Bhava Bala) ===');
  console.log('Graha totals:', res.p13?.grahaRows?.find(r => r.label === 'மொத்தம்'));
  console.log('Bhava totals:', res.p13?.bhavaRows?.find(r => r.label === 'மொத்தம்'));

  console.log('=== Page 14 (Upagrahas Table 1 & 2) ===');
  console.log('Table 1 rows:', res.p14?.table1?.length, res.p14?.table1?.[0]);
  console.log('Table 2 rows:', res.p14?.table2?.length, res.p14?.table2?.[0]);

  console.log('=== Page 15 (Special Lagnas & Upagraha Chart) ===');
  console.log('Special Lagnas count:', res.p15?.specialLagnas?.length, res.p15?.specialLagnas?.[0]);
  console.log('Upagraha Chart Taurus & Leo:', res.p15?.upagrahaChart?.[2], res.p15?.upagrahaChart?.[5]);

  console.log('=== Page 22 (1st Mahadasha Ketu) ===');
  console.log('P22 dashaLord & heading:', res.p22?.dashaLord, res.p22?.heading);
  console.log('P22 rows count:', res.p22?.rows?.length);
  console.log('P22 Rahu bhukti:', res.p22?.rows?.[5]);
  console.log('P22 Budha bhukti:', res.p22?.rows?.[8]);

  console.log('=== Page 33 (Sevvai Dosha) ===');
  console.log('Sevvai Dosha:', res.p33?.sevvaiDosha);

  console.log('=== Page 34 (Full Antaras 1st Dasha) ===');
  console.log('P34 dashaLord & bhuktis:', res.p34?.dasha?.dashaLord, res.p34?.dasha?.bhuktis?.length);

  console.log('=== Page 43 (Surya BAV & Pindas) ===');
  console.log('P43 Pindas:', 'rasi:', res.p43?.rasiPinda, 'graha:', res.p43?.grahaPinda, 'shodhya:', res.p43?.shodhyaPinda);

  console.log('=== Page 50 (Sarvashtakavarga) ===');
  console.log('P50 grandTotal & kendram:', res.p50?.grandTotal, res.p50?.kendram, res.p50?.east);

  console.log('=== Page 51 (Numerology) ===');
  console.log('P51 name & sums:', res.p51?.name, res.p51?.engSum, res.p51?.dateNum, res.p51?.yearNum);
} catch (e) {
  console.error('Error running test:', e);
}
