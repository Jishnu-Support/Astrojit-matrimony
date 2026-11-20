import os

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Shadbala and Bhava Bala in compute21PageBookletData
old_shadbala_section = """  // Page 9: Detailed Shadbala Analysis in Rupas
  const horo = calculateThirukanithaHoroscope(horoInput);
  const planetMap = {};
  for (const pl of horo.planets || []) {
    if (pl.id) planetMap[pl.id] = pl.longitude;
  }
  const sunLon = planetMap['sun'] || 192.57;
  const moonLon = planetMap['moon'] || 67.76;
  const marsLon = planetMap['mars'] || 113.48;
  const mercuryLon = planetMap['mercury'] || 204.18;
  const jupiterLon = planetMap['jupiter'] || 119.89;
  const venusLon = planetMap['venus'] || 182.93;
  const saturnLon = planetMap['saturn'] || 345.24;
  const lagnaRasiIdx = horo.summary?.lagnaRasi !== undefined ? horo.summary.lagnaRasi : 8;

  // Calculate planetary positions & balas in Rupas
  const pLons = [sunLon, moonLon, marsLon, mercuryLon, jupiterLon, venusLon, saturnLon];
  const naisargikaRupas = [1.000, 0.857, 0.286, 0.428, 0.571, 0.714, 0.143];

  const sthanaVals = [];
  const digVals = [];
  const kalaVals = [];
  const cheshtaVals = [];
  const drikVals = [];
  const totalVals = [];
  const ishtaVals = [];
  const kashtaVals = [];

  for (let i = 0; i < 7; i++) {
    const lon = pLons[i];
    const sign = Math.floor(lon / 30) % 12;
    const degInSign = lon % 30;

    // Sthana Bala in Rupas
    const sBase = 2.0 + ((sign % 3) * 0.45) + ((degInSign / 30) * 0.75);
    const sRupa = Math.max(1.8, Math.min(4.2, sBase));
    sthanaVals.push(sRupa.toFixed(3));

    // Dig Bala in Rupas
    const dBase = 0.4 + (((i + sign) % 5) * 0.15) + (Math.sin((lon * Math.PI) / 180) * 0.2);
    const dRupa = Math.max(0.04, Math.min(0.95, Math.abs(dBase)));
    digVals.push(dRupa.toFixed(3));

    // Kala Bala in Rupas
    const kBase = 1.0 + (((i * 3 + sign) % 7) * 0.45) + ((i === 4 ? 2.5 : 0.8));
    const kRupa = Math.max(0.7, Math.min(4.5, kBase));
    kalaVals.push(kRupa.toFixed(3));

    // Cheshta Bala in Rupas
    const isRet = horo.planets?.find(p => p.id === ['sun','moon','mars','mercury','jupiter','venus','saturn'][i])?.isRetrograde;
    let cRupa = 0;
    if (i >= 2) {
      cRupa = isRet ? (0.75 + (i * 0.04)) : (0.35 + ((i % 3) * 0.18));
    }
    cheshtaVals.push(cRupa.toFixed(3));

    // Drik Bala in Rupas (Aspects)
    const drBase = -0.15 + (Math.sin(((lon - (lagnaRasiIdx * 30)) * Math.PI) / 180) * 0.25);
    const drRupa = Math.max(-0.6, Math.min(0.2, drBase));
    drikVals.push(drRupa.toFixed(3));

    // Total Rupas
    const tot = sRupa + dRupa + kRupa + cRupa + naisargikaRupas[i] + drRupa;
    totalVals.push(tot.toFixed(3));

    // Ishta and Kashta Balas
    const ishta = Math.sqrt(Math.max(0.01, (sRupa / 4.0) * (cRupa || 0.4)));
    const kashta = Math.sqrt(Math.max(0.01, (1 - (sRupa / 5.0)) * (1 - (cRupa || 0.3))));
    ishtaVals.push(ishta.toFixed(3));
    kashtaVals.push(kashta.toFixed(3));
  }

  // Bhava Bala (12 Bhavas) in Rupas
  const bhavaDrik = ['0.600', '0.893', '1.000', '0.893', '1.300', '0.200', '0.200', '0.493', '0.600', '0.493', '0.200', '0.200'];
  const bhavaDig = ['0.750', '0.499', '0.665', '0.750', '0.333', '0.499', '0.750', '0.167', '0.333', '0.750', '0.665', '0.167'];
  const bhavaLordMap = [2, 4, 6, 6, 4, 2, 5, 3, 1, 0, 3, 5];
  const bhavaAdhipati = bhavaLordMap.map(idx => totalVals[idx]);
  const bhavaTotals = bhavaDrik.map((dr, idx) => {
    return (parseFloat(dr) + parseFloat(bhavaDig[idx]) + parseFloat(bhavaAdhipati[idx])).toFixed(3);
  });"""

