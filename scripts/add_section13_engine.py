import re

# 1. Read thirukanithaEngine.js
with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    engine = f.read()

compute_func = """
/**
 * SECTION 13: Planetary Relationships & Avasthas (Maharishi Parashara)
 * 1. Naisargika (Natural) Maitri
 * 2. Tatkalika (Temporal) Maitri
 * 3. Panchadha (5-Fold Compound) Maitri
 * 4. Planetary Avasthas (Baladi, Jagradadi, Deeptadi, Shayanadi 12, Mandalam)
 */
export function computePlanetaryRelationshipsAndAvasthas(planetRows, lagnaDeg, birthDetails = {}) {
  const PLANET_ORDER = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const PLANET_NAMES = {
    sun: { ta: 'சூரியன்', en: 'Sun', num: 1 },
    moon: { ta: 'சந்திரன்', en: 'Moon', num: 2 },
    mars: { ta: 'செவ்வாய்', en: 'Mars', num: 3 },
    mercury: { ta: 'புதன்', en: 'Mercury', num: 4 },
    jupiter: { ta: 'குரு', en: 'Jupiter', num: 5 },
    venus: { ta: 'சுக்கிரன்', en: 'Venus', num: 6 },
    saturn: { ta: 'சனி', en: 'Saturn', num: 7 },
    rahu: { ta: 'ராகு', en: 'Rahu', num: 8 },
    ketu: { ta: 'கேது', en: 'Ketu', num: 9 }
  };

  const RASHI_LORDS = [
    'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
    'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'
  ];

  const RASHI_NAMES = [
    { ta: 'மேஷம்', en: 'Aries' },
    { ta: 'ரிஷபம்', en: 'Taurus' },
    { ta: 'மிதுனம்', en: 'Gemini' },
    { ta: 'கடகம்', en: 'Cancer' },
    { ta: 'சிம்மம்', en: 'Leo' },
    { ta: 'கன்னி', en: 'Virgo' },
    { ta: 'துலாம்', en: 'Libra' },
    { ta: 'விருச்சிகம்', en: 'Scorpio' },
    { ta: 'தனுசு', en: 'Sagittarius' },
    { ta: 'மகரம்', en: 'Capricorn' },
    { ta: 'கும்பம்', en: 'Aquarius' },
    { ta: 'மீனம்', en: 'Pisces' }
  ];

  const NAISARGIKA = {
    sun: {
      moolatrikona: 'சிம்மம் (0° - 20°)',
      exaltation: 'மேஷம் (10°)',
      debilitation: 'துலாம் (10°)',
      own: 'சிம்மம்',
      friends: ['moon', 'mars', 'jupiter'],
      neutrals: ['mercury'],
      enemies: ['venus', 'saturn', 'rahu', 'ketu'],
      friendsTa: 'சந்திரன், செவ்வாய், குரு',
      neutralsTa: 'புதன்',
      enemiesTa: 'சுக்கிரன், சனி, ராகு, கேது'
    },
    moon: {
      moolatrikona: 'ரிஷபம் (4° - 30°)',
      exaltation: 'ரிஷபம் (3°)',
      debilitation: 'விருச்சிகம் (3°)',
      own: 'கடகம்',
      friends: ['sun', 'mercury'],
      neutrals: ['mars', 'jupiter', 'venus', 'saturn'],
      enemies: [],
      friendsTa: 'சூரியன், புதன்',
      neutralsTa: 'செவ்வாய், குரு, சுக்கிரன், சனி',
      enemiesTa: 'எதிரிகள் இல்லை (None)'
    },
    mars: {
      moolatrikona: 'மேஷம் (0° - 12°)',
      exaltation: 'மகரம் (28°)',
      debilitation: 'கடகம் (28°)',
      own: 'மேஷம், விருச்சிகம்',
      friends: ['sun', 'moon', 'jupiter'],
      neutrals: ['venus', 'saturn'],
      enemies: ['mercury', 'rahu'],
      friendsTa: 'சூரியன், சந்திரன், குரு',
      neutralsTa: 'சுக்கிரன், சனி',
      enemiesTa: 'புதன், ராகு'
    },
    mercury: {
      moolatrikona: 'கன்னி (16° - 20°)',
      exaltation: 'கன்னி (15°)',
      debilitation: 'மீனம் (15°)',
      own: 'மிதுனம், கன்னி',
      friends: ['sun', 'venus'],
      neutrals: ['mars', 'jupiter', 'saturn'],
      enemies: ['moon'],
      friendsTa: 'சூரியன், சுக்கிரன்',
      neutralsTa: 'செவ்வாய், குரு, சனி',
      enemiesTa: 'சந்திரன்'
    },
    jupiter: {
      moolatrikona: 'தனுசு (0° - 13°)',
      exaltation: 'கடகம் (5°)',
      debilitation: 'மகரம் (5°)',
      own: 'தனுசு, மீனம்',
      friends: ['sun', 'moon', 'mars'],
      neutrals: ['saturn'],
      enemies: ['mercury', 'venus'],
      friendsTa: 'சூரியன், சந்திரன், செவ்வாய்',
      neutralsTa: 'சனி',
      enemiesTa: 'புதன், சுக்கிரன்'
    },
    venus: {
      moolatrikona: 'துலாம் (0° - 15°)',
      exaltation: 'மீனம் (27°)',
      debilitation: 'கன்னி (27°)',
      own: 'ரிஷபம், துலாம்',
      friends: ['mercury', 'saturn', 'rahu', 'ketu'],
      neutrals: ['mars', 'jupiter'],
      enemies: ['sun', 'moon'],
      friendsTa: 'புதன், சனி, ராகு, கேது',
      neutralsTa: 'செவ்வாய், குரு',
      enemiesTa: 'சூரியன், சந்திரன்'
    },
    saturn: {
      moolatrikona: 'கும்பம் (0° - 20°)',
      exaltation: 'துலாம் (20°)',
      debilitation: 'மேஷம் (20°)',
      own: 'மகரம், கும்பம்',
      friends: ['mercury', 'venus', 'rahu'],
      neutrals: ['jupiter'],
      enemies: ['sun', 'moon', 'mars'],
      friendsTa: 'புதன், சுக்கிரன், ராகு',
      neutralsTa: 'குரு',
      enemiesTa: 'சூரியன், சந்திரன், செவ்வாய்'
    },
    rahu: {
      moolatrikona: 'கும்பம் (0° - 30°)',
      exaltation: 'ரிஷபம் (20°)',
      debilitation: 'விருச்சிகம் (20°)',
      own: 'கும்பம்',
      friends: ['venus', 'saturn', 'mercury'],
      neutrals: ['jupiter'],
      enemies: ['sun', 'moon', 'mars'],
      friendsTa: 'சுக்கிரன், சனி, புதன்',
      neutralsTa: 'குரு',
      enemiesTa: 'சூரியன், சந்திரன், செவ்வாய்'
    },
    ketu: {
      moolatrikona: 'விருச்சிகம் (0° - 30°)',
      exaltation: 'விருச்சிகம் (20°)',
      debilitation: 'ரிஷபம் (20°)',
      own: 'விருச்சிகம்',
      friends: ['mars', 'venus', 'jupiter'],
      neutrals: ['mercury', 'saturn'],
      enemies: ['sun', 'moon'],
      friendsTa: 'செவ்வாய், சுக்கிரன், குரு',
      neutralsTa: 'புதன், சனி',
      enemiesTa: 'சூரியன், சந்திரன்'
    }
  };

  const planetMap = {};
  planetRows.forEach(p => {
    if (p && p.id) planetMap[p.id] = p;
  });

  const sunLong = planetMap.sun ? planetMap.sun.longitude : 0;
  const moonNak = birthDetails.moonNak !== undefined ? birthDetails.moonNak : (planetMap.moon ? planetMap.moon.nakshatra : 0);
  const birthHour = birthDetails.birthHour !== undefined ? birthDetails.birthHour : 4.833;
  const sunriseHour = birthDetails.sunriseHour !== undefined ? birthDetails.sunriseHour : 6.0;
  const birthGhatis = Math.max(0, (birthHour - sunriseHour) * 2.5);

  // 1. Naisargika List
  const naisargikaList = PLANET_ORDER.map(pId => {
    const info = NAISARGIKA[pId];
    return {
      id: pId,
      nameTa: PLANET_NAMES[pId].ta,
      nameEn: PLANET_NAMES[pId].en,
      moolatrikona: info.moolatrikona,
      exaltation: info.exaltation,
      debilitation: info.debilitation,
      own: info.own,
      friendsTa: info.friendsTa,
      neutralsTa: info.neutralsTa,
      enemiesTa: info.enemiesTa
    };
  });

  // 2. Tatkalika Matrix & Lists
  const tatkalikaData = PLANET_ORDER.map(p1Id => {
    const p1 = planetMap[p1Id];
    const r1 = p1 ? p1.rasi : 0;
    const friends = [];
    const enemies = [];
    const relationships = {};

    PLANET_ORDER.forEach(p2Id => {
      if (p1Id === p2Id) {
        relationships[p2Id] = { val: 0, textTa: 'சுயஸ்தானம்', textEn: 'Self', isFriend: false };
        return;
      }
      const p2 = planetMap[p2Id];
      const r2 = p2 ? p2.rasi : 0;
      const houseDist = ((r2 - r1 + 12) % 12) + 1;
      const isFriend = [2, 3, 4, 10, 11, 12].includes(houseDist);
      if (isFriend) {
        friends.push(PLANET_NAMES[p2Id].ta);
      } else {
        enemies.push(PLANET_NAMES[p2Id].ta);
      }
      relationships[p2Id] = {
        houseDist,
        val: isFriend ? 1 : -1,
        textTa: isFriend ? 'தற்கால மித்துரு' : 'தற்கால சத்துரு',
        textEn: isFriend ? 'Temporal Friend' : 'Temporal Enemy',
        isFriend
      };
    });

    return {
      id: p1Id,
      nameTa: PLANET_NAMES[p1Id].ta,
      nameEn: PLANET_NAMES[p1Id].en,
      rasiName: p1 ? RASHI_NAMES[r1].ta : '',
      friendsTa: friends.join(', ') || 'எவருமில்லை',
      enemiesTa: enemies.join(', ') || 'எவருமில்லை',
      relationships
    };
  });

  // 3. Panchadha Compound Matrix
  const panchadhaData = PLANET_ORDER.map(p1Id => {
    const p1 = planetMap[p1Id];
    const r1 = p1 ? p1.rasi : 0;
    const nInfo = NAISARGIKA[p1Id];
    const relations = {};
    const adhiMithru = [];
    const mithru = [];
    const sama = [];
    const shatru = [];
    const adhiShatru = [];

    PLANET_ORDER.forEach(p2Id => {
      if (p1Id === p2Id) {
        relations[p2Id] = { score: 0, textTa: 'சுயஸ்தானம்', textEn: 'Self', badge: 'bg-stone-100 text-stone-700' };
        return;
      }
      const p2 = planetMap[p2Id];
      const r2 = p2 ? p2.rasi : 0;

      let nVal = 0;
      if (nInfo.friends.includes(p2Id)) nVal = 1;
      else if (nInfo.enemies.includes(p2Id)) nVal = -1;

      const houseDist = ((r2 - r1 + 12) % 12) + 1;
      const tVal = [2, 3, 4, 10, 11, 12].includes(houseDist) ? 1 : -1;

      const score = nVal + tVal;
      let textTa = 'சமம்';
      let textEn = 'Neutral (Sama)';
      let badge = 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300';

      if (score === 2) {
        textTa = 'அதி மித்துரு';
        textEn = 'Great Friend (Adhi Mithru)';
        badge = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 font-bold';
        adhiMithru.push(PLANET_NAMES[p2Id].ta);
      } else if (score === 1) {
        textTa = 'மித்துரு';
        textEn = 'Friend (Mithru)';
        badge = 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-300 font-semibold';
        mithru.push(PLANET_NAMES[p2Id].ta);
      } else if (score === 0) {
        textTa = 'சமம்';
        textEn = 'Neutral (Sama)';
        badge = 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300';
        sama.push(PLANET_NAMES[p2Id].ta);
      } else if (score === -1) {
        textTa = 'சத்துரு';
        textEn = 'Enemy (Shatru)';
        badge = 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 font-semibold';
        shatru.push(PLANET_NAMES[p2Id].ta);
      } else if (score === -2) {
        textTa = 'அதி சத்துரு';
        textEn = 'Great Enemy (Adhi Shatru)';
        badge = 'bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 border border-rose-500 font-bold';
        adhiShatru.push(PLANET_NAMES[p2Id].ta);
      }

      relations[p2Id] = { score, textTa, textEn, badge };
    });

    const signLordId = RASHI_LORDS[r1];
    let presentDignityTa = 'சமம்';
    let presentDignityBadge = 'bg-amber-100 text-amber-900 border border-amber-300';

    if (p1) {
      if (p1Id === 'sun' && r1 === 0) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'moon' && r1 === 1) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'mars' && r1 === 9) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'mercury' && r1 === 5) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'jupiter' && r1 === 3) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'venus' && r1 === 11) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'saturn' && r1 === 6) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'rahu' && (r1 === 1 || r1 === 2)) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === 'ketu' && (r1 === 7 || r1 === 8)) { presentDignityTa = 'உச்சம் (Exalted)'; presentDignityBadge = 'bg-amber-400 text-stone-900 font-bold'; }
      else if (p1Id === signLordId) {
        presentDignityTa = 'ஆட்சி (Own)';
        presentDignityBadge = 'bg-emerald-200 text-emerald-950 font-bold';
      } else if (relations[signLordId]) {
        presentDignityTa = relations[signLordId].textTa;
        presentDignityBadge = relations[signLordId].badge;
      }
    }

    return {
      id: p1Id,
      nameTa: PLANET_NAMES[p1Id].ta,
      nameEn: PLANET_NAMES[p1Id].en,
      rasiName: p1 ? RASHI_NAMES[r1].ta : '',
      presentDignityTa,
      presentDignityBadge,
      adhiMithruTa: adhiMithru.join(', ') || 'இல்லை',
      mithruTa: mithru.join(', ') || 'இல்லை',
      samaTa: sama.join(', ') || 'இல்லை',
      shatruTa: shatru.join(', ') || 'இல்லை',
      adhiShatruTa: adhiShatru.join(', ') || 'இல்லை',
      relations
    };
  });

  // 4. Planetary Avasthas, Mandalam & Dasha Samaya States
  const SHAYANADI_AVASTHAS = [
    { num: 1, ta: 'சயன அவஸ்தை (Shayana)', en: 'Shayana (Resting / In Bed)', effectTa: 'சுகபோகம், அமைதி, யோக பலன்', badge: 'bg-indigo-100 text-indigo-900' },
    { num: 2, ta: 'உபவேஷன அவஸ்தை (Upaveshana)', en: 'Upaveshana (Deliberating)', effectTa: 'ஆராய்ச்சி, அறிவுத் தெளிவு, கௌரவம்', badge: 'bg-blue-100 text-blue-900' },
    { num: 3, ta: 'நேத்ரபாணி அவஸ்தை (Netrapani)', en: 'Netrapani (Restless)', effectTa: 'கண் பார்வை கவனம், அலைச்சல்', badge: 'bg-rose-100 text-rose-900' },
    { num: 4, ta: 'பிரகாஷன அவஸ்தை (Prakasana)', en: 'Prakasana (Radiant / Renown)', effectTa: 'புகழ், கீர்த்தி, அதிகார பலம்', badge: 'bg-amber-200 text-amber-950 font-bold' },
    { num: 5, ta: 'கமனா அவஸ்தை (Gamana)', en: 'Gamana (Travelling)', effectTa: 'தூர தேசப் பயணம், இடப்பெயர்ச்சி', badge: 'bg-cyan-100 text-cyan-900' },
    { num: 6, ta: 'ஆகமனா அவஸ்தை (Agamana)', en: 'Agamana (Arrival)', effectTa: 'இல்லம் திரும்புதல், சுபகாரியம்', badge: 'bg-teal-100 text-teal-900' },
    { num: 7, ta: 'சபா அவஸ்தை (Sabhavastha)', en: 'Sabhavastha (In Council)', effectTa: 'சபையில் மதிப்பு, தலைமை தாங்குதல்', badge: 'bg-emerald-200 text-emerald-950 font-bold' },
    { num: 8, ta: 'ஆகம அவஸ்தை (Agama)', en: 'Agama (Acquisition)', effectTa: 'தன லாபம், சாஸ்திர ஞானம்', badge: 'bg-emerald-100 text-emerald-900 font-semibold' },
    { num: 9, ta: 'போஜன அவஸ்தை (Bhojana)', en: 'Bhojana (Feasting)', effectTa: 'அறுசுவை உணவு, தான்ய விருத்தி', badge: 'bg-orange-100 text-orange-900' },
    { num: 10, ta: 'நிருத்யலிப்சா அவஸ்தை (Nrityalipsa)', en: 'Nrityalipsa (Joy / Arts)', effectTa: 'கலை ஆர்வம், உற்சாகம், மகிழ்ச்சி', badge: 'bg-purple-100 text-purple-900' },
    { num: 11, ta: 'கௌதுக அவஸ்தை (Kauthuka)', en: 'Kauthuka (Eager / Curious)', effectTa: 'குதூகலம், வெற்றி, நற்செய்தி', badge: 'bg-amber-100 text-amber-900' },
    { num: 12, ta: 'நித்ரா அவஸ்தை (Nidra)', en: 'Nidra (Sleeping)', effectTa: 'மந்த நிலை, சோம்பல், தாமதம்', badge: 'bg-stone-200 text-stone-700' }
  ];

  const avasthasData = PLANET_ORDER.map(pId => {
    const p = planetMap[pId];
    if (!p) return null;

    const rasi = p.rasi;
    const degInSign = p.longitude % 30;
    const isOdd = rasi % 2 === 0;

    let baladi = { ta: 'யுவ அவஸ்தை (Yuva)', en: 'Yuva (Adult)', potency: '100% (முழு பலம்)', badge: 'bg-emerald-100 text-emerald-900 font-bold' };
    if (isOdd) {
      if (degInSign < 6) baladi = { ta: 'பால அவஸ்தை (Bala)', en: 'Bala (Infant)', potency: '25% (கால் பலம்)', badge: 'bg-amber-100 text-amber-900' };
      else if (degInSign < 12) baladi = { ta: 'குமார அவஸ்தை (Kumara)', en: 'Kumara (Youth)', potency: '50% (அரை பலம்)', badge: 'bg-blue-100 text-blue-900' };
      else if (degInSign < 18) baladi = { ta: 'யுவ அவஸ்தை (Yuva)', en: 'Yuva (Adult)', potency: '100% (முழு பலம்)', badge: 'bg-emerald-200 text-emerald-950 font-bold' };
      else if (degInSign < 24) baladi = { ta: 'விருத்த அவஸ்தை (Vriddha)', en: 'Vriddha (Old)', potency: '15% (குறைந்த பலம்)', badge: 'bg-stone-200 text-stone-800' };
      else baladi = { ta: 'மிருத அவஸ்தை (Mrita)', en: 'Mrita (Dead)', potency: '0% (செயலற்றது)', badge: 'bg-rose-100 text-rose-800' };
    } else {
      if (degInSign < 6) baladi = { ta: 'மிருத அவஸ்தை (Mrita)', en: 'Mrita (Dead)', potency: '0% (செயலற்றது)', badge: 'bg-rose-100 text-rose-800' };
      else if (degInSign < 12) baladi = { ta: 'விருத்த அவஸ்தை (Vriddha)', en: 'Vriddha (Old)', potency: '15% (குறைந்த பலம்)', badge: 'bg-stone-200 text-stone-800' };
      else if (degInSign < 18) baladi = { ta: 'யுவ அவஸ்தை (Yuva)', en: 'Yuva (Adult)', potency: '100% (முழு பலம்)', badge: 'bg-emerald-200 text-emerald-950 font-bold' };
      else if (degInSign < 24) baladi = { ta: 'குமார அவஸ்தை (Kumara)', en: 'Kumara (Youth)', potency: '50% (அரை பலம்)', badge: 'bg-blue-100 text-blue-900' };
      else baladi = { ta: 'பால அவஸ்தை (Bala)', en: 'Bala (Infant)', potency: '25% (கால் பலம்)', badge: 'bg-amber-100 text-amber-900' };
    }

    const panchaP = panchadhaData.find(x => x.id === pId);
    let jagradadi = { ta: 'ஸ்வப்ன அவஸ்தை (Swapna)', en: 'Swapna (Dreaming)', potency: '50%', badge: 'bg-amber-100 text-amber-900' };
    if (panchaP) {
      if (panchaP.presentDignityTa.includes('உச்சம்') || panchaP.presentDignityTa.includes('ஆட்சி')) {
        jagradadi = { ta: 'ஜாக்ரத் அவஸ்தை (Jagrata)', en: 'Jagrata (Awake)', potency: '100%', badge: 'bg-emerald-200 text-emerald-950 font-bold' };
      } else if (panchaP.presentDignityTa.includes('பகை') || panchaP.presentDignityTa.includes('நீசம்')) {
        jagradadi = { ta: 'சுஷுப்தி அவஸ்தை (Sushupti)', en: 'Sushupti (Sleeping)', potency: '0%', badge: 'bg-rose-100 text-rose-900' };
      }
    }

    let deeptadi = { ta: 'சாந்தா (Shanta)', en: 'Shanta (Peaceful)', badge: 'bg-green-100 text-green-900' };
    const diffFromSun = Math.abs(p.longitude - sunLong);
    const isCombust = pId !== 'sun' && pId !== 'rahu' && pId !== 'ketu' && (diffFromSun < 6 || diffFromSun > 354);

    if (isCombust) {
      deeptadi = { ta: 'விகலா அவஸ்தை (Vikala - அஸ்தமனம்)', en: 'Vikala (Combust / Agitated)', badge: 'bg-red-200 text-red-950 font-bold' };
    } else if (panchaP) {
      if (panchaP.presentDignityTa.includes('உச்சம்')) {
        deeptadi = { ta: 'தீப்தா அவஸ்தை (Deepta - உச்சம்)', en: 'Deepta (Radiant / Exalted)', badge: 'bg-amber-300 text-stone-900 font-bold' };
      } else if (panchaP.presentDignityTa.includes('ஆட்சி')) {
        deeptadi = { ta: 'சுவஸ்தா அவஸ்தை (Swastha - ஆட்சி)', en: 'Swastha (Contented / Own House)', badge: 'bg-emerald-200 text-emerald-950 font-bold' };
      } else if (panchaP.presentDignityTa.includes('அதி மித்துரு') || panchaP.presentDignityTa.includes('அதி நட்பு')) {
        deeptadi = { ta: 'முதிதா அவஸ்தை (Mudita - அதி நட்பு)', en: 'Mudita (Delighted / Great Friend)', badge: 'bg-teal-100 text-teal-900' };
      } else if (panchaP.presentDignityTa.includes('மித்துரு') || panchaP.presentDignityTa.includes('நட்பு')) {
        deeptadi = { ta: 'சாந்தா அவஸ்தை (Shanta - நட்பு)', en: 'Shanta (Peaceful / Friend)', badge: 'bg-green-100 text-green-900' };
      } else if (panchaP.presentDignityTa.includes('சமம்')) {
        deeptadi = { ta: 'தீனா அவஸ்தை (Dina - சமம்)', en: 'Dina (Depressed / Neutral)', badge: 'bg-amber-100 text-amber-900' };
      } else if (panchaP.presentDignityTa.includes('அதி சத்துரு') || panchaP.presentDignityTa.includes('அதி பகை')) {
        deeptadi = { ta: 'கலோ அவஸ்தை (Khala - அதி பகை)', en: 'Khala (Malicious / Bitter Enemy)', badge: 'bg-rose-200 text-rose-950 font-bold' };
      } else if (panchaP.presentDignityTa.includes('பகை')) {
        deeptadi = { ta: 'துக்கிதா அவஸ்தை (Dukhita - பகை)', en: 'Dukhita (Distressed / Enemy)', badge: 'bg-rose-100 text-rose-900' };
      } else if (panchaP.presentDignityTa.includes('நீசம்')) {
        deeptadi = { ta: 'கோபா / நிபீடிதா (Kopa - நீசம்)', en: 'Kopa / Nipidita (Defeated / Debilitated)', badge: 'bg-rose-300 text-rose-950 font-black' };
      }
    }

    const pNum = PLANET_NAMES[pId].num;
    const nakNum = (p.nakshatra !== undefined ? p.nakshatra : 0) + 1;
    const navPada = (p.pada !== undefined ? Number(p.pada) : 1);
    const mNakNum = Number(moonNak) + 1;
    const lagnaGhatis = Math.round((lagnaDeg / 360) * 60) % 60;
    const bGhatiRound = Math.round(birthGhatis);

    const shayProduct = pNum * nakNum * navPada;
    const shaySum = shayProduct + mNakNum + lagnaGhatis + bGhatiRound;
    let shayRemainder = shaySum % 12;
    if (shayRemainder === 0) shayRemainder = 12;

    const shayanadi = SHAYANADI_AVASTHAS.find(s => s.num === shayRemainder) || SHAYANADI_AVASTHAS[0];

    let mandalam = { ta: 'அக்னி மண்டலம்', en: 'Agni Mandala (Fiery)', badge: 'bg-amber-100 text-amber-900' };
    if (nakNum >= 3 && nakNum <= 12) {
      mandalam = { ta: 'அக்னி மண்டலம்', en: 'Agni Mandala (Fiery)', badge: 'bg-amber-100 text-amber-900' };
    } else if (nakNum >= 13 && nakNum <= 21) {
      mandalam = { ta: 'வாயு மண்டலம்', en: 'Vayu Mandala (Airy)', badge: 'bg-blue-100 text-blue-900' };
    } else {
      mandalam = { ta: 'வருண மண்டலம் (ஜலம்)', en: 'Varuna Mandala (Watery)', badge: 'bg-cyan-100 text-cyan-900' };
    }

    return {
      id: pId,
      nameTa: PLANET_NAMES[pId].ta,
      nameEn: PLANET_NAMES[pId].en,
      rasiName: RASHI_NAMES[rasi].ta,
      degInSignFormatted: p.degInSign || `${Math.floor(degInSign)}°`,
      baladi,
      jagradadi,
      deeptadi,
      shayanadi,
      mandalam
    };
  }).filter(Boolean);

  return {
    naisargikaList,
    tatkalikaData,
    panchadhaData,
    avasthasData
  };
}
"""

if "export function computePlanetaryRelationshipsAndAvasthas" not in engine:
    engine += "\n" + compute_func

# Now connect it to calculateThirukanithaHoroscope return object
target_ret = "specialLagnas: computeSpecialLagnasSphutasData({"
replacement_ret = """planetaryRelationshipsAndAvasthas: computePlanetaryRelationshipsAndAvasthas(
      allPlanetRows,
      Lagna_nirayana,
      {
        birthHour: localHour,
        sunriseHour: 6.0,
        moonNak: moonNakIdx
      }
    ),
    specialLagnas: computeSpecialLagnasSphutasData({"""

if target_ret in engine and "planetaryRelationshipsAndAvasthas:" not in engine:
    engine = engine.replace(target_ret, replacement_ret, 1)

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(engine)

print("thirukanithaEngine.js successfully updated with Section 13 computation!")
