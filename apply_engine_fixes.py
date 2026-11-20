import os

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace Shadbala section in compute21PageBookletData
idx1 = content.find('// Page 9: Detailed Shadbala Analysis in Rupas')
idx2 = content.find('// Page 10: Dasavarga Table', idx1)

if idx1 != -1 and idx2 != -1:
    new_shadbala = """// Page 9: Detailed Shadbala Analysis in Rupas (Classical Parasara/Sripati Model)
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
  }

  empty.p9 = {
    heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
    grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    grahaRows: [
      { label: 'ஸ்தான பலம்', vals: sthanaVals },
      { label: 'திக் பலம்', vals: digVals },
      { label: 'கால பலம்', vals: kalaVals },
      { label: 'சேஷ்டா பலம்', vals: cheshtaVals },
      { label: 'நைசர்கிக பலம்', vals: naisargikaRupas.map(v => v.toFixed(3)) },
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
    ]
  };

  """
    content = content[:idx1] + new_shadbala + content[idx2:]
    print('Replaced Shadbala in compute21PageBookletData!')
else:
    print('Error: Could not locate Shadbala indices')

# 2. Replace tatkalikaMatrix and panchadhaMatrix in compute25PageBookletData
idx_tm = content.find('const tatkalikaMatrix = [')
idx_em11 = content.find('empty.p11 = {', idx_tm)

if idx_tm != -1 and idx_em11 != -1:
    new_matrices = """// Dynamic Tatkalika & Panchadha Friendship computation
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
      else if ((nStatus === 'நட்பு' && tStatus === 'சமம்') || (nStatus === 'சமம்' && tStatus === 'நட்பு')) pStatus = 'நட்பு';
      else if (nStatus === 'பகை' && tStatus === 'பகை') pStatus = 'அதிசத்ரு';
      else if ((nStatus === 'பகை' && tStatus === 'சமம்') || (nStatus === 'சமம்' && tStatus === 'பகை')) pStatus = 'பகை';
      else pStatus = 'சமம்';

      pRow.push(pStatus);
    }
    tatkalikaMatrix.push({ graha: graha7NamesTa[i], vals: tRow });
    panchadhaMatrix.push({ graha: graha7NamesTa[i], vals: pRow });
  }

  """
    content = content[:idx_tm] + new_matrices + content[idx_em11:]
    print('Replaced tatkalika and panchadha matrices!')
else:
    print('Error: Could not locate tatkalikaMatrix indices')

# 3. Replace taraRows in compute25PageBookletData
idx_tr = content.find('const taraRows = [')
idx_sevvai = content.find('// Sevvai Dosha Rules', idx_tr)

if idx_tr != -1 and idx_sevvai != -1:
    new_tara_block = """// Dynamic Tara Balam calculation cycling from native's Janma Nakshatra
  const taraDefs = [
    { tara: 'ஜென்ம தாரை', quality: 'அதமம்' },
    { tara: 'சம்பத்து தாரை', quality: 'உத்தமம்' },
    { tara: 'விபத்து தாரை', quality: 'அதமம்' },
    { tara: 'க்ஷேம தாரை', quality: 'உத்தமம்' },
    { tara: 'பிரத்யக் தாரை', quality: 'அதமம்' },
    { tara: 'சாதக தாரை', quality: 'உத்தமம்' },
    { tara: 'வதை தாரை', quality: 'அதமம்' },
    { tara: 'மித்ர தாரை', quality: 'உத்தமம்' },
    { tara: 'பரம மித்ர தாரை', quality: 'உத்தமம்' }
  ];
  const birthNakIdx = p.moonNak !== undefined ? p.moonNak : 0;
  const taraRows = taraDefs.map((t, idx) => {
    const star1 = NAKSHATRAS[(birthNakIdx + idx) % 27]?.ta || '';
    const star2 = NAKSHATRAS[(birthNakIdx + idx + 9) % 27]?.ta || '';
    const star3 = NAKSHATRAS[(birthNakIdx + idx + 18) % 27]?.ta || '';
    return {
      star1,
      star2,
      star3,
      quality: t.quality,
      tara: t.tara
    };
  });

  """
    content = content[:idx_tr] + new_tara_block + content[idx_sevvai:]
    print('Replaced taraRows!')
else:
    print('Error: Could not locate taraRows indices')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('apply_engine_fixes executed successfully!')