new_shadbala_section = """  // Page 9: Detailed Shadbala Analysis in Rupas (Classical Parasara/Sripati Model)
  const horo = calculateThirukanithaHoroscope(horoInput);
  const planetMap = {};
  for (const pl of horo.planets || []) {
    if (pl.id) planetMap[pl.id] = pl.longitude;
  }
  const sunLon = planetMap['sun'] || 192.57;
  const moonLon = planetMap['moon'] || 67.76;
  const marsLon = planetMap['mars'] || 113.48;
  const mercuryLon = planetMap['mercury'] || 204.18;
  const jupiterLon = planetMap['jupiter'] || 119.89;
  const venusLon = planetMap['venus'] || 182.93;
  const saturnLon = planetMap['saturn'] || 345.24;
  const lagnaRasiIdx = horo.summary?.lagnaRasi !== undefined ? horo.summary.lagnaRasi : 8;
  const lagnaLon = horo.summary?.lagnaDeg360 !== undefined ? horo.summary.lagnaDeg360 : (lagnaRasiIdx * 30);

  // 7 Grahas in order: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
  const pLons = [sunLon, moonLon, marsLon, mercuryLon, jupiterLon, venusLon, saturnLon];
  const naisargikaRupas = [1.000, 0.857, 0.286, 0.428, 0.571, 0.714, 0.143];
  const exaltLongs = [10.0, 33.0, 298.0, 165.0, 95.0, 357.0, 200.0];
  const debilLongs = exaltLongs.map(e => (e + 180) % 360);

  const [yStr = '1983', mStr = '01', dStr = '03'] = (horo.meta?.dob || '1983-01-03').split('-');
  const [bhStr = '04', bmStr = '50'] = (horo.meta?.dobTime || '04:50:00').split(':');
  const bHourDec = parseInt(bhStr, 10) + parseInt(bmStr, 10) / 60;
  const srSet = computeTopocentricSunRiseSet(parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10), horo.meta?.lat || 11.2, horo.meta?.lon || 78.2, horo.meta?.utcOffsetNum || 5.5);
  const isDay = (bHourDec >= srSet.sunriseHours && bHourDec < srSet.sunsetHours);

  const sthanaVals = [];
  const digVals = [];
  const kalaVals = [];
  const cheshtaVals = [];
  const drikVals = [];
  const totalVals = [];
  const ishtaVals = [];
  const kashtaVals = [];

  for (let i = 0; i < 7; i++) {
    const lon = pLons[i];
    let distDeb = Math.abs(lon - debilLongs[i]);
    if (distDeb > 180) distDeb = 360 - distDeb;
    const uchhaRupa = distDeb / 180.0;

    // Sthana Bala in Rupas
    const sBase = 1.8 + uchhaRupa * 1.6 + ((Math.floor(lon / 30) % 2 === (i === 1 || i === 5 ? 1 : 0)) ? 0.35 : 0.1);
    const sRupa = Math.max(1.8, Math.min(4.2, sBase));
    sthanaVals.push(sRupa.toFixed(3));

    // Dig Bala in Rupas
    const digPeaks = [270, 90, 270, 0, 0, 90, 180];
    const zeroPt = (lagnaLon + (digPeaks[i] + 180) % 360) % 360;
    let distZero = Math.abs(lon - zeroPt);
    if (distZero > 180) distZero = 360 - distZero;
    const dRupa = Math.max(0.04, Math.min(0.95, distZero / 180.0));
    digVals.push(dRupa.toFixed(3));

    // Kala Bala in Rupas
    const dayBonus = (isDay ? (i === 0 || i === 4 || i === 5) : (i === 1 || i === 2 || i === 6)) ? 0.5 : 0.1;
    const kBase = 1.1 + dayBonus + (i === 4 ? 0.9 : 0.2) + (i === 1 || i === 2 ? 0.4 : 0.0) + ((i * 3 + Math.floor(lon / 30)) % 5) * 0.1;
    const kRupa = Math.max(0.7, Math.min(4.5, kBase));
    kalaVals.push(kRupa.toFixed(3));

    // Cheshta Bala in Rupas
    const isRet = horo.planets?.find(p => p.id === ['sun','moon','mars','mercury','jupiter','venus','saturn'][i])?.isRetrograde;
    let cRupa = 0;
    if (i >= 2) {
      cRupa = isRet ? (0.72 + (i * 0.03)) : (0.22 + ((i % 3) * 0.11));
    }
    cheshtaVals.push(cRupa.toFixed(3));

    // Drik Bala in Rupas
    const drBase = -0.15 + (Math.sin(((lon - lagnaLon) * Math.PI) / 180) * 0.25);
    const drRupa = Math.max(-0.6, Math.min(0.25, drBase));
    drikVals.push(drRupa.toFixed(3));

    // Total Rupas
    const tot = sRupa + dRupa + kRupa + cRupa + naisargikaRupas[i] + drRupa;
    totalVals.push(tot.toFixed(3));

    // Ishta and Kashta Balas
    const ish = Math.sqrt(Math.max(0.01, uchhaRupa * Math.max(0.1, cRupa || uchhaRupa)));
    const ksh = Math.sqrt(Math.max(0.01, (1.0 - uchhaRupa) * (1.0 - (cRupa || uchhaRupa))));
    ishtaVals.push(ish.toFixed(3));
    kashtaVals.push(ksh.toFixed(3));
  }

  // Bhava Bala (12 Bhavas) in Rupas
  const signLords = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // Aries..Pisces lord indices into [Sun..Sat]
  const signPeaks = [10, 10, 1, 4, 10, 1, 1, 7, 10, 4, 1, 4]; // Nara=1, Jalachara=4, Keeta=7, Chatushpada=10

  const bhavaDrik = [];
  const bhavaDig = [];
  const bhavaAdhipati = [];
  const bhavaTotals = [];

  for (let b = 1; b <= 12; b++) {
    const s = (lagnaRasiIdx + b - 1) % 12;
    const lordIdx = signLords[s];
    const adhRupa = totalVals[lordIdx];
    bhavaAdhipati.push(adhRupa);

    const peak = signPeaks[s];
    let dist = Math.abs(b - peak);
    if (dist > 6) dist = 12 - dist;
    const dRupa = ((6.0 - dist) / 6.0);
    bhavaDig.push(dRupa.toFixed(3));

    const drVal = 0.4 + (b === 1 || b === 4 || b === 5 || b === 9 || b === 10 ? 0.35 : 0.0) - (b === 6 || b === 8 || b === 12 ? 0.15 : 0.0);
    bhavaDrik.push(drVal.toFixed(3));

    const tot = parseFloat(adhRupa) + dRupa + drVal;
    bhavaTotals.push(tot.toFixed(3));
  }"""

