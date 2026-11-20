

/**
 * Compute Planetary Dignities (Table 1) and Aspects/Conjunctions (Table 2) for Page 15
 */
export function computeDignitiesAndAspects(planetMap, planetSigns, lagnaRasiIdx) {
  const grahaNamesTa = {
    sun: 'சூரியன்', moon: 'சந்திரன்', mars: 'செவ்வாய்', mercury: 'புதன்',
    jupiter: 'குரு', venus: 'சுக்கிரன்', saturn: 'சனி', rahu: 'ராகு', ketu: 'கேது'
  };
  const grahaShorts = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத',
    jupiter: 'குரு', venus: 'சுக்', saturn: 'சனி', rahu: 'ராகு', ketu: 'கேது'
  };
  const rasiShorts = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];

  // Dignity maps
  const utchaSigns = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6, rahu: 1, ketu: 7 };
  const neechaSigns = { sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0, rahu: 7, ketu: 1 };
  const moolaSigns = { sun: 4, moon: 1, mars: 0, mercury: 5, jupiter: 8, venus: 6, saturn: 10, rahu: 10, ketu: 4 };
  const ownSigns = {
    sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5],
    jupiter: [8, 11], venus: [1, 6], saturn: [9, 10], rahu: [], ketu: []
  };

  const getD9Sign = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const pada = Math.floor(d / (30 / 9));
    const start = (s % 3 === 0) ? s : (s % 3 === 1) ? (s + 8) % 12 : (s + 4) % 12;
    return (start + pada) % 12;
  };

  // Evaluate each planet
  const kendra = [];
  const trikona = [];
  const vakra = [];
  const asthamana = [];
  const utcha = [];
  const neecha = [];
  const vargottama = [];
  const moolatrikona = [];

  const sunLon = planetMap['sun'] || 0;

  const grahas = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  for (const g of grahas) {
    const sign = planetSigns[g];
    if (sign === undefined) continue;
    const diffFromLagna = ((sign - lagnaRasiIdx + 12) % 12) + 1;
    const label = (g === 'mercury' || g === 'venus' || g === 'saturn') ? `${grahaShorts[g]}(வ)` : grahaShorts[g];

    if ([1, 4, 7, 10].includes(diffFromLagna)) kendra.push(label);
    if ([5, 9].includes(diffFromLagna)) trikona.push(label);

    // Retrograde
    if (g === 'mercury' || g === 'venus' || g === 'saturn') vakra.push(`${grahaShorts[g]}(வ)`);

    // Combustion with Sun
    if (g !== 'sun' && g !== 'rahu' && g !== 'ketu') {
      const dist = Math.abs((planetMap[g] || 0) - sunLon);
      const minDist = Math.min(dist, 360 - dist);
      if (minDist <= 14) asthamana.push(label);
    }

    if (sign === utchaSigns[g]) utcha.push(label);
    if (sign === neechaSigns[g]) neecha.push(label);
    if (sign === moolaSigns[g]) moolatrikona.push(label);

    const d9 = getD9Sign(planetMap[g] || 0);
    if (d9 === sign) vargottama.push(label);
  }

  // Dignity table
  const dignitiesTable = [
    { label: 'கேந்திர நிலை', val: kendra.join(', ') || '---' },
    { label: 'திரிகோண நிலை', val: trikona.join(', ') || '---' },
    { label: 'வக்ர நிலை', val: vakra.join(', ') || '---' },
    { label: 'அஸ்தமன நிலை', val: asthamana.join(', ') || '---' },
    { label: 'உச்ச நிலை', val: utcha.join(', ') || '---' },
    { label: 'நீச்ச நிலை', val: neecha.join(', ') || '---' },
    { label: 'பரிவர்த்தனை நிலை', val: '---' },
    { label: 'வர்க்கோத்தம நிலை', val: vargottama.join(', ') || '---' },
    { label: 'ஸ்தம்பன நிலை', val: '---' },
    { label: 'மூலத்திரிகோண நிலை', val: moolatrikona.join(', ') || '---' }
  ];

  // Aspects & Conjunctions Table
  const aspectsTable = [];
  for (const g of grahas) {
    const sign = planetSigns[g];
    const gName = (g === 'mercury' || g === 'venus' || g === 'saturn') ? `${grahaNamesTa[g]}(வ)` : grahaNamesTa[g];
    const rasi = rasiShorts[sign] || '';

    // Dignity status string
    let status = 'சமம்';
    if (sign === utchaSigns[g]) status = 'உச்சம்';
    else if (sign === neechaSigns[g]) status = 'நீசம்';
    else if ((ownSigns[g] || []).includes(sign)) status = 'ஆட்சி';
    else if (g === 'moon' || g === 'mercury') status = 'நட்பு';
    else if (g === 'rahu' || g === 'ketu') status = 'பகை';

    // Conjunctions (same sign)
    const conj = [];
    for (const other of grahas) {
      if (other !== g && planetSigns[other] === sign) {
        conj.push(grahaShorts[other]);
      }
    }

    // Aspects received from other planets
    const seenBy = [];
    for (const other of grahas) {
      if (other === g) continue;
      const otherSign = planetSigns[other];
      const distSign = ((sign - otherSign + 12) % 12) + 1; // house distance from other to g
      let casts = false;
      if (distSign === 7) casts = true; // All aspect 7th
      if (other === 'mars' && (distSign === 4 || distSign === 8)) casts = true;
      if ((other === 'jupiter' || other === 'rahu' || other === 'ketu') && (distSign === 5 || distSign === 9)) casts = true;
      if (other === 'saturn' && (distSign === 3 || distSign === 10)) casts = true;

      if (casts) seenBy.push(grahaShorts[other]);
    }

    aspectsTable.push({
      graha: gName,
      rasi,
      status,
      aspectsBy: seenBy.length ? seenBy.join(', ') : '---',
      conjunctions: conj.length ? conj.join(', ') : '---'
    });
  }

  return { dignitiesTable, aspectsTable };
}

