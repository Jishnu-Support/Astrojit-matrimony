  // Page 32: Sarvashtavarga Table
  empty.p32 = p18Data.p17;

  // Page 33: Chaldean Numerology
  empty.p33 = p18Data.p18;

  return empty;
}

/**
 * Creates empty structure for the 51-page Thirukanitha Horoscope Booklet ("Janana Jathagam").
 */
export function createEmpty51PageBookletData() {
  const p18Empty = createEmpty18PageBookletData();
  const p21Empty = createEmpty21PageBookletData();
  const p25Empty = createEmpty25PageBookletData();
  const p33Empty = createEmpty33PageBookletData();

  const empty = {
    p1: p18Empty.p1,
    p2: p21Empty.p2, // Vinayagar Stuthi
    p3: p18Empty.p2, // Janana Vivaram & Panchangam
    p4: p18Empty.p3, // Janana Nakshatra Extended Math
    p5: p18Empty.p4, // Rasi / Navamsa
    p6: p18Empty.p5, // Planet Table
    p7: p18Empty.p6, // Sripati Bhavas & 4 Charts
    p8: p33Empty.p9,  // D3 & D7
    p9: p33Empty.p10, // D60 & D30
    p10: p33Empty.p11, // D10 & D16
    p11: p33Empty.p12, // D4 & D12
    p12: p33Empty.p13, // D2 Hora
    p13: p25Empty.p9,  // Shadbala & Bhava Bala
    p14: { table1: [], table2: [] }, // Upagrahas Tables
    p15: { upagrahaChart: [], specialLagnas: [] }, // Special Lagnas & Upagraha Chart
    p16: { naisargika: [], tatkalika: [], grahaHeaders: [] }, // Relationships Naisargika & Tatkalika
    p17: { panchadha: [], avasthas: [], grahaHeaders: [] }, // Panchadha Maitri & Avasthas
    p18: { grahaMatrix: [], grahaHeaders: [] }, // Graha Aspect Angles Matrix 9x9
    p19: { bhavaMatrix: [], grahaHeaders: [] }, // Bhava Aspect Angles Matrix 12x9
    p20: p18Empty.p7, // Dasavarga Table
    p21: {}, // Pancha Pakshi Shastra Full Page
    // Pages 22 to 30: 9 Mahadasha Parikaram pages
    p22: p18Empty.p8,
    p23: p18Empty.p9,
    p24: p18Empty.p10,
    p25: p18Empty.p11,
    p26: p18Empty.p12,
    p27: p18Empty.p13,
    p28: p18Empty.p14,
    p29: p18Empty.p15,
    p30: p18Empty.p16,
    p31: { pasakarRows: [], taraRows: [] }, // Pasakar, Bodhaka & Tara Balam
    p32: { dignitiesTable: [], aspectsTable: [] }, // Dignities, Drishti & Conjunctions
    p33: { sevvaiDosha: {} }, // Sevvai Dosha Comprehensive Analysis
    // Pages 34 to 42: 9 Mahadasha Full Antara Schedules (81 Antaras per page)
    p34: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p35: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p36: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p37: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p38: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p39: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p40: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p41: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    p42: { dasha: { dashaLord: '', bhuktis: [] }, nativeName: '' },
    // Pages 43 to 49: 7 Individual Ashtakavarga Full Pages (Surya to Sani)
    p43: {},
    p44: {},
    p45: {},
    p46: {},
    p47: {},
    p48: {},
    p49: {},
    p50: p18Empty.p17, // Sarvashtavarga Table
    p51: p18Empty.p18  // Chaldean Numerology
  };

  return empty;
}

/**
 * Generate 51-Page Booklet Data with Complete Live Calculations
 */
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
  // Page 33: Sevvai Dosha Comprehensive Analysis
  empty.p33 = {
    sevvaiDosha: p25Data.p16?.sevvaiDosha || {}
  };
  // Pages 34 to 42: 9 Mahadasha Full Antara Schedules (81 Antaras per page)
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
  // Page 50: Sarvashtavarga Table
  empty.p50 = p18Data.p17;
  // Page 51: Chaldean Numerology & Subham
  empty.p51 = p18Data.p18;

  return empty;
}