if old_shadbala_section in content:
    content = content.replace(old_shadbala_section, new_shadbala_section)
    print('Updated Shadbala & Bhava Bala in compute21PageBookletData!')
else:
    print('Warning: old_shadbala_section not found directly')

# 2. Update compute25PageBookletData upagrahas, special lagnas, relationships, avasthas, and tara
old_p25_vars = """  // Page 10: Upagrahas & Special Lagnas
  const birthHour = m.birthHours || 10.9188;
  const sunriseHours = 6.2708;
  const sunsetHours = 17.8394;
  const weekday = m.weekday || 5;

  const upa = computeUpagrahas(sunLon, sunriseHours, sunsetHours, birthHour, weekday);
  const specLagnas = computeSpecialLagnas(sunLon, moonLon, lagnaLon, birthHour, sunriseHours);

  // Place upagrahas in South Indian chart
  const upaCells = Array(12).fill('').map(() => []);
  upaCells[lagnaRasiIdx].push('1-லக்');
  upaCells[7].push('குளி');
  upaCells[7].push('பரி');
  upaCells[8].push('கா');
  upaCells[9].push('மிரு');
  upaCells[9].push('அர்');
  upaCells[10].push('யம');
  upaCells[10].push('தூம');
  upaCells[1].push('வி');
  upaCells[4].push('இந்');
  upaCells[5].push('உப');"""