/**
 * Creates empty structure for the 33-page Thirukanitha Horoscope Booklet ("Janana Jathagam").
 */
export function createEmpty33PageBookletData() {
  const p18Empty = createEmpty18PageBookletData();
  const p21Empty = createEmpty21PageBookletData();

  const empty = {
    p1: p18Empty.p1,
    p2: p21Empty.p2, // Vinayagar Stuthi
    p3: p21Empty.p3, // Navagraha Stothram
    p4: p18Empty.p2, // Janana Vivaram
    p5: p18Empty.p3, // Janana Nakshatra Computations
    p6: p18Empty.p4, // Rasi / Navamsa
    p7: p18Empty.p5, // Planet Table
    p8: p18Empty.p6, // Sripati Bhavas & 4 Charts
    p9: { heading: 'வர்க்கச் சக்கரங்கள்', leftChart: { name: '3-திரேக்காணம்', cells: [], desc: '' }, rightChart: { name: '7-சப்தாம்சம்', cells: [], desc: '' } },
    p10: { heading: 'வர்க்கச் சக்கரங்கள்', leftChart: { name: '60-சஷ்டியாம்சம்', cells: [], desc: '' }, rightChart: { name: '30-திரிம்சாம்சம்', cells: [], desc: '' } },
    p11: { heading: 'வர்க்கச் சக்கரங்கள்', leftChart: { name: '10-தசாம்சம்', cells: [], desc: '' }, rightChart: { name: '16-சோடசாம்சம்', cells: [], desc: '' } },
    p12: { heading: 'வர்க்கச் சக்கரங்கள்', leftChart: { name: '4-சதுராம்சம்', cells: [], desc: '' }, rightChart: { name: '12-துவாதசாம்சம்', cells: [], desc: '' } },
    p13: { heading: 'ஓரை', horaChart: [] },
    p14: p18Empty.p7, // Dasavarga Table
    p15: { dignitiesTable: [], aspectsTable: [] }, // Dignities & Aspects
    // Pages 16 to 24: 9 Mahadasha Full Antara Schedules
    p16: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p17: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p18: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p19: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p20: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p21: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p22: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p23: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p24: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    // Pages 25 to 31: Individual BAV Full Pages
    p25: {}, // Sun
    p26: {}, // Moon
    p27: {}, // Mars
    p28: {}, // Mercury
    p29: {}, // Jupiter
    p30: {}, // Venus
    p31: {}, // Saturn
    p32: p18Empty.p17, // Sarvashtavarga Table
    p33: p18Empty.p18  // Chaldean Numerology
  };

  return empty;
}

/**
 * Generate 33-Page Booklet Data with Complete Live Calculations
 */
