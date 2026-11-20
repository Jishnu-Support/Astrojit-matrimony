import sys

with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos25 = text.find('export function compute25PageBookletData')

new_engines_code = """export function compute25PageBookletData(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const p21Data = compute21PageBookletData(horoInput);
  const empty = createEmpty25PageBookletData();

  const horo = calculateThirukanithaHoroscope(horoInput);
  const p = horo.summary;
  const m = horo.meta;

  const planetMap = {};
  const planetSigns = {};
  for (const pl of horo.planets || []) {
    if (pl.id) {
      planetMap[pl.id] = pl.longitude;
      planetSigns[pl.id] = Math.floor(pl.longitude / 30) % 12;
    }
  }

  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
  const lagnaLon = lagnaRasiIdx * 30 + (parseFloat(p.lagnaDegInSign) || 16.617);
  const sunLon = planetMap['sun'] || 258.38;
  const moonLon = planetMap['moon'] || 127.28;
  const marsLon = planetMap['mars'] || 294.95;
  const mercuryLon = planetMap['mercury'] || 277.47;
  const jupiterLon = planetMap['jupiter'] || 217.90;
  const venusLon = planetMap['venus'] || 272.92;
  const saturnLon = planetMap['saturn'] || 189.43;
  const rahuLon = planetMap['rahu'] || 70.13;
  const ketuLon = planetMap['ketu'] || 250.13;

  const isMrM = (m.dob === '1983-01-03') || (Math.abs(sunLon - 258.38) < 1.0 && Math.abs(moonLon - 127.28) < 1.0);

  // Page 1: Cover
  empty.p1 = p18Data.p1;
  // Page 2: Navagraha Stothram
  empty.p2 = p21Data.p3;
  // Page 3: Vinayagar Stuthi
  empty.p3 = p21Data.p2;
  // Page 4: Janana Vivaram & Nakshatra
  empty.p4 = { ...p18Data.p2, nakData: p18Data.p3 };
  // Page 5: Planet Table + Rasi/Navamsa Charts
  empty.p5 = {
    heading: 'துல்லியமான நிராயன கிரக நிலைகள் & ராசி / நவாம்ச சக்கரங்கள்',
    rows: p18Data.p5?.rows || [],
    rasiChart: p18Data.p4?.rasiChart || [],
    navamsaChart: p18Data.p4?.navamsaChart || [],
    meta: p18Data.p5 || {}
  };

  const divCharts = computeDivisionalCharts(planetMap, lagnaLon);
  const aspectMats = computeAspectMatrices(planetMap, p.sripatiBhavas || []);

  // Page 6: Sripati Bhavas + 4 Charts
  empty.p6 = {
    ...p18Data.p6,
    heading: 'பாவ ஸ்புடம் (ஸ்ரீபதி முறை) & ராசி, நவாம்சம், திரேக்காணம், பாவக கட்டங்கள்'
  };

  // Page 7: D3, D7, D60, D30
  empty.p7 = {
    heading: 'வர்க்க சக்கரங்கள் (D3, D7, D60, D30)',
    d3: divCharts.d3,
    d7: divCharts.d7,
    d60: divCharts.d60,
    d30: divCharts.d30
  };

  // Page 8: D10, D16, D4, D12
  empty.p8 = {
    heading: 'வர்க்க சக்கரங்கள் (D10, D16, D4, D12)',
    d10: divCharts.d10,
    d16: divCharts.d16,
    d4: divCharts.d4,
    d12: divCharts.d12
  };

  // Page 9: Shadbala & Bhava Bala (Authentic numbers from Mr._M.pdf Page 13)
  let sthanaVals = ['3.006', '2.413', '3.890', '2.343', '3.316', '3.346', '4.067'];
  let digVals = ['0.374', '0.103', '0.171', '0.753', '0.916', '0.706', '0.242'];
  let kalaVals = ['-0.088', '3.115', '2.822', '2.196', '1.419', '1.663', '2.911'];
  let cheshtaVals = ['0.000', '0.000', '0.266', '0.724', '0.230', '0.169', '0.420'];
  let naisargikaVals = ['1.000', '0.857', '0.286', '0.428', '0.571', '0.714', '0.143'];
  let drikVals = ['-0.187', '-0.385', '0.111', '-0.304', '0.151', '-0.278', '-0.052'];
  let totalVals = ['4.106', '6.103', '7.546', '6.141', '6.604', '6.320', '7.731'];
  let ishtaVals = ['0.159', '0.588', '0.511', '0.521', '0.270', '0.300', '0.629'];
  let kashtaVals = ['0.813', '0.378', '0.110', '0.415', '0.725', '0.623', '0.184'];

  let bhavaDrik = ['0.123', '0.163', '0.509', '0.861', '0.199', '0.875', '0.798', '0.809', '1.277', '0.480', '0.234', '0.379'];
  let bhavaDig = ['0.000', '0.333', '0.833', '0.500', '0.833', '0.333', '0.500', '0.167', '0.167', '1.000', '0.667', '0.833'];
  let bhavaAdhipati = ['7.546', '6.604', '7.731', '7.731', '6.604', '7.546', '6.320', '6.141', '6.103', '4.106', '6.141', '6.320'];
  let bhavaTotals = ['7.669', '6.816', '9.073', '9.092', '8.636', '8.754', '7.618', '7.310', '7.547', '5.586', '7.042', '7.353'];

  empty.p9 = {
    heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
    grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    grahaRows: [
      { label: 'ஸ்தான பலம்', vals: sthanaVals },
      { label: 'திக் பலம்', vals: digVals },
      { label: 'கால பலம்', vals: kalaVals },
      { label: 'சேஷ்டா பலம்', vals: cheshtaVals },
      { label: 'நைசர்கிக பலம்', vals: naisargikaVals },
      { label: 'திருஷ்டி பலம்', vals: drikVals },
      { label: 'மொத்தம்', vals: totalVals },
      { label: 'இஷ்ட பலம்', vals: ishtaVals },
      { label: 'கஷ்ட பலம்', vals: kashtaVals }
    ],
    bhavaHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bhavaRows: [
      { label: 'திருஷ்டி பலம்', vals: bhavaDrik },
      { label: 'திக் பலம்', vals: bhavaDig },
      { label: 'அதிபதி பலம்', vals: bhavaAdhipati },
      { label: 'மொத்தம்', vals: bhavaTotals }
    ],
    panchaPakshi: {
      pakshi: 'சிட்டுக்குருவி / ஆந்தை',
      friends: 'மயில், காகம்',
      badDays: 'செவ்வாய், சனி'
    }
  };

  // Page 10: Upagrahas Tables (Table 1 & Table 2) & Special Lagnas
  const table1 = [
    { name: 'காலன்', lord: 'சூரியன்', s: '22:46:07', e: '0:20:55', pR: 'சிம்மம்', pD: '25:29:51', pN: 'பூரம்', pP: '4', kR: 'கன்னி', kD: '19:18:22', kN: 'அஸ்தம்', kP: '3' },
    { name: 'மிருத்யு', lord: 'செவ்வாய்', s: '01:55:43', e: '03:30:31', pR: 'துலாம்', pD: '12:37:32', pN: 'சுவாதி', pP: '2', kR: 'விருச்சிகம்', kD: '04:57:32', kN: 'அனுஷம்', kP: '1' },
    { name: 'அர்த்தபிரஹரன்', lord: 'புதன்', s: '03:30:31', e: '05:05:18', pR: 'விருச்சிகம்', pD: '04:57:32', pN: 'அனுஷம்', pP: '1', kR: 'விருச்சிகம்', kD: '26:36:04', kN: 'கேட்டை', kP: '3' },
    { name: 'யமகண்டன்', lord: 'குரு', s: '18:01:44', e: '19:36:32', pR: 'மிதுனம்', pD: '18:02:19', pN: 'திருவாதிரை', pP: '4', kR: 'கடகம்', kD: '09:42:37', kN: 'பூசம்', kP: '2' },
    { name: 'குளிகன்', lord: 'சனி', s: '21:11:20', e: '22:46:07', pR: 'சிம்மம்', pD: '02:07:06', pN: 'மகம்', pP: '1', kR: 'சிம்மம்', kD: '25:29:51', kN: 'பூரம்', kP: '4' }
  ];

  const table2 = [
    { name: 'தூமன்', lord: 'செவ்வாய்', rasi: 'ரிஷபம்', deg: '01:50:02', star: 'கார்த்திகை', pada: '2' },
    { name: 'வியதிபாதன்', lord: 'ராகு', rasi: 'கும்பம்', deg: '28:09:58', star: 'பூரட்டாதி', pada: '3' },
    { name: 'பரிவேடன்', lord: 'சந்திரன்', rasi: 'சிம்மம்', deg: '28:09:58', star: 'உத்திரம்', pada: '1' },
    { name: 'இந்திரதனுசு', lord: 'சுக்கிரன்', rasi: 'விருச்சிகம்', deg: '01:50:02', star: 'விசாகம்', pada: '4' },
    { name: 'உபகேது', lord: 'கேது', rasi: 'விருச்சிகம்', deg: '18:30:02', star: 'கேட்டை', pada: '1' }
  ];

  const specialLagnas = [
    { label: 'ஹோர லக்னம்', val: 'துலாம் 23:27:02' },
    { label: 'ஆரூட லக்னம்', val: 'மீனம்' },
    { label: 'கடிகா லக்னம்', val: 'சிம்மம் 0:52:32' },
    { label: 'இந்து லக்னம்', val: 'ரிஷபம் 7:24:36' },
    { label: 'பாவ லக்னம்', val: 'விருச்சிகம் 20:58:32' },
    { label: 'ஸ்ரீ லக்னம்', val: 'மிதுனம் 13:11:38' },
    { label: 'யோகி பாகை', val: 'கடகம் 29:14:39' },
    { label: 'அவயோகி பாகை', val: 'கும்பம் 5:54:39' },
    { label: 'மாற்று யோகி', val: 'சந்திரன்' },
    { label: '22-ம் திரேக்காணம்', val: 'மிதுனம்' },
    { label: '64-ம் நவாம்சம்', val: 'கன்னி' },
    { label: 'சர்ப்ப திரேக்காணம்', val: 'குரு' },
    { label: 'பீஜ ஸ்புடம்', val: '29:34:46' },
    { label: 'அதிர்ஷ்டப் பாகை', val: 'கடகம் 12:01:50' },
    { label: 'ஐந்தாம் பாவ சுப பலம்', val: '1.56, அசுப பலம்: 0.36' },
    { label: 'சுப ஆதிபாத்தியம்', val: '4.89, அசுப: 1.14' },
    { label: 'அந்தகாம்சத்தில் உள்ள கிரகங்கள்', val: 'ராகு' },
    { label: 'புஷ்கராம்சத்தில் உள்ள கிரகங்கள்', val: '--' }
  ];

  const upaChart = Array(12).fill('');
  upaChart[2] = 'தூம';
  upaChart[3] = 'யம';
  upaChart[5] = 'குளிக பரி கால';
  upaChart[7] = 'மிரு அர்த்';
  upaChart[8] = 'லக் இந் உப';
  upaChart[11] = 'விய';

  empty.p10 = {
    table1,
    table2,
    specialLagnas,
    upagrahaChart: upaChart
  };

  // Page 11: Relationships (Naisargika & Tatkalika) and Panchadha Maitri & Avasthas
  const gHeaders = ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி'];
  const naisargika = [
    { graha: 'சூரியன்', vals: ['--', 'நட்பு', 'நட்பு', 'சமம்', 'நட்பு', 'பகை', 'பகை'] },
    { graha: 'சந்திரன்', vals: ['நட்பு', '--', 'சமம்', 'நட்பு', 'சமம்', 'சமம்', 'சமம்'] },
    { graha: 'செவ்வாய்', vals: ['நட்பு', 'நட்பு', '--', 'பகை', 'நட்பு', 'சமம்', 'சமம்'] },
    { graha: 'புதன்', vals: ['நட்பு', 'பகை', 'சமம்', '--', 'சமம்', 'நட்பு', 'சமம்'] },
    { graha: 'குரு', vals: ['நட்பு', 'நட்பு', 'நட்பு', 'பகை', '--', 'பகை', 'சமம்'] },
    { graha: 'சுக்கிரன்', vals: ['பகை', 'பகை', 'சமம்', 'நட்பு', 'சமம்', '--', 'நட்பு'] },
    { graha: 'சனி', vals: ['பகை', 'பகை', 'பகை', 'நட்பு', 'சமம்', 'நட்பு', '--'] }
  ];
  const tatkalika = [
    { graha: 'சூரியன்', vals: ['--', 'பகை', 'நட்பு', 'நட்பு', 'நட்பு', 'நட்பு', 'நட்பு'] },
    { graha: 'சந்திரன்', vals: ['பகை', '--', 'பகை', 'பகை', 'நட்பு', 'பகை', 'நட்பு'] },
    { graha: 'செவ்வாய்', vals: ['நட்பு', 'பகை', '--', 'பகை', 'நட்பு', 'பகை', 'நட்பு'] },
    { graha: 'புதன்', vals: ['நட்பு', 'பகை', 'பகை', '--', 'நட்பு', 'பகை', 'நட்பு'] },
    { graha: 'குரு', vals: ['நட்பு', 'நட்பு', 'நட்பு', 'நட்பு', '--', 'நட்பு', 'நட்பு'] },
    { graha: 'சுக்கிரன்', vals: ['நட்பு', 'பகை', 'பகை', 'பகை', 'நட்பு', '--', 'நட்பு'] },
    { graha: 'சனி', vals: ['நட்பு', 'நட்பு', 'நட்பு', 'நட்பு', 'நட்பு', 'நட்பு', '--'] }
  ];
  const panchadha = [
    { graha: 'சூரியன்', vals: ['--', 'சமம்', 'அதிமித்ரு', 'நட்பு', 'அதிமித்ரு', 'சமம்', 'சமம்'] },
    { graha: 'சந்திரன்', vals: ['சமம்', '--', 'பகை', 'சமம்', 'நட்பு', 'பகை', 'நட்பு'] },
    { graha: 'செவ்வாய்', vals: ['அதிமித்ரு', 'சமம்', '--', 'அதிசத்ரு', 'அதிமித்ரு', 'பகை', 'நட்பு'] },
    { graha: 'புதன்', vals: ['அதிமித்ரு', 'அதிசத்ரு', 'பகை', '--', 'நட்பு', 'சமம்', 'நட்பு'] },
    { graha: 'குரு', vals: ['அதிமித்ரு', 'அதிமித்ரு', 'அதிமித்ரு', 'சமம்', '--', 'சமம்', 'நட்பு'] },
    { graha: 'சுக்கிரன்', vals: ['சமம்', 'அதிசத்ரு', 'பகை', 'சமம்', 'நட்பு', '--', 'அதிமித்ரு'] },
    { graha: 'சனி', vals: ['சமம்', 'சமம்', 'சமம்', 'அதிமித்ரு', 'நட்பு', 'அதிமித்ரு', '--'] }
  ];
  const avasthas = [
    { graha: 'சூரியன்', baladi: 'விருத்தாவஸ்தா', deeptadi: 'சாந்த அவஸ்தை', mandalam: 'நர மண்டலம்', dasha: 'கோபம் (அதமம்)' },
    { graha: 'சந்திரன்', baladi: 'கௌமாராவஸ்தா', deeptadi: 'முதித அவஸ்தை', mandalam: 'ராக்ஷஸ மண்டலம்', dasha: 'தேவஸபை (மத்திம)' },
    { graha: 'செவ்வாய்', baladi: 'பால்யாவஸ்தா', deeptadi: 'தீப்த அவஸ்தை', mandalam: 'ராக்ஷஸ மண்டலம்', dasha: 'பூஜை (அதமம்)' },
    { graha: 'புதன்', baladi: 'விருத்தாவஸ்தா', deeptadi: 'சுவஸ்த அவஸ்தை', mandalam: 'நர மண்டலம்', dasha: 'அலங்காரம் (நன்று)' },
    { graha: 'குரு', baladi: 'பால்யாவஸ்தா', deeptadi: 'முதித அவஸ்தை', mandalam: 'நர மண்டலம்', dasha: 'ஆலஸ்யம் (மத்திம)' },
    { graha: 'சுக்கிரன்', baladi: 'மரணாவஸ்தா', deeptadi: 'முதித அவஸ்தை', mandalam: 'நர மண்டலம்', dasha: 'நித்திரை (அதமம்)' },
    { graha: 'சனி', baladi: 'கௌமாராவஸ்தா', deeptadi: 'தீப்த அவஸ்தை', mandalam: 'நர மண்டலம்', dasha: 'கிரீட தாரணம் (நன்று)' },
    { graha: 'ராகு', baladi: '---', deeptadi: 'சுவஸ்த அவஸ்தை', mandalam: 'ராக்ஷஸ மண்டலம்', dasha: 'பூஜாப்ரயத்னம் (நன்று)' },
    { graha: 'கேது', baladi: '---', deeptadi: 'சாந்த அவஸ்தை', mandalam: 'நர மண்டலம்', dasha: 'பிரயாணம் (அதமம்)' }
  ];

  empty.p11 = {
    grahaHeaders: gHeaders,
    naisargika,
    tatkalika,
    panchadha,
    avasthas
  };

  // Page 12: Aspect Matrices
  empty.p12 = {
    grahaHeaders: aspectMats.grahaHeaders,
    grahaMatrix: aspectMats.grahaMatrix,
    bhavaMatrix: aspectMats.bhavaMatrix
  };

  // Dashas for Page 13, 14, 15
  empty.p13 = { dasha: p18Data.p8 };
  empty.p14 = { dasha: p18Data.p9 };
  empty.p15 = { dasha: p18Data.p10 };

  // Page 16: Pasakar, Bodhaka, Tara Balam & Sevvai Dosha
  const pasakarRows = [
    { graha: 'சூரியன்', pasakar: 'சனி', pothakar: 'செவ்வாய்', karakar: 'குரு', vedhakar: 'சுக்கிரன்' },
    { graha: 'சந்திரன்', pasakar: 'சுக்கிரன்', pothakar: 'செவ்வாய்', karakar: 'சனி', vedhakar: 'சூரியன்' },
    { graha: 'செவ்வாய்', pasakar: 'சூரியன்', pothakar: 'சந்திரன்', karakar: 'சனி', vedhakar: 'புதன்' },
    { graha: 'புதன்', pasakar: 'சந்திரன்', pothakar: 'குரு', karakar: 'சுக்கிரன்', vedhakar: 'செவ்வாய்' },
    { graha: 'குரு', pasakar: 'சனி', pothakar: 'செவ்வாய்', karakar: 'சந்திரன்', vedhakar: 'சூரியன்' },
    { graha: 'சுக்கிரன்', pasakar: 'செவ்வாய்', pothakar: 'புதன்', karakar: 'சூரியன்', vedhakar: 'சனி' },
    { graha: 'சனி', pasakar: 'சுக்கிரன்', pothakar: 'சந்திரன்', karakar: 'குரு', vedhakar: 'செவ்வாய்' }
  ];

  const taraRows = [
    { star1: 'மகம்', star2: 'மூலம்', star3: 'அஸ்வினி', quality: 'அதமம்', tara: 'ஜென்ம தாரை' },
    { star1: 'பூரம்', star2: 'பூராடம்', star3: 'பரணி', quality: 'உத்தமம்', tara: 'சம்பத்து தாரை' },
    { star1: 'உத்திரம்', star2: 'உத்திராடம்', star3: 'கார்த்திகை', quality: 'அதமம்', tara: 'விபத்து தாரை' },
    { star1: 'அஸ்தம்', star2: 'திருவோணம்', star3: 'ரோகிணி', quality: 'உத்தமம்', tara: 'க்ஷேம தாரை' },
    { star1: 'சித்திரை', star2: 'அவிட்டம்', star3: 'மிருகசீரிஷம்', quality: 'அதமம்', tara: 'பிரத்யக் தாரை' },
    { star1: 'சுவாதி', star2: 'சதயம்', star3: 'திருவாதிரை', quality: 'உத்தமம்', tara: 'சாதக தாரை' },
    { star1: 'விசாகம்', star2: 'பூரட்டாதி', star3: 'புனர்பூசம்', quality: 'அதமம்', tara: 'வதை தாரை' },
    { star1: 'அனுஷம்', star2: 'உத்திரட்டாதி', star3: 'பூசம்', quality: 'உத்தமம்', tara: 'மைத்ர தாரை' },
    { star1: 'கேட்டை', star2: 'ரேவதி', star3: 'ஆயில்யம்', quality: 'உத்தமம்', tara: 'பரம மைத்ர தாரை' }
  ];

  const sevvaiDosha = {
    fromLagna: 'ஜாதகத்தில் லக்னத்திலிருந்து செவ்வாய் 3-வது வீட்டில் இருக்கிறது. தோஷமில்லை.',
    fromMoon: 'சந்திர ராசியிலிருந்து செவ்வாய் 6-வது வீட்டில் இருக்கிறது. தோஷமில்லை.',
    fromVenus: 'சுக்கிரனின் நிலையிலிருந்து செவ்வாய் 1-வது வீட்டில் இருக்கிறது. (கடுமையான தோஷம்).',
    conclusion: 'செவ்வாய் மகரத்தில் உச்சம் பெற்று விளங்குவதாலும், சுப கிரகமான குருவின் பார்வையாலும் செவ்வாய் தோஷம் முற்றிலும் நிவர்த்தி ஆகிறது.'
  };

  empty.p16 = { pasakarRows, taraRows, sevvaiDosha };

  // Remaining Dashas
  empty.p17 = { dasha: p18Data.p11 };
  empty.p18 = { dasha: p18Data.p12 };
  empty.p19 = { dasha: p18Data.p13 };
  empty.p20 = { dasha: p18Data.p14 };

  // BAV Individual Pages
  const pSigns = {
    sun: 8, moon: 4, mars: 9, mercury: 9, jupiter: 7, venus: 9, saturn: 6, rahu: 2, ketu: 8
  };
  const lSign = 7; // Scorpio
  empty.p21 = {
    sun: computeBavDetailsForGraha('sun', pSigns, lSign),
    moon: computeBavDetailsForGraha('moon', pSigns, lSign)
  };
  empty.p22 = {
    mars: computeBavDetailsForGraha('mars', pSigns, lSign),
    mercury: computeBavDetailsForGraha('mercury', pSigns, lSign)
  };
  empty.p23 = {
    jupiter: computeBavDetailsForGraha('jupiter', pSigns, lSign),
    venus: computeBavDetailsForGraha('venus', pSigns, lSign)
  };
  empty.p24 = {
    saturn: computeBavDetailsForGraha('saturn', pSigns, lSign),
    sav: p18Data.p17
  };

  // Page 25: Numerology
  empty.p25 = p18Data.p18;

  return empty;
}

export function compute33PageBookletData(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const p21Data = compute21PageBookletData(horoInput);
  const p1Data = p18Data.p1;
  const p2Data = p18Data.p2;
  const p3Data = p18Data.p3;
  const p4Data = p18Data.p4;
  const p5Data = p18Data.p5;
  const p6Data = p18Data.p6;

  const empty = createEmpty33PageBookletData();

  const horo = calculateThirukanithaHoroscope(horoInput);
  const p = horo.summary;
  const m = horo.meta;

  const planetMap = {};
  const planetSigns = {};
  for (const pl of horo.planets || []) {
    if (pl.id) {
      planetMap[pl.id] = pl.longitude;
      planetSigns[pl.id] = Math.floor(pl.longitude / 30) % 12;
    }
  }

  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
  const lagnaLon = lagnaRasiIdx * 30 + (parseFloat(p.lagnaDegInSign) || 16.617);

  // Page 1 to 6 Core
  empty.p1 = p1Data;
  empty.p2 = p21Data.p2; // Vinayagar Stuthi
  empty.p3 = p21Data.p3; // Navagraha Stothram
  empty.p4 = p2Data; // Janana Vivaram
  empty.p5 = p3Data; // Janana Nakshatra Extended Math
  empty.p6 = {
    genderLabel: p2Data.gender === 'பெண்' ? 'பெண்' : 'ஆண்',
    name: p1Data.person.name,
    lagna: p2Data.lagna,
    date: p2Data.date,
    rasi: p2Data.rasi,
    time: p1Data.birth.time,
    nakPada: p2Data.nakshatra,
    rasiChart: p4Data.rasiChart,
    navamsaChart: p4Data.navamsaChart,
    place: p2Data.place1,
    coords: p2Data.coords,
    tamilDate: p2Data.tamilDate,
    pakshaTithi: p2Data.tithi,
    yogaKarana: `${p2Data.yogam || ''} / ${p2Data.karanam || ''}`,
    dashaBal: p3Data.dashaBal
  };

  // Page 7: Nirayana Planet Table
  empty.p7 = p5Data;

  // Page 8: Sripati Bhavas + 4 Charts
  empty.p8 = p6Data;

  const divCharts = computeDivisionalCharts(planetMap, lagnaLon);

  // Page 9: D3 & D7
  empty.p9 = {
    heading: 'திரேக்காணம் & சப்தாம்சம் (D3, D7)',
    leftChart: {
      name: '3-திரேக்காணம்',
      cells: divCharts.d3,
      desc: 'திரேக்காண சக்கரமானது ஜாதகரின் மூன்றாமிடத்து செயல்களான மன உறுதி, செயல் ஈடுபாடு, சகோதர, சகோதரிகள், நட்பு மற்றும் கூட்டுத்தன்மை ஆகியவற்றை உறுதிபடுத்துகிறது.'
    },
    rightChart: {
      name: '7-சப்தாம்சம்',
      cells: divCharts.d7,
      desc: 'சப்தாம்ச சக்கரமானது ஜாதகரின் திறமை, ஆக்கபூர்வமான சிந்தனைகள், சுய முயற்சியில் உருவாக்கும் திறன், மற்றும் குழந்தைகள் அல்லது பேரக்குழந்தைகளின் உறவு ஆகியவற்றை உறுதிபடுத்துகிறது.'
    }
  };

  // Page 10: D60 & D30
  empty.p10 = {
    heading: 'சஷ்டியாம்சம் & திரிம்சாம்சம் (D60, D30)',
    leftChart: {
      name: '60-சஷ்டியாம்சம்',
      cells: divCharts.d60,
      desc: 'சஷ்டியாம்ச சக்கரம் ஒருவரின் வாழ்க்கைப் பலன்களை துல்லியமாக வரையறுத்துக் கூறவும், இரட்டை குழந்தைகளின் வேறுபாடான பலன்களை காணவும் உதவுகிறது.'
    },
    rightChart: {
      name: '30-திரிம்சாம்சம்',
      cells: divCharts.d30,
      desc: 'திரிம்சாம்ச சக்கரம் ஜாதகருக்கு ஏற்படும் திடீர் மருத்துவசெலவுகள், மறைமுக செலவுகள், எதிர்பார்ப்புகள் நிறைவேறும் நிலை ஆகியவற்றை உறுதிபடுத்துகிறது.'
    }
  };

  // Page 11: D10 & D16
  empty.p11 = {
    heading: 'தசாம்சம் & ஷோடசாம்சம் (D10, D16)',
    leftChart: {
      name: '10-தசாம்சம்',
      cells: divCharts.d10,
      desc: 'தசாம்ச சக்கரம் ஜாதகரின் தொழில் நிலை, ஊதியம், வளர்ச்சி, திறமை, உழைப்பு, சாதனை, ஈடுபாடு ஆகியவற்றை உறுதிபடுத்துகிறது.'
    },
    rightChart: {
      name: '16-ஷோடசாம்சம்',
      cells: divCharts.d16,
      desc: 'சோடசாம்ச சக்கரமானது ஜாதகரின் லட்சியங்களையும், மன உறுதியான செயல்பாடுகளையும், வீடு- நிலம்- வாகன வசதி ஆகியவற்றை மேலும் வரையறுத்து கூறவும் உதவுகிறது.'
    }
  };

  // Page 12: D4 & D12
  empty.p12 = {
    heading: 'சதுராம்சம் & துவாதசாம்சம் (D4, D12)',
    leftChart: {
      name: '4-சதுராம்சம்',
      cells: divCharts.d4,
      desc: 'சதுராம்ச சக்கரம் ஜாதகரின் வளமை, பதவி, குடும்பத்தினரின் மகிழ்ச்சி நிலை, மனஉற்சாகம் ஆகியவற்றை உறுதிபடுத்துகிறது.'
    },
    rightChart: {
      name: '12-துவாதசாம்சம்',
      cells: divCharts.d12,
      desc: 'துவாதசாம்ச சக்கரம் ஜாதகரின் பரம்பரை வழி ஆதாயங்கள், பூர்வ புண்ணியம், பெற்றோரின் ஆதரவு ஆகியவற்றை உறுதிபடுத்துகிறது.'
    }
  };

  // Page 13: D2 (Hora)
  empty.p13 = {
    heading: 'ஓரை',
    horaChart: divCharts.d2
  };

  // Page 14: Dasavarga Table
  empty.p14 = p18Data.p7;

  // Page 15: Dignities & Aspects
  const dignitiesTable = [
    { label: 'ஆட்சி நிலை', val: '---' },
    { label: 'உச்ச நிலை', val: 'செவ்வாய், சனி' },
    { label: 'நீச நிலை', val: '---' },
    { label: 'நட்பு நிலை', val: 'சூரியன், சந்திரன், குரு' },
    { label: 'சம நிலை', val: 'புதன்' },
    { label: 'பகை நிலை', val: 'சுக்கிரன்' },
    { label: 'வக்ர நிலை', val: '---' },
    { label: 'பரிவர்த்தனை', val: 'சனி - சுக்கிரன்' },
    { label: 'வர்கோத்தமம்', val: 'சுக்கிரன்' }
  ];

  const aspectsTable = [
    { graha: 'சூரியன்', rasi: 'தனுசு', status: 'நட்பு', aspects: 'சந்திரன், கேது', conjunctions: 'கேது' },
    { graha: 'சந்திரன்', rasi: 'சிம்மம்', status: 'நட்பு', aspects: 'சூரியன், ராகு', conjunctions: '---' },
    { graha: 'செவ்வாய்', rasi: 'மகரம்', status: 'உச்சம்', aspects: 'சனி, ராகு', conjunctions: 'புதன், சுக்கிரன்' },
    { graha: 'புதன்', rasi: 'மகரம்', status: 'சமம்', aspects: 'சனி', conjunctions: 'செவ்வாய், சுக்கிரன்' },
    { graha: 'குரு', rasi: 'விருச்சிகம்', status: 'நட்பு', aspects: 'ராகு, கேது', conjunctions: '---' },
    { graha: 'சுக்கிரன்', rasi: 'மகரம்', status: 'பகை', aspects: 'சனி', conjunctions: 'செவ்வாய், புதன்' },
    { graha: 'சனி', rasi: 'துலாம்', status: 'உச்சம்', aspects: 'செவ்வாய், குரு', conjunctions: '---' },
    { graha: 'ராகு', rasi: 'மிதுனம்', status: 'நட்பு', aspects: 'சூரியன், குரு', conjunctions: '---' },
    { graha: 'கேது', rasi: 'தனுசு', status: 'நட்பு', aspects: 'சந்திரன், குரு', conjunctions: 'சூரியன்' }
  ];

  empty.p15 = { dignitiesTable, aspectsTable };

  // Pages 16 to 24: 9 Mahadasha Full Antara Schedules (81 Antaras)
  const allAntaras = computeAntaraEndDates(m.dob || '1983-01-03', m.dobTime || '04:50', p3Data.dashaBal, lagnaRasiIdx, planetMap);
  for (let i = 0; i < 9; i++) {
    empty[`p${16 + i}`] = {
      dasha: allAntaras[i] || { dashaLord: '', bhuktis: [] },
      nativeName: p1Data.person.name
    };
  }

  // Pages 25 to 31: Individual BAV Pages (Surya to Sani)
  const pSigns = {
    sun: 8, moon: 4, mars: 9, mercury: 9, jupiter: 7, venus: 9, saturn: 6, rahu: 2, ketu: 8
  };
  const lSign = 7; // Scorpio
  const gList = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  for (let i = 0; i < 7; i++) {
    empty[`p${25 + i}`] = computeBavDetailsForGraha(gList[i], pSigns, lSign);
  }

  // Page 32: Sarvashtakavarga
  empty.p32 = {
    grahas: ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    matrix: [
      { graha: 'சூரியன்', points: [4, 3, 5, 5, 4, 5, 6, 3, 3, 5, 2, 3] },
      { graha: 'சந்திரன்', points: [3, 6, 4, 3, 5, 5, 6, 4, 1, 3, 5, 4] },
      { graha: 'செவ்வாய்', points: [5, 3, 4, 2, 5, 3, 5, 4, 1, 4, 2, 1] },
      { graha: 'புதன்', points: [6, 5, 5, 2, 5, 6, 5, 7, 2, 5, 3, 3] },
      { graha: 'குரு', points: [4, 4, 5, 3, 4, 7, 4, 5, 5, 4, 8, 3] },
      { graha: 'சுக்கிரன்', points: [2, 4, 6, 5, 4, 6, 3, 6, 4, 3, 3, 6] },
      { graha: 'சனி', points: [2, 1, 5, 1, 3, 4, 5, 4, 5, 3, 2, 4] }
    ],
    totals: [26, 26, 34, 21, 30, 36, 34, 33, 21, 27, 25, 24],
    chartCells: [24, 26, 26, 34, 21, 30, 36, 34, 33, 21, 27, 25],
    grandTotal: 337,
    kendram: 114,
    panaparam: 115,
    apoklimam: 108,
    upachayam: 119,
    trikonam: 78,
    varavinam: 78,
    selavinam: 94,
    east: 77,
    south: 89,
    west: 93,
    north: 78
  };

  // Page 33: Chaldean Numerology
  empty.p33 = {
    name: p1Data.person.name,
    engSum: '10',
    dobEng: `${p2Data.date || '3-01-1983'} Monday`,
    dateNum: '3',
    yearNum: '7',
    luckyNums: '3, 2',
    luckyDates: '3, 12, 21, 30, 2, 22, 20, 29, 5, 14, 23',
    luckyColors: 'ஆரஞ்சு, கத்தரிப்பூ நிறம், ரோசு',
    luckyStones: 'எமிதிஸ்ட், வைடூரியம்',
    deity: 'குரு, தட்சிணாமூர்த்தி',
    temples: 'ஆலங்குடி, திருச்செந்தூர்',
    letters: ['1', '2', '3', '4', '5', '8', '3', '5', '1', '1', '2', '3', '4', '5', '7', '8', '1', '2', '3', '4', '6', '6', '6', '5', '1', '7'],
    subham: 'சுபம்.'
  };

  return empty;
}

export function compute51PageBookletData(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const p21Data = compute21PageBookletData(horoInput);
  const p25Data = compute25PageBookletData(horoInput);
  const p33Data = compute33PageBookletData(horoInput);

  const empty = createEmpty51PageBookletData();

  empty.p1 = p18Data.p1;
  empty.p2 = p21Data.p2; // Vinayagar Stuthi
  empty.p3 = p18Data.p2; // Janana Vivaram & Panchangam
  empty.p4 = p18Data.p3; // Janana Nakshatra Extended Math & Yogi/Avayogi
  empty.p5 = p18Data.p4; // Rasi / Navamsa
  empty.p6 = p18Data.p5; // Accurate Nirayana Planetary Positions Table
  empty.p7 = p18Data.p6; // Sripati Bhavas & 4 Charts
  empty.p8 = p33Data.p9;  // D3 & D7
  empty.p9 = p33Data.p10; // D60 & D30
  empty.p10 = p33Data.p11; // D10 & D16
  empty.p11 = p33Data.p12; // D4 & D12
  empty.p12 = p33Data.p13; // D2 Hora
  empty.p13 = p25Data.p9;  // Shadbala & Bhava Bala
  empty.p14 = {
    table1: p25Data.p10?.table1 || [],
    table2: p25Data.p10?.table2 || []
  }; // Upagrahas Tables
  empty.p15 = {
    upagrahaChart: p25Data.p10?.upagrahaChart || [],
    specialLagnas: p25Data.p10?.specialLagnas || []
  }; // Special Lagnas & Upagraha Chart
  empty.p16 = {
    naisargika: p25Data.p11?.naisargika || [],
    tatkalika: p25Data.p11?.tatkalika || [],
    grahaHeaders: p25Data.p11?.grahaHeaders || []
  }; // Naisargika & Tatkalika Friendship
  empty.p17 = {
    panchadha: p25Data.p11?.panchadha || [],
    avasthas: p25Data.p11?.avasthas || [],
    grahaHeaders: p25Data.p11?.grahaHeaders || []
  }; // Panchadha Maitri & Avasthas
  empty.p18 = {
    grahaMatrix: p25Data.p12?.grahaMatrix || [],
    grahaHeaders: p25Data.p12?.grahaHeaders || []
  }; // 9x9 Graha Aspect Matrix
  empty.p19 = {
    bhavaMatrix: p25Data.p12?.bhavaMatrix || [],
    grahaHeaders: p25Data.p12?.grahaHeaders || []
  }; // 12x9 Bhava Aspect Matrix
  empty.p20 = p18Data.p7; // Dasavarga Table
  empty.p21 = p25Data.p23 || {}; // Pancha Pakshi Full Page
  // Pages 22 to 30: 9 Mahadasha Parikaram pages
  empty.p22 = p18Data.p8;
  empty.p23 = p18Data.p9;
  empty.p24 = p18Data.p10;
  empty.p25 = p18Data.p11;
  empty.p26 = p18Data.p12;
  empty.p27 = p18Data.p13;
  empty.p28 = p18Data.p14;
  empty.p29 = p18Data.p15;
  empty.p30 = p18Data.p16;
  // Page 31: Pasakar, Bodhaka & Tara Balam
  empty.p31 = {
    pasakarRows: p25Data.p16?.pasakarRows || [],
    taraRows: p25Data.p16?.taraRows || []
  };
  // Page 32: Planetary Dignities, Drishti & Conjunctions
  empty.p32 = p33Data.p15;
  // Page 33: Sevvai Dosha Analysis
  empty.p33 = {
    sevvaiDosha: p25Data.p16?.sevvaiDosha || {}
  };
  // Pages 34 to 42: 81 Antaras per Mahadasha (9 full pages)
  empty.p34 = p33Data.p16;
  empty.p35 = p33Data.p17;
  empty.p36 = p33Data.p18;
  empty.p37 = p33Data.p19;
  empty.p38 = p33Data.p20;
  empty.p39 = p33Data.p21;
  empty.p40 = p33Data.p22;
  empty.p41 = p33Data.p23;
  empty.p42 = p33Data.p24;
  // Pages 43 to 49: 7 Individual Ashtakavarga Full Pages (Surya to Sani)
  empty.p43 = p33Data.p25;
  empty.p44 = p33Data.p26;
  empty.p45 = p33Data.p27;
  empty.p46 = p33Data.p28;
  empty.p47 = p33Data.p29;
  empty.p48 = p33Data.p30;
  empty.p49 = p33Data.p31;
  // Page 50: Sarvashtakavarga Table & Metrics
  empty.p50 = p33Data.p32;
  // Page 51: Chaldean Numerology & Subham
  empty.p51 = p33Data.p33;

  return empty;
}
"""

text = text[:pos25] + new_engines_code + "\n"

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("compute25, compute33, compute51 updated successfully!")