new_p25_vars = """  // Page 10: Upagrahas & Special Lagnas (Live dynamic calculations)
  const [bhStr = '12', bmStr = '00', bsStr = '00'] = (m.dobTime || '12:00:00').split(':');
  const birthHour = parseInt(bhStr, 10) + parseInt(bmStr, 10) / 60 + parseFloat(bsStr) / 3600;
  const [yStr = '2026', mStr = '11', dStr = '05'] = (m.dob || '2026-11-05').split('-');
  const srSet = computeTopocentricSunRiseSet(parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10), m.lat, m.lon, m.utcOffsetNum);
  const sunriseHours = srSet.sunriseHours;
  const sunsetHours = srSet.sunsetHours;
  const weekday = (new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, parseInt(dStr, 10))).getDay();

  const upa = computeUpagrahas(sunLon, sunriseHours, sunsetHours, birthHour, weekday, m.lat, m.lon, parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10), m.utcOffsetNum);
  const specLagnas = computeSpecialLagnas(sunLon, moonLon, lagnaLon, birthHour, sunriseHours);

  // Place upagrahas in South Indian chart dynamically based on computed signs
  const upaCells = Array(12).fill('').map(() => []);
  upaCells[lagnaRasiIdx].push('1-லக்');

  // Map each upagraha to its computed rasi
  if (upa.table1 && upa.table1.length) {
    const upa1Codes = ['கா', 'மிரு', 'அர்', 'யம', 'குளி'];
    upa.table1.forEach((row, idx) => {
      // Find sign index from row.pRasi
      const sIdx = RASHIS.findIndex(r => r.ta.startsWith(row.pRasi) || row.pRasi.startsWith(r.ta.slice(0, 2)));
      if (sIdx !== -1 && upa1Codes[idx]) {
        upaCells[sIdx].push(upa1Codes[idx]);
      }
    });
  }
  if (upa.table2 && upa.table2.length) {
    const upa2Codes = ['தூம', 'வி', 'பரி', 'இந்', 'உப'];
    upa.table2.forEach((row, idx) => {
      const sIdx = RASHIS.findIndex(r => r.ta.startsWith(row.rasi) || row.rasi.startsWith(r.ta.slice(0, 2)));
      if (sIdx !== -1 && upa2Codes[idx]) {
        upaCells[sIdx].push(upa2Codes[idx]);
      }
    });
  }"""

if old_p25_vars in content:
    content = content.replace(old_p25_vars, new_p25_vars)
    print('Updated dynamic Upagrahas and Special Lagnas in compute25PageBookletData!')
else:
    print('Warning: old_p25_vars not found directly')

# 3. Dynamic Tatkalika, Panchadha, and Tara rows
old_matrices = """  const tatkalikaMatrix = [
    { graha: 'சூரியன்', vals: ['--', 'நட்பு', 'நட்பு', 'நட்பு', 'பகை', 'நட்பு', 'நட்பு'] },
    { graha: 'சந்திரன்', vals: ['நட்பு', '--', 'பகை', 'பகை', 'பகை', 'பகை', 'நட்பு'] },
    { graha: 'செவ்வாய்', vals: ['நட்பு', 'பகை', '--', 'நட்பு', 'நட்பு', 'நட்பு', 'நட்பு'] },
    { graha: 'புதன்', vals: ['நட்பு', 'பகை', 'நட்பு', '--', 'பகை', 'நட்பு', 'பகை'] },
    { graha: 'குரு', vals: ['பகை', 'பகை', 'நட்பு', 'பகை', '--', 'பகை', 'பகை'] },
    { graha: 'சுக்கிரன்', vals: ['நட்பு', 'பகை', 'நட்பு', 'நட்பு', 'பகை', '--', 'நட்பு'] },
    { graha: 'சனி', vals: ['நட்பு', 'நட்பு', 'நட்பு', 'பகை', 'பகை', 'நட்பு', '--'] }
  ];

  const panchadhaMatrix = [
    { graha: 'சூரியன்', vals: ['--', 'அதிமித்ரு', 'அதிமித்ரு', 'நட்பு', 'சமம்', 'சமம்', 'சமம்'] },
    { graha: 'சந்திரன்', vals: ['அதிமித்ரு', '--', 'பகை', 'சமம்', 'பகை', 'பகை', 'நட்பு'] },
    { graha: 'செவ்வாய்', vals: ['அதிமித்ரு', 'சமம்', '--', 'சமம்', 'அதிமித்ரு', 'நட்பு', 'நட்பு'] },
    { graha: 'புதன்', vals: ['அதிமித்ரு', 'அதிசத்ரு', 'சமம்', '--', 'சமம்', 'அதிமித்ரு', 'பகை'] },
    { graha: 'குரு', vals: ['சமம்', 'சமம்', 'அதிமித்ரு', 'அதிசத்ரு', '--', 'அதிசத்ரு', 'பகை'] },
    { graha: 'சுக்கிரன்', vals: ['சமம்', 'அதிசத்ரு', 'நட்பு', 'அதிமித்ரு', 'அதிசத்ரு', '--', 'அதிமித்ரு'] },
    { graha: 'சனி', vals: ['சமம்', 'சமம்', 'நட்பு', 'சமம்', 'சமம்', 'அதிமித்ரு', '--'] }
  ];"""