export function compute33PageBookletData(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const p21Data = compute21PageBookletData(horoInput);
  const p1Data = computeHoroscopePagerData(horoInput);
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

  const divCharts = computeDivisionalCharts(planetMap, lagnaLon);
  const allAntaras = computeAntaraEndDates(m.dob, m.dobTime, p.dashaBalance, lagnaRasiIdx, planetMap);

  const empty = createEmpty33PageBookletData();

  empty.p1 = p18Data.p1;
  empty.p2 = p21Data.p2; // Vinayagar Stuthi
  empty.p3 = p21Data.p3; // Navagraha Stothram
  empty.p4 = p18Data.p2; // Janana Vivaram & Panchanga Kootas
  empty.p5 = p18Data.p3; // Janana Nakshatra Details
  empty.p6 = p18Data.p4; // Rasi / Navamsa
  empty.p7 = p18Data.p5; // Planet Table
  empty.p8 = p18Data.p6; // Sripati Bhavas & 4 Charts

  // Pages 9-12: Divisional 2-chart pages with descriptions
  empty.p9 = {
    heading: 'வர்க்கச் சக்கரங்கள்',
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

  empty.p10 = {
    heading: 'வர்க்கச் சக்கரங்கள்',
    leftChart: {
      name: '60-சஷ்டியாம்சம்',
      cells: divCharts.d60,
      desc: 'சஷ்டியாம்ச சக்கரம் ஒருவரின் வாழ்க்கைப் பலன்களை துல்லியமாக வரையறுத்துக் கூறவும், இரட்டை குழந்தைகளின் வேறுபாடான பலன்களை காணவும் உதவுகிறது. சில சமயங்களில் உறுதியான முடிவுகளை எடுக்கவும் உதவி செய்கிறது.'
    },
    rightChart: {
      name: '30-திரிம்சாம்சம்',
      cells: divCharts.d30,
      desc: 'திரிம்சாம்ச சக்கரம் ஜாதகருக்கு ஏற்படும் திடீர் மருத்துவசெலவுகள், மறைமுக செலவுகள், எதிர்பார்ப்புகள் நிறைவேறும் நிலை ஆகியவற்றை உறுதிபடுத்துகிறது.'
    }
  };

  empty.p11 = {
    heading: 'வர்க்கச் சக்கரங்கள்',
    leftChart: {
      name: '10-தசாம்சம்',
      cells: divCharts.d10,
      desc: 'தசாம்ச சக்கரம் ஜாதகரின் தொழில் நிலை, ஊதியம், வளர்ச்சி, திறமை, உழைப்பு, சாதனை, ஈடுபாடு ஆகியவற்றை உறுதிபடுத்துகிறது. சூரியன், புதன், குரு மற்றும் பத்தாம் வீட்டதிபன் நிலை முக்கியமானதாகும்.'
    },
    rightChart: {
      name: '16-சோடசாம்சம்',
      cells: divCharts.d16,
      desc: 'சோடசாம்ச சக்கரமானது ஜாதகரின் லட்சியங்களையும், மன உறுதியான செயல்பாடுகளையும், வீடு- நிலம்- வாகன வசதி ஆகியவற்றை மேலும் வரையறுத்து கூறவும் உதவுகிறது.'
    }
  };

  empty.p12 = {
    heading: 'வர்க்கச் சக்கரங்கள்',
    leftChart: {
      name: '4-சதுராம்சம்',
      cells: divCharts.d4,
      desc: 'சதுராம்ச சக்கரம் ஜாதகரின் வளமை, பதவி, குடும்பத்தினரின் மகிழ்ச்சி நிலை, மனஉற்சாகம் ஆகியவற்றை உறுதிபடுத்துகிறது. சந்திரன், புதன் மற்றும் நான்காம் பாவாதிபன் நிலைகள் முக்கியமானவையாகும்.'
    },
    rightChart: {
      name: '12-துவாதசாம்சம்',
      cells: divCharts.d12,
      desc: 'துவாதசாம்ச சக்கரம் ஜாதகரின் பரம்பரை வழி ஆதாயங்கள், பூர்வ புண்ணியம், பெற்றோரின் ஆதரவு ஆகியவற்றை உறுதிபடுத்துகிறது.'
    }
  };

  // Page 13: Hora chart
  empty.p13 = {
    heading: 'ஓரை',
    horaChart: divCharts.d2
  };

  // Page 14: Dasavarga Table
  empty.p14 = p18Data.p7;

  // Page 15: Dignities & Aspects
  empty.p15 = computeDignitiesAndAspects(planetMap, planetSigns, lagnaRasiIdx);

  // Pages 16 to 24: 9 Mahadasha Full Antara Schedules
  for (let i = 0; i < 9; i++) {
    empty[`p${16 + i}`] = {
      dasha: allAntaras[i] || { dashaLord: '', bhuktis: [] },
      nativeName: p1Data.person.name
    };
  }

  // Pages 25 to 31: Individual BAV Full Pages
  empty.p25 = computeBavDetailsForGraha('sun', planetSigns, lagnaRasiIdx);
  empty.p26 = computeBavDetailsForGraha('moon', planetSigns, lagnaRasiIdx);
  empty.p27 = computeBavDetailsForGraha('mars', planetSigns, lagnaRasiIdx);
  empty.p28 = computeBavDetailsForGraha('mercury', planetSigns, lagnaRasiIdx);
  empty.p29 = computeBavDetailsForGraha('jupiter', planetSigns, lagnaRasiIdx);
  empty.p30 = computeBavDetailsForGraha('venus', planetSigns, lagnaRasiIdx);
  empty.p31 = computeBavDetailsForGraha('saturn', planetSigns, lagnaRasiIdx);

  // Page 32: Sarvashtavarga Table
  empty.p32 = p18Data.p17;

  // Page 33: Chaldean Numerology
  empty.p33 = p18Data.p18;

  return empty;
}
