import re

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update createEmptyHoroscopePagerData: add fields to person & footer
old_person_empty = """      sunriseSunset: '',
      yogiAvayogi: '',
      nakshatraSyllables: ''"""

new_person_empty = """      sunriseSunset: '',
      yogiAvayogi: '',
      nakshatraSyllables: '',
      age: '',
      subhar: '',
      asubhar: '',
      lagnagathipathi: '',
      bhagayathipathi: '',
      bhathagathipathi: ''"""

content = content.replace(old_person_empty, new_person_empty)

old_footer_empty = """    footer: {
      dashaBalance: '',
      currentDasha: '',
      bhavaTransitions: '',
      luckyNumbers: ''
    }"""

new_footer_empty = """    footer: {
      dashaBalance: '',
      currentDasha: '',
      bhavaTransitions: '',
      bhodhagar: '',
      vedhagar: '',
      pasagar: '',
      karagar: '',
      luckyNumbers: ''
    }"""

content = content.replace(old_footer_empty, new_footer_empty)

# 2. In computeHoroscopePagerData, add helper calculations before return
calc_block = """
  // Age calculation
  const computeAgeString = (dobStr) => {
    if (!dobStr) return '';
    const parts = dobStr.split(/[-/.]/).map(Number);
    let y = parts[0] > 1000 ? parts[0] : parts[2];
    let m = parts[1];
    let d = parts[0] > 1000 ? parts[2] : parts[0];
    const birth = new Date(y, m - 1, d);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += 30;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} ஆண்டுகள், ${months} மாதங்கள்`;
  };

  // Classical Lagna roles (Subhar, Asubhar, Lagnadhipathi, Bhagya, Badhaka)
  const LAGNA_ROLES = {
    0: { subhar: 'குரு, சூரியன்', asubhar: 'புதன், சுக்கிரன்', lord: 'செவ்வாய்', bhagya: 'குரு', badhaka: 'சனி' },
    1: { subhar: 'சனி, புதன்', asubhar: 'குரு, சந்திரன்', lord: 'சுக்கிரன்', bhagya: 'சனி', badhaka: 'சனி' },
    2: { subhar: 'சுக்கிரன்', asubhar: 'செவ்வாய், குரு, சூரியன்', lord: 'புதன்', bhagya: 'சனி', badhaka: 'குரு' },
    3: { subhar: 'குரு, செவ்வாய்', asubhar: 'சுக்கிரன், புதன்', lord: 'சந்திரன்', bhagya: 'குரு', badhaka: 'சுக்கிரன்' },
    4: { subhar: 'செவ்வாய், குரு, சூரியன்', asubhar: 'சுக்கிரன், புதன்', lord: 'சூரியன்', bhagya: 'செவ்வாய்', badhaka: 'செவ்வாய்' },
    5: { subhar: 'சுக்கிரன், புதன்', asubhar: 'செவ்வாய், குரு, சந்திரன்', lord: 'புதன்', bhagya: 'சுக்கிரன்', badhaka: 'குரு' },
    6: { subhar: 'சனி, புதன்', asubhar: 'குரு, சூரியன், செவ்வாய்', lord: 'சுக்கிரன்', bhagya: 'புதன்', badhaka: 'சூரியன்' },
    7: { subhar: 'குரு, சந்திரன், சூரியன்', asubhar: 'புதன், சுக்கிரன், சனி', lord: 'செவ்வாய்', bhagya: 'சந்திரன்', badhaka: 'சந்திரன்' },
    8: { subhar: 'சூரியன், செவ்வாய்', asubhar: 'சுக்கிரன், புதன்', lord: 'குரு', bhagya: 'சூரியன்', badhaka: 'புதன்' },
    9: { subhar: 'சுக்கிரன், புதன்', asubhar: 'செவ்வாய், குரு, சந்திரன்', lord: 'சனி', bhagya: 'புதன்', badhaka: 'செவ்வாய்' },
    10: { subhar: 'சுக்கிரன்', asubhar: 'குரு, சந்திரன், செவ்வாய்', lord: 'சனி', bhagya: 'சுக்கிரன்', badhaka: 'சுக்கிரன்' },
    11: { subhar: 'சந்திரன், செவ்வாய்', asubhar: 'சுக்கிரன், புதன், சனி, சூரியன்', lord: 'குரு', bhagya: 'செவ்வாய்', badhaka: 'புதன்' }
  };

  const lRole = LAGNA_ROLES[p.lagnaRasi] || LAGNA_ROLES[7];

  // Bhodhagar, Vedhagar, Pasagar, Karagar for Lagna Lord
  const GRAHA_FOUR_ROLES = {
    'சூரியன்': { pasagar: 'சனி', bhodhagar: 'செவ்வாய்', karagar: 'குரு', vedhagar: 'சுக்கிரன்' },
    'சந்திரன்': { pasagar: 'சுக்கிரன்', bhodhagar: 'செவ்வாய்', karagar: 'சனி', vedhagar: 'சூரியன்' },
    'செவ்வாய்': { pasagar: 'சூரியன்', bhodhagar: 'சந்திரன்', karagar: 'சனி', vedhagar: 'புதன்' },
    'புதன்': { pasagar: 'சந்திரன்', bhodhagar: 'குரு', karagar: 'சுக்கிரன்', vedhagar: 'செவ்வாய்' },
    'குரு': { pasagar: 'சனி', bhodhagar: 'செவ்வாய்', karagar: 'சந்திரன்', vedhagar: 'சூரியன்' },
    'சுக்கிரன்': { pasagar: 'செவ்வாய்', bhodhagar: 'புதன்', karagar: 'சூரியன்', vedhagar: 'சனி' },
    'சனி': { pasagar: 'சுக்கிரன்', bhodhagar: 'சந்திரன்', karagar: 'குரு', vedhagar: 'செவ்வாய்' }
  };

  const g4 = GRAHA_FOUR_ROLES[lRole.lord] || GRAHA_FOUR_ROLES['செவ்வாய்'];
"""