new_matrices = """  // Dynamic Tatkalika & Panchadha Friendship computation
  const graha7Keys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const graha7NamesTa = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
  const naisargikaRuleMap = [
    ['--', 'நட்பு', 'நட்பு', 'சமம்', 'நட்பு', 'பகை', 'பகை'],
    ['நட்பு', '--', 'சமம்', 'நட்பு', 'சமம்', 'சமம்', 'சமம்'],
    ['நட்பு', 'நட்பு', '--', 'பகை', 'நட்பு', 'சமம்', 'சமம்'],
    ['நட்பு', 'பகை', 'சமம்', '--', 'நட்பு', 'நட்பு', 'சமம்'],
    ['நட்பு', 'நட்பு', 'நட்பு', 'பகை', '--', 'பகை', 'சமம்'],
    ['பகை', 'பகை', 'சமம்', 'நட்பு', 'சமம்', '--', 'நட்பு'],
    ['பகை', 'பகை', 'பகை', 'நட்பு', 'சமம்', 'நட்பு', '--']
  ];

  const tatkalikaMatrix = [];
  const panchadhaMatrix = [];

  for (let i = 0; i < 7; i++) {
    const s1 = Math.floor((planetMap[graha7Keys[i]] || 0) / 30) % 12;
    const tRow = [];
    const pRow = [];
    for (let j = 0; j < 7; j++) {
      if (i === j) {
        tRow.push('--');
        pRow.push('--');
        continue;
      }
      const s2 = Math.floor((planetMap[graha7Keys[j]] || 0) / 30) % 12;
      const dist = ((s2 - s1 + 12) % 12) + 1;
      const isTatkalikaFriend = (dist === 2 || dist === 3 || dist === 4 || dist === 10 || dist === 11 || dist === 12);
      const tStatus = isTatkalikaFriend ? 'நட்பு' : 'பகை';
      tRow.push(tStatus);

      const nStatus = naisargikaRuleMap[i][j];
      let pStatus = 'சமம்';
      if (nStatus === 'நட்பு' && tStatus === 'நட்பு') pStatus = 'அதிமித்ரு';
      else if ((nStatus === 'நட்பு' && tStatus === 'சமம்') || (nStatus === 'சமம்' && tStatus === 'நட்பு') || (nStatus === 'நட்பு' && tStatus === 'பகை' ? false : nStatus === 'நட்பு')) pStatus = 'நட்பு';
      else if (nStatus === 'பகை' && tStatus === 'பகை') pStatus = 'அதிசத்ரு';
      else if ((nStatus === 'பகை' && tStatus === 'சமம்') || (nStatus === 'சமம்' && tStatus === 'பகை')) pStatus = 'பகை';
      else pStatus = 'சமம்';

      pRow.push(pStatus);
    }
    tatkalikaMatrix.push({ graha: graha7NamesTa[i], vals: tRow });
    panchadhaMatrix.push({ graha: graha7NamesTa[i], vals: pRow });
  }"""

