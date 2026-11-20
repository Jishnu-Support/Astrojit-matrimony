const { calculateThirukanithaHoroscope } = require('./frontend/src/utils/thirukanithaEngine.js');

const NAISARGIKA_MAITRI = {
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

console.log('NAISARGIKA_MAITRI defined with 9 planets.');