target_before_return = '  const nextBhukti = horo.dashaTable[0]?.bhuktis?.find(b => b.isOngoing) || horo.dashaTable[0]?.bhuktis?.[0];'
if target_before_return in content:
    content = content.replace(target_before_return, calc_block + '\n' + target_before_return)
    print('Inserted calculation block in computeHoroscopePagerData.')

# 3. In computeHoroscopePagerData return object: populate person and footer
old_person_ret = """      sunriseSunset,
      yogiAvayogi: `யோகி: ${yogiTa} | அவயோகி: ${avayogiTa}`,
      nakshatraSyllables: nakSyllables"""

new_person_ret = """      sunriseSunset,
      yogiAvayogi: `யோகி: ${yogiTa} | அவயோகி: ${avayogiTa}`,
      nakshatraSyllables: nakSyllables,
      age: computeAgeString(m.dob),
      subhar: lRole.subhar,
      asubhar: lRole.asubhar,
      lagnagathipathi: lRole.lord,
      bhagayathipathi: lRole.bhagya,
      bhathagathipathi: lRole.badhaka"""

content = content.replace(old_person_ret, new_person_ret)

old_footer_ret = """      currentDasha: `நடப்பு ${nextMd?.lord?.nameTa || ''} திசை ${nextMd?.endDate || ''} வரை, ${nextBhukti?.bhuktiLord?.nameTa || ''} புத்தி ${nextBhukti?.endDate || ''} வரை.`,
      bhavaTransitions: `லக்ன பாவக ஆரம்பம்: ${RASHIS[(p.lagnaRasi + 11) % 12]?.ta} 22° 15′ | முடிவு: ${RASHIS[p.lagnaRasi]?.ta} 22° 15′`,
      luckyNumbers: '1, 3, 5, 9 • அதிர்ஷ்ட நிறம்: பொன் மஞ்சள், வெண்மை • அதிர்ஷ்ட திசை: கிழக்கு'"""

new_footer_ret = """      currentDasha: `நடப்பு ${nextMd?.lord?.nameTa || ''} திசை ${nextMd?.endDate || ''} வரை, ${nextBhukti?.bhuktiLord?.nameTa || ''} புத்தி ${nextBhukti?.endDate || ''} வரை.`,
      bhavaTransitions: `லக்ன பாவக ஆரம்பம்: ${RASHIS[(p.lagnaRasi + 11) % 12]?.ta} 22° 15′ | முடிவு: ${RASHIS[p.lagnaRasi]?.ta} 22° 15′`,
      bhodhagar: g4.bhodhagar,
      vedhagar: g4.vedhagar,
      pasagar: g4.pasagar,
      karagar: g4.karagar,
      luckyNumbers: '1, 3, 5, 9 • அதிர்ஷ்ட நிறம்: பொன் மஞ்சள், வெண்மை • அதிர்ஷ்ட திசை: கிழக்கு'"""

content = content.replace(old_footer_ret, new_footer_ret)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated thirukanithaEngine.js successfully.')