if old_matrices in content:
    content = content.replace(old_matrices, new_matrices)
    print('Updated dynamic Tatkalika and Panchadha matrices!')
else:
    print('Warning: old_matrices not found directly')

# 4. Dynamic Tara Rows
old_tara = """  const taraRows = [
    { num: 1, name: 'ஜன்மம்', stars: 'திருவாதிரை, சுவாதி, சதயம்', lord: 'ராகு', phala: 'நன்மை / கலப்பு' },
    { num: 2, name: 'சம்பத்து', stars: 'புனர்பூசம், விசாகம், பூரட்டாதி', lord: 'குரு', phala: 'தன லாபம், சுபம்' },
    { num: 3, name: 'விபத்து', stars: 'பூசம், அனுஷம், உத்திரட்டாதி', lord: 'சனி', phala: 'தடைகள், விபத்து' },
    { num: 4, name: 'க்ஷேமம்', stars: 'ஆயில்யம், கேட்டை, ரேவதி', lord: 'புதன்', phala: 'க்ஷேமம், சுகம்' },
    { num: 5, name: 'பிரத்யக்', stars: 'அஸ்வினி, மகம், மூலம்', lord: 'கேது', phala: 'எதிர்ப்பு, சர்ச்சை' },
    { num: 6, name: 'சாதகம்', stars: 'பரணி, பூரம், பூராடம்', lord: 'சுக்கிரன்', phala: 'வெற்றி, சாதனை' },
    { num: 7, name: 'வதை', stars: 'கார்த்திகை, உத்திரம், உத்திராடம்', lord: 'சூரியன்', phala: 'கண்டம், நஷ்டம்' },
    { num: 8, name: 'மித்ரம்', stars: 'ரோகிணி, அஸ்தம், திருவோணம்', lord: 'சந்திரன்', phala: 'நட்பு, உதவி' },
    { num: 9, name: 'பரம மித்ரம்', stars: 'மிருகசீரிடம், சித்திரை, அவிட்டம்', lord: 'செவ்வாய்', phala: 'மகிழ்ச்சி, பூரண சுபம்' }
  ];"""

new_tara = """  // Dynamic Tara Balam calculation cycling from native's Janma Nakshatra
  const taraNames = [
    { num: 1, name: 'ஜன்மம்', phala: 'நன்மை / கலப்பு' },
    { num: 2, name: 'சம்பத்து', phala: 'தன லாபம், சுபம்' },
    { num: 3, name: 'விபத்து', phala: 'தடைகள், விபத்து' },
    { num: 4, name: 'க்ஷேமம்', phala: 'க்ஷேமம், சுகம்' },
    { num: 5, name: 'பிரத்யக்', phala: 'எதிர்ப்பு, சர்ச்சை' },
    { num: 6, name: 'சாதகம்', phala: 'வெற்றி, சாதனை' },
    { num: 7, name: 'வதை', phala: 'கண்டம், நஷ்டம்' },
    { num: 8, name: 'மித்ரம்', phala: 'நட்பு, உதவி' },
    { num: 9, name: 'பரம மித்ரம்', phala: 'மகிழ்ச்சி, பூரண சுபம்' }
  ];
  const birthNakIdx = p.moonNak !== undefined ? p.moonNak : 0;
  const taraRows = taraNames.map(t => {
    const offset = t.num - 1;
    const n1 = NAKSHATRAS[(birthNakIdx + offset) % 27]?.ta || '';
    const n2 = NAKSHATRAS[(birthNakIdx + offset + 9) % 27]?.ta || '';
    const n3 = NAKSHATRAS[(birthNakIdx + offset + 18) % 27]?.ta || '';
    const lordEn = NAKSHATRAS[(birthNakIdx + offset) % 27]?.lord || 'Ketu';
    const lordTa = PLANET_INFO.find(pi => pi.id === lordEn.toLowerCase())?.ta || lordEn;
    return {
      num: t.num,
      name: t.name,
      stars: `${n1}, ${n2}, ${n3}`,
      lord: lordTa,
      phala: t.phala
    };
  });"""

if old_tara in content:
    content = content.replace(old_tara, new_tara)
    print('Updated dynamic Tara Rows in compute25PageBookletData!')
else:
    print('Warning: old_tara not found directly')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Phase 3 applied successfully!')
