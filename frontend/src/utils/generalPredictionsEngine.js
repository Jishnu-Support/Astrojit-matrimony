/**
 * Authentic Vedic General Predictions Engine (ஜாதகப் பொதுப் பலன்கள் கணிப்பு)
 * Computes classical predictive guidelines for:
 * 1. Lagnathipathi (லக்னாதிபதி பலன்)
 * 2. Tithi (திதி பலன்)
 * 3. Nitya Yoga (நித்ய யோக பலன்)
 * 4. Karana (கரண பலன்)
 * 5. Yogi Graha (யோகி கிரக பலன்)
 * 6. Ayogi Graha (அவயோகி கிரக பலன்)
 * 7. Subha Grahas (சுப கிரகங்கள் பலன்)
 * 8. Asubha Grahas (அசுப கிரகங்கள் பலன்)
 * 9. Bhagyathipathi (பாக்யாதிபதி பலன் - 9th Lord)
 * 10. Badhakathipathi (பாதகாதிபதி பலன் - Badhaka Lord)
 */

export const LAGNA_LORD_PREDICTIONS = {
  sun: {
    nameTa: 'சூரியன்',
    nameEn: 'Sun',
    summaryTa: 'கம்பீரமான ஆளுமை, தலைமைத் திறன் மற்றும் கௌரவம் உண்டாகும்.',
    summaryEn: 'Charismatic leadership, high self-esteem, and social prestige.',
    detailedTa: 'லக்னாதிபதி சூரியனாக அமைந்திருப்பதால் கம்பீரமான தோற்றம், அதிகார ஆளுமை, தன்னம்பிக்கை மற்றும் நிர்வாகத் திறன் சிறப்பாக இருக்கும். அரசு அல்லது உயர்மட்ட மனிதர்களின் ஆதரவு கிட்டும். தர்ம நெறி தவறாத நேர்மையான வழியில் புகழும் கௌரவமும் பெறுவீர்கள்.',
    detailedEn: 'With the Sun as Lagna Lord, you are blessed with dignified presence, authoritative leadership, and immense self-confidence. You command natural respect in society, earn patronage from superiors or government, and rise through principled integrity.'
  },
  moon: {
    nameTa: 'சந்திரன்',
    nameEn: 'Moon',
    summaryTa: 'கருணை உள்ளம், கற்பனை வளம் மற்றும் மக்கள் செல்வாக்கு கிட்டும்.',
    summaryEn: 'Compassionate nature, creative imagination, and popular appeal.',
    detailedTa: 'லக்னாதிபதி சந்திரனாக அமைந்திருப்பதால் சாந்தமான சுபாவம், இரக்க குணம், கற்பனை நயமும் கவர்ச்சியான முகவசியமும் உண்டாகும். பொதுஜன தொடர்பு, தாயன்பு மற்றும் கலை-இலக்கிய ரசனை மேலோங்கும். மன அமைதியும், தூய எண்ணமும் வாழ்க்கையின் பெருந்துணையாக அமையும்.',
    detailedEn: 'With Moon as Lagna Lord, you possess a gentle, compassionate disposition, poetic imagination, and an appealing persona. You enjoy strong maternal blessings, popularity among people, and refined aesthetic tastes, leading to emotional fulfillment.'
  },
  mars: {
    nameTa: 'செவ்வாய்',
    nameEn: 'Mars',
    summaryTa: 'துணிச்சல், வீரம், நிலம்-பூமி யோகம் மற்றும் தலைமை ஆற்றல்.',
    summaryEn: 'Courage, physical stamina, real estate gains, and command.',
    detailedTa: 'லக்னாதிபதி செவ்வாயாக அமைந்திருப்பதால் அஞ்சா நெஞ்சம், தைரியமான முடிவுகள், தீர்க்கமான செயல்வேகம் மற்றும் தலைமைத் திறன் உண்டாகும். பூமி-நிலம் தொடர்பான ஆதாயங்கள், சவால்களை எளிதில் முறியடிக்கும் மனோபலம் மற்றும் காரியத்தில் வெற்றி கிட்டும்.',
    detailedEn: 'With Mars as Lagna Lord, you radiate fearless vitality, swift decision-making capability, and indomitable courage. You conquer competitive hurdles easily, excel in leadership and physical endeavors, and accumulate real estate and assets.'
  },
  mercury: {
    nameTa: 'புதன்',
    nameEn: 'Mercury',
    summaryTa: 'அறிவுக்கூர்மை, வாக்குவன்மை, வியாபார நுட்பம் மற்றும் கல்வி மேன்மை.',
    summaryEn: 'Sharp intellect, eloquent speech, business acumen, and learning.',
    detailedTa: 'லக்னாதிபதி புதனாக அமைந்திருப்பதால் நுண்ணிய அறிவு, வசீகரமான பேச்சு சாதுரியம், நகைச்சுவை உணர்வு மற்றும் கணித-வியாபார நுட்பம் மேலோங்கும். புதிய கலைகளை எளிதில் கற்கும் ஆற்றலும், எதையும் திட்டமிட்டு சாதிக்கும் சாணக்கியமும் உண்டாகும்.',
    detailedEn: 'With Mercury as Lagna Lord, you possess intellectual sharpness, persuasive communicative eloquence, and commercial foresight. Your analytical mind, wit, and adaptable demeanor ensure success in business, communication, and intellectual domains.'
  },
  jupiter: {
    nameTa: 'குரு',
    nameEn: 'Jupiter',
    summaryTa: 'தர்ம சிந்தனை, ஆன்மீக நாட்டம், தன சேர்க்கை மற்றும் தெய்வ அருள்.',
    summaryEn: 'Virtuous wisdom, spiritual grace, wealth accumulation, and honor.',
    detailedTa: 'லக்னாதிபதி குருவாக அமைந்திருப்பதால் உயரிய ஒழுக்கம், ஆன்மீக ஞானம், நீதி நேர்மை மற்றும் பெரியோர்களின் ஆசி கிட்டும். தனம் மற்றும் புத்திர பாக்கியம் சிறப்பாக இருக்கும். சமூகத்தில் வழிகாட்டியாகவும், மதிக்கத்தக்க ஆளுமையாகவும் விளங்குவீர்கள்.',
    detailedEn: 'With Jupiter as Lagna Lord, you are endowed with divine grace, moral rectitude, spiritual wisdom, and righteous judgment. You earn respect as a dependable mentor, achieve stable financial abundance, and enjoy good progeny and social honor.'
  },
  venus: {
    nameTa: 'சுக்கிரன்',
    nameEn: 'Venus',
    summaryTa: 'கலை ஆர்வம், இல்லற சுகம், வாகன யோகம் மற்றும் கவர்ச்சி நலம்.',
    summaryEn: 'Aesthetic elegance, marital bliss, vehicular luxury, and charm.',
    detailedTa: 'லக்னாதிபதி சுக்கிரனாக அமைந்திருப்பதால் வசீகர தோற்றம், கலை-இசை ரசனை, சுகபோக வாழ்க்கை மற்றும் வாகன யோகம் உண்டாகும். இல்லற வாழ்வு இனிமையாகவும், நட்பு வட்டாரம் சிறப்பாகவும் அமையும். அழகுணர்ச்சியாலும் மென்மையான அணுகுமுறையாலும் வெற்றி பெறுவீர்கள்.',
    detailedEn: 'With Venus as Lagna Lord, you possess captivating charm, refined taste for beauty and arts, and a penchant for comfortable living. You attract vehicles, luxurious comforts, harmonious relationships, and affectionate social goodwill.'
  },
  saturn: {
    nameTa: 'சனி',
    nameEn: 'Saturn',
    summaryTa: 'கடின உழைப்பு, பொறுமை, விடாமுயற்சி மற்றும் நீண்ட ஆயுள்.',
    summaryEn: 'Endurance, diligent labor, grounded patience, and longevity.',
    detailedTa: 'லக்னாதிபதி சனியாக அமைந்திருப்பதால் சோர்வில்லாத உழைப்பு, அசையாத பொறுமை, நடைமுறை அறிவு மற்றும் நீண்ட ஆயுள் கிட்டும். ஆரம்ப கால போராட்டங்களை கடந்து சுயமுயற்சியால் அசைக்க முடியாத சாம்ராஜ்யத்தையும் மக்கள் ஆதரவையும் நிலைநாட்டுவீர்கள்.',
    detailedEn: 'With Saturn as Lagna Lord, you are blessed with unshakeable perseverance, deep maturity, patience, and longevity. Overcoming early trials through disciplined hard work, you build enduring stability and earn grassroots respect.'
  }
};

export const TITHI_PREDICTIONS = {
  prathama: {
    ta: 'ஆரம்ப ஆற்றல், தலைமைத் தன்மை மற்றும் புதிய முயற்சிகளில் வெற்றி.',
    en: 'Initiating energy, pioneering spirit, and success in new ventures.'
  },
  dvitiya: {
    ta: 'சொல்வன்மை, குடும்பப் பற்று, தன வரவு மற்றும் விசுவாச குணம்.',
    en: 'Eloquent speech, devotion to family, financial stability, and loyalty.'
  },
  tritiya: {
    ta: 'தைரியம், காரிய வெற்றி, சகோதர ஆதரவு மற்றும் சுறுசுறுப்பு.',
    en: 'Boldness, decisive action, fraternal support, and active dynamism.'
  },
  chaturthi: {
    ta: 'விடாமுயற்சி, சவால்களை முறியடிக்கும் திறன் மற்றும் விநாயகர் அருள்.',
    en: 'Tenacity, skill to overcome hurdles, and divine obstacle removal.'
  },
  panchami: {
    ta: 'கல்வி மேன்மை, அறிவுக்கூர்மை, புத்திர பாக்கியம் மற்றும் நற்குணம்.',
    en: 'Intellectual brilliance, artistic pursuits, virtuous progeny, and grace.'
  },
  sashti: {
    ta: 'வீரம், எதிரிகளை வெல்லும் ஆற்றல், புகழ் மற்றும் முருகன் அருள்.',
    en: 'Courage, victory over opposition, fame, and decisive vigor.'
  },
  saptami: {
    ta: 'நல் ஆரோக்கியம், கீர்த்தி, தூர தேச நன்மைகள் மற்றும் சமுதாய மரியாதை.',
    en: 'Radiant health, good reputation, foreign gains, and social respect.'
  },
  ashtami: {
    ta: 'ஆழ்ந்த மன உறுதி, ஆராய்ச்சி குணம், ஆன்மீக நாட்டம் மற்றும் தைரியம்.',
    en: 'Steadfast willpower, deep research orientation, and spiritual strength.'
  },
  navami: {
    ta: 'நீதி பரிபாலனம், தர்ம சிந்தனை மற்றும் சவால்களைக் கடக்கும் ஆற்றல்.',
    en: 'Righteous sense of justice, resilience, and ethical triumphs.'
  },
  dashami: {
    ta: 'அரசு மரியாதை, நற்காரிய வெற்றி, தொழில் வளர்ச்சி மற்றும் சுப வாழ்வு.',
    en: 'Civic recognition, career triumphs, auspicious lifestyle, and gains.'
  },
  ekadashi: {
    ta: 'உயரிய பக்தி, விரத பலன்கள், குடும்ப மேன்மை மற்றும் விஷ்ணு அருள்.',
    en: 'Spiritual piety, divine blessings, family prosperity, and moral purity.'
  },
  dvadashi: {
    ta: 'தான தர்ம சிந்தனை, அன்னதான ஈடுபாடு, புண்ணிய பலன் மற்றும் நற்புகழ்.',
    en: 'Charitable munificence, generous hospitality, merit, and high honor.'
  },
  trayodashi: {
    ta: 'சிவருள், நீண்ட ஆயுள், ஆரோக்கியம், கலை ஆர்வம் மற்றும் தோஷ நிவர்த்தி.',
    en: 'Divine grace, longevity, robust health, aesthetic flair, and bliss.'
  },
  chaturdashi: {
    ta: 'கடின உழைப்பு, சாதுரியம், ஆழ்ந்த ரகசியங்களை அறியும் ஆர்வம்.',
    en: 'Hard work, shrewd resourcefulness, and capacity for deep secrets.'
  },
  pournami: {
    ta: 'சகல சவுபாக்கியம், லட்சுமி கடாட்சம், மன அமைதி மற்றும் பரிபூரண வாழ்வு.',
    en: 'Abundance, goddess Lakshmi’s grace, serene mind, and holistic prosperity.'
  },
  amavasya: {
    ta: 'முன்னோர் ஆசி, தியாக குணம், தீர்க்க சிந்தனை மற்றும் உள்ளுணர்வு பலம்.',
    en: 'Ancestral blessings, selflessness, profound foresight, and intuition.'
  }
};

export const YOGA_PREDICTIONS = {
  1: { ta: 'விஷ்கம்பம்: விடாமுயற்சி மற்றும் எதிர்ப்புகளைத் தாங்கும் உறுதி.', en: 'Vishkambha: Tenacity and endurance to overcome difficulties.' },
  2: { ta: 'பிரீதி: அனைவராலும் விரும்பப்படும் அன்பும் பாசமும் மிக்க சுபாவம்.', en: 'Priti: Loving disposition and widespread social affection.' },
  3: { ta: 'ஆயுஷ்மான்: நீண்ட ஆயுள், நல்வாழ்வு, ஆரோக்கியம் மற்றும் அமைதி.', en: 'Ayushman: Longevity, vibrant health, and peaceful living.' },
  4: { ta: 'சவுபாக்கியம்: சகல ஐஸ்வர்யங்கள், பேரின்பம் மற்றும் மங்கல வாழ்வு.', en: 'Saubhagya: All-round prosperity, domestic happiness, and good luck.' },
  5: { ta: 'சோபனம்: கவர்ச்சியான தோற்றம், நற்பண்புகள் மற்றும் உற்சாகம்.', en: 'Shobhana: Attractive persona, noble virtues, and cheerful zest.' },
  6: { ta: 'அதிகண்டம்: தடைகளை சமாளிக்கும் மனோபலம்; இறை வழிபாடு நலம்.', en: 'Atiganda: Resilience under stress; spiritual prayers bring stability.' },
  7: { ta: 'சுகர்மம்: நேர்மையான செயல்கள், தர்ம சிந்தனை மற்றும் நல்வளர்ச்சி.', en: 'Sukarma: Righteous deeds, honest conduct, and honorable progress.' },
  8: { ta: 'திருதி: அசையாத பொறுமை, நிதானமான முன்னேற்றம் மற்றும் உறுதி.', en: 'Dhriti: Immense patience, steady achievement, and fortitude.' },
  9: { ta: 'சூலம்: துணிச்சலான பேச்சு, கூர்மையான புத்தி மற்றும் வீரம்.', en: 'Shula: Bold speech, sharp intellect, and spirited courage.' },
  10: { ta: 'கண்டம்: எச்சரிக்கையுடன் கூடிய செயல்பாடு; குலதெய்வ அருள் பாதுகாப்பு.', en: 'Ganda: Cautious discernment; prayers to family deity bring protection.' },
  11: { ta: 'விருத்தி: படிப்படியான பொருளாதார வளர்ச்சி, தன லாபம் மற்றும் வெற்றி.', en: 'Vriddhi: Progressive financial growth, wealth, and continuous gain.' },
  12: { ta: 'துருவம்: அசைக்க முடியாத உறுதி, நிலைத்த சொத்துக்கள் மற்றும் கௌரவம்.', en: 'Dhruva: Unshakeable stability, enduring assets, and high esteem.' },
  13: { ta: 'வியாகாதம்: தைரியம், அஞ்சா நெஞ்சம் மற்றும் வேகமான செயல்பாடு.', en: 'Vyaghata: Daring fearlessness, dynamism, and sharp execution.' },
  14: { ta: 'ஹர்ஷணம்: எப்போதும் மகிழ்ச்சியான குணம், சிரித்த முகம் மற்றும் கலை ஆர்வம்.', en: 'Harshana: Joyful temperament, smiling demeanor, and artistic flair.' },
  15: { ta: 'வஜ்ரம்: வைரத்தைப் போன்ற மன உறுதி, உடல் வலிமை மற்றும் செல்வாக்கு.', en: 'Vajra: Diamond-like mental toughness, physical endurance, and sway.' },
  16: { ta: 'அசித்தி/சித்தி: எடுத்த காரியங்களை நேர்த்தியாக முடிக்கும் சித்தி.', en: 'Siddhi: Mastery in accomplishing undertaken ventures successfully.' },
  17: { ta: 'வியதீபாதம்: ஆன்மீக சாதனை மற்றும் ஆழ்ந்த தத்துவ சிந்தனை.', en: 'Vyatipata: Spiritual devotion, contemplative mind, and patience.' },
  18: { ta: 'வரீயான்: சுகபோக வாழ்வு, உயர் பதவிகள் மற்றும் தன தான்ய சேர்க்கை.', en: 'Variyan: Luxurious lifestyle, executive honors, and abundant wealth.' },
  19: { ta: 'பரிகம்: கடின உழைப்பால் தடைகளைத் தகர்த்து முன்னேறும் ஆற்றல்.', en: 'Parigha: Capacity to smash obstacles through sheer diligence.' },
  20: { ta: 'சிவம்: சிவபெருமானின் திருவருள், சாந்தம், அமைதி மற்றும் ஞானம்.', en: 'Shiva: Lord Shiva’s grace, equanimity, serenity, and inner wisdom.' },
  21: { ta: 'சித்தம்: காரிய சித்தி, தெளிவான முடிவுகள் மற்றும் கல்வி மேன்மை.', en: 'Siddha: Attainment of objectives, lucidity of thought, and learning.' },
  22: { ta: 'சாத்யம்: நற்பழக்கங்கள், சாதிக்கத் துடிக்கும் ஆர்வம் மற்றும் விடாமுயற்சி.', en: 'Sadhya: Good manners, goal-oriented ambition, and determination.' },
  23: { ta: 'சுபம்: மங்களகரமான வாழ்வு, தூய உள்ளம் மற்றும் பிறர்க்கு உதவும் குணம்.', en: 'Shubha: Auspicious living, pure intentions, and helpful generosity.' },
  24: { ta: 'சுக்லம்: பிரகாசமான எதிர்காலம், நற்புகழ் மற்றும் மன அமைதி.', en: 'Shukla: Radiant future, honorable reputation, and mental poise.' },
  25: { ta: 'பிரம்மா: உயர்ந்த அறிவு, வேத-சாஸ்திர ஞானம் மற்றும் சமுதாய மேன்மை.', en: 'Brahma: High intellect, philosophical knowledge, and distinction.' },
  26: { ta: 'இந்திரன்: தலைமை தாங்கும் ஆற்றல், அரசு ஆதரவு மற்றும் செல்வாக்கு.', en: 'Indra: Royal command, authoritative influence, and administrative poise.' },
  27: { ta: 'வைத்ருதி: ஆழ்ந்த சிந்தனை, பரோபகாரம் மற்றும் பரந்த உலகியல் அனுபவம்.', en: 'Vaidhriti: Deep contemplation, altruism, and worldly wisdom.' }
};

export const KARANA_PREDICTIONS = {
  bava: { ta: 'பவ கரணம்: சுயமுயற்சி, மன தைரியம் மற்றும் நல்ல காரியங்களில் ஆர்வம்.', en: 'Bava Karana: Self-effort, courage, and zeal for righteous deeds.' },
  balava: { ta: 'பாலவ கரணம்: உடல் பலம், ஆரோக்கியம் மற்றும் தைரியமான முடிவுகள்.', en: 'Balava Karana: Physical vigor, robust health, and daring choices.' },
  kaulava: { ta: 'கௌலவ கரணம்: குடும்ப ஒற்றுமை, நட்பு பாராட்டுதல் மற்றும் பரோபகாரம்.', en: 'Kaulava Karana: Family unity, loyal friendships, and philanthropy.' },
  taitila: { ta: 'தைதுலை கரணம்: சமுதாய மரியாதை, நேர்மை மற்றும் மக்கள் ஆதரவு.', en: 'Taitila Karana: Social esteem, integrity, and popular goodwill.' },
  garija: { ta: 'கரிசை கரணம்: தொழில் மேன்மை, விடாமுயற்சி மற்றும் பூமி லாபம்.', en: 'Garija Karana: Professional excellence, perseverance, and landed gains.' },
  vanija: { ta: 'வணிசை கரணம்: வியாபார சாதுரியம், செல்வம் ஈட்டும் திறன் மற்றும் வாக்கு வளம்.', en: 'Vanija Karana: Commercial flair, wealth-generating skill, and eloquence.' },
  vishti: { ta: 'பத்திரை (விஷ்டி): எதிரிகளை எதிர்கொள்ளும் தீரம் மற்றும் சவால்களை வெல்லும் ஆற்றல்.', en: 'Vishti (Bhadra): Courage to confront opposition and conquer challenges.' },
  shakuni: { ta: 'சகுனி கரணம்: நுண்ணிய புத்தி, சாணக்கிய சிந்தனை மற்றும் முன்யோசனை.', en: 'Shakuni Karana: Keen strategic intellect and prudent foresight.' },
  chatushpada: { ta: 'சதுஷ்பாத கரணம்: கடின உழைப்பு, பொறுப்புணர்வு மற்றும் நிலையான வளர்ச்சி.', en: 'Chatushpada Karana: Diligent labor, high responsibility, and steady rise.' },
  naga: { ta: 'நாக கரணம்: அசாத்திய துணிச்சல், விடாப்பிடியான உறுதி மற்றும் கூர்மையான உள்ளுணர்வு.', en: 'Naga Karana: Exceptional bravery, stubborn determination, and sharp instinct.' },
  kintughna: { ta: 'கிம்துக்கின கரணம்: மங்களகரமான சுபாவம், நல் எண்ணம் மற்றும் இறை அருள்.', en: 'Kintughna Karana: Auspicious nature, goodwill, and divine protection.' }
};

/**
 * Main General Predictions Extractor
 */
export function getGeneralPredictions({ horoscope, birthData, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const summary = horoscope?.summary || {};
  const lagnaRasi = summary.lagnaRasi ?? 0;
  const lagnaRoles = summary.lagnaRoles || {};
  const yogiAvayogi = summary.yogiAvayogi || {};

  // 1. Lagnathipathi
  const lLordId = (lagnaRoles.lordEn || 'Mars').toLowerCase();
  const lPred = LAGNA_LORD_PREDICTIONS[lLordId] || LAGNA_LORD_PREDICTIONS.mars;
  const lagnathipathiItem = {
    id: 'lagnathipathi',
    icon: '👑',
    titleTa: 'லக்னாதிபதி பலன்',
    titleEn: 'Lagnathipathi Palan (Ascendant Lord)',
    factorTa: lagnaRoles.lordTa || lPred.nameTa,
    factorEn: lagnaRoles.lordEn || lPred.nameEn,
    summaryTa: lPred.summaryTa,
    summaryEn: lPred.summaryEn,
    detailedTa: lPred.detailedTa,
    detailedEn: lPred.detailedEn
  };

  // 2. Tithi
  const tithiRaw = (summary.tithi?.nameEn || summary.tithiNameEn || 'Pournami').toLowerCase();
  let matchedTithiKey = 'pournami';
  for (const k of Object.keys(TITHI_PREDICTIONS)) {
    if (tithiRaw.includes(k)) {
      matchedTithiKey = k;
      break;
    }
  }
  const tPred = TITHI_PREDICTIONS[matchedTithiKey] || TITHI_PREDICTIONS.pournami;
  const tithiItem = {
    id: 'tithi',
    icon: '🌕',
    titleTa: 'திதி பலன்',
    titleEn: 'Tithi Palan (Birth Phase of Moon)',
    factorTa: summary.tithi?.tithiNameTa || summary.tithiNameTa || 'பௌர்ணமி',
    factorEn: summary.tithi?.tithiNameEn || summary.tithiNameEn || 'Pournami',
    summaryTa: tPred.ta,
    summaryEn: tPred.en,
    detailedTa: `ஜாதகர் ${summary.tithi?.tithiNameTa || summary.tithiNameTa || 'பௌர்ணமி'} திதியில் பிறந்திருப்பதால், ${tPred.ta} திதி நாதனின் சுப அருளால் வாழ்க்கையில் பொருளாதார நிலையும் குடும்ப சுபிட்சமும் தழைத்தோங்கும்.`,
    detailedEn: `Born under ${summary.tithi?.tithiNameEn || summary.tithiNameEn || 'Pournami'} Tithi, you are blessed with ${tPred.en} The cosmic vibration of this lunar day ensures steady progress and domestic well-being.`
  };

  // 3. Nitya Yoga
  const yogaNum = summary.yogaKarana?.yogaNum || 1;
  const yPred = YOGA_PREDICTIONS[yogaNum] || YOGA_PREDICTIONS[3];
  const yogaItem = {
    id: 'yogam',
    icon: '✨',
    titleTa: 'நித்ய யோக பலன்',
    titleEn: 'Nitya Yoga Palan',
    factorTa: summary.yogaKarana?.yogaTa || 'ஆயுஷ்மான்',
    factorEn: summary.yogaKarana?.yogaEn || 'Ayushman',
    summaryTa: yPred.ta,
    summaryEn: yPred.en,
    detailedTa: `பிறப்பின் நித்ய யோகமான ${summary.yogaKarana?.yogaTa || 'ஆயுஷ்மான்'} யோகத்தின் சுப தாக்கம்: ${yPred.ta} இந்த யோகம் ஜாதகருக்கு காரிய சித்தியையும், மக்கள் மத்தியில் உயர்ந்த மதிப்பையும் உண்டாக்கும்.`,
    detailedEn: `The celestial influence of your birth Nitya Yoga (${summary.yogaKarana?.yogaEn || 'Ayushman'}): ${yPred.en} This planetary alignment fosters positive karmic results and social respect.`
  };

  // 4. Karana
  const karanaRaw = (summary.yogaKarana?.karanaEn || 'Balava').toLowerCase();
  let matchedKaranaKey = 'balava';
  for (const k of Object.keys(KARANA_PREDICTIONS)) {
    if (karanaRaw.includes(k)) {
      matchedKaranaKey = k;
      break;
    }
  }
  const kPred = KARANA_PREDICTIONS[matchedKaranaKey] || KARANA_PREDICTIONS.balava;
  const karanaItem = {
    id: 'karana',
    icon: '⚡',
    titleTa: 'கரண பலன்',
    titleEn: 'Karana Palan (Half-Lunar Day)',
    factorTa: summary.yogaKarana?.karanaTa || 'பாலவ',
    factorEn: summary.yogaKarana?.karanaEn || 'Balava',
    summaryTa: kPred.ta,
    summaryEn: kPred.en,
    detailedTa: `ஜாதகரின் பிறப்புக் கரணமான ${summary.yogaKarana?.karanaTa || 'பாலவ'} கரணத்தின் பண்பு: ${kPred.ta} எதையும் திட்டமிட்டு சாதிக்கும் செயல் ஆற்றலும், தடைகளை வெல்லும் உற்சாகமும் இக்கரணத்தால் உண்டாகும்.`,
    detailedEn: `The functional energy of your birth Karana (${summary.yogaKarana?.karanaEn || 'Balava'}): ${kPred.en} It equips you with focused action, perseverance in career, and resourcefulness.`
  };

  // 5. Yogi Graha
  const yogiNameTa = yogiAvayogi.yogiTa || 'குரு';
  const yogiNameEn = yogiAvayogi.yogiEn || 'Jupiter';
  const yogiItem = {
    id: 'yogi',
    icon: '🌟',
    titleTa: 'யோகி கிரக பலன்',
    titleEn: 'Yogi Graha Palan (Auspicious Catalyst)',
    factorTa: yogiNameTa,
    factorEn: yogiNameEn,
    summaryTa: `${yogiNameTa} யோக காரகராக அமைந்து எதிர்பாராத தன வரவு, அதிர்ஷ்டம் மற்றும் சுப காரிய வெற்றியை வழங்குவார்.`,
    summaryEn: `${yogiNameEn} acts as the auspicious catalyst, ushering unexpected fortune, wealth, and smooth breakthroughs.`,
    detailedTa: `ஜாதகத்தில் அதிர்ஷ்டத்தையும் தன யோகத்தையும் அள்ளி வழங்கும் யோகி கிரகமாக ${yogiNameTa} விளங்குகிறார். ${yogiNameTa}-ன் திசா-புக்திகளிலோ அல்லது அவரது நட்சத்திர சஞ்சாரத்தின் போதோ எதிர்பாராத தன வரவு, புதிய சொத்து சேர்க்கை, தொழில் முன்னேற்றம் மற்றும் மாபெரும் சுப நிகழ்வுகள் கைகூடும்.`,
    detailedEn: `In your natal chart, ${yogiNameEn} is the designated Yogi Graha. During the planetary periods, sub-periods, or beneficial transits of ${yogiNameEn}, you experience sudden strokes of good fortune, financial expansion, prestigious breakthroughs, and celebratory events.`
  };

  // 6. Ayogi Graha
  const ayogiNameTa = yogiAvayogi.avayogiTa || 'செவ்வாய்';
  const ayogiNameEn = yogiAvayogi.avayogiEn || 'Mars';
  const ayogiItem = {
    id: 'ayogi',
    icon: '🛡️',
    titleTa: 'அவயோகி கிரக பலன் & நிவர்த்தி',
    titleEn: 'Ayogi Graha Palan (Remedial Focus)',
    factorTa: ayogiNameTa,
    factorEn: ayogiNameEn,
    summaryTa: `${ayogiNameTa} அவயோகியாக இருப்பதால் அத்தியாவசிய முடிவுகளில் நிதானமும், இஷ்ட தெய்வ வழிபாடும் நலம் பயக்கும்.`,
    summaryEn: `${ayogiNameEn} is the Ayogi; prudent decisions and worship of tutelary deity neutralize friction.`,
    detailedTa: `ஜாதகத்தில் அவயோகி கிரகமாக ${ayogiNameTa} வருகிறார். இவரது திசா-புக்தி காலங்களில் அவசர முதலீடுகள் மற்றும் தேவையற்ற வாக்குவாதங்களைத் தவிர்த்து நிதானம் காப்பது நலம். உரிய இஷ்ட தெய்வ வழிபாடு மற்றும் குலதெய்வ பிரார்த்தனை மூலம் அவயோக தோஷங்கள் முற்றிலும் நீங்கி சுபம் உண்டாகும்.`,
    detailedEn: `${ayogiNameEn} functions as the Ayogi Graha in your chart. During its major/minor periods, exercise thoughtful prudence in financial commitments and interpersonal discussions. Regular devotion to your family deity and chosen ishta devata easily dissolves its hurdles.`
  };

  // 7. Subha Grahas
  const subharTa = lagnaRoles.subharTa || 'குரு, சந்திரன், சூரியன்';
  const subharEn = lagnaRoles.subharEn || 'Jupiter, Moon, Sun';
  const subhaItem = {
    id: 'subha_grahas',
    icon: '🕊️',
    titleTa: 'சுப கிரகங்கள் பலன்',
    titleEn: 'Subha Grahas Palan (Benefics for Lagna)',
    factorTa: subharTa,
    factorEn: subharEn,
    summaryTa: `${subharTa} சுப பலத்தால் காரிய சித்தி, மன அமைதி மற்றும் படிப்படியான யோக வளர்ச்சி உண்டாகும்.`,
    summaryEn: `Benefics (${subharEn}) bestow peace of mind, wholesome progress, and spiritual grace.`,
    detailedTa: `இலக்னத்திற்கு இயற்கை மற்றும் ஆதிபத்திய சுபர்களாக விளங்கும் ${subharTa} ஆகிய கிரகங்களின் பார்வை மற்றும் சேர்க்கை ஜாதகருக்கு அமைதியான மனோநிலை, குடும்ப சுபிட்சம், நல்லோர் நட்பு மற்றும் தொடர் வெற்றியினைத் தரும். இவர்கள் வலுப்பெறும் காலங்களில் சகல நன்மைகளும் தடையின்றி நடக்கும்.`,
    detailedEn: `The functional and natural benefics for your Lagna are ${subharEn}. Their benign aspect, conjunction, or period delivers mental serenity, family harmony, supportive associations, and steady triumphs, serving as your life’s protective shield.`
  };

  // 8. Asubha Grahas
  const asubharTa = lagnaRoles.asubharTa || 'புதன், சுக்கிரன், சனி';
  const asubharEn = lagnaRoles.asubharEn || 'Mercury, Venus, Saturn';
  const asubhaItem = {
    id: 'asubha_grahas',
    icon: '⚔️',
    titleTa: 'அசுப கிரகங்கள் பலன் & மனோபலம்',
    titleEn: 'Asubha Grahas Palan (Overcoming Hurdles)',
    factorTa: asubharTa,
    factorEn: asubharEn,
    summaryTa: `${asubharTa} மூலம் ஏற்படும் சவால்கள் ஜாதகருக்கு விடாமுயற்சியையும், மாபெரும் சாதனை படைக்கும் மன உறுதியையும் தரும்.`,
    summaryEn: `Hurdles associated with ${asubharEn} sharpen your resilience, forging remarkable endurance and success.`,
    detailedTa: `இலக்னத்திற்கு ஆதிபத்திய ரீதியாக அசுபர்களாக வரும் ${asubharTa} ஆரம்பத்தில் சிறு தடைகளையும், சவால்களையும் உருவாக்கினாலும், அவை உங்களை மேலும் பட்டைதீட்டப்பட்ட வைரமாக மாற்றும். எளிய இறை வழிபாடும், தர்ம நெறியும் இக்கிரகங்களை நற்பலன் தரச் செய்யும்.`,
    detailedEn: `The functional malefics for this ascendant are ${asubharEn}. While they may pose tests or demanding situations initially, they paradoxically cultivate fierce grit and strategic maturity in you. Charitable acts and steady ethics turn their pressure into stepping stones.`
  };

  // 9. Bhagyathipathi
  const bhagyaTa = lagnaRoles.bhagyaTa || 'சந்திரன்';
  const bhagyaEn = lagnaRoles.bhagyaEn || 'Moon';
  const bhagyaItem = {
    id: 'bhagyathipathi',
    icon: '💎',
    titleTa: 'பாக்யாதிபதி பலன் (9-ம் அதிபதி)',
    titleEn: 'Bhagyathipathi Palan (9th Lord - Fortune)',
    factorTa: bhagyaTa,
    factorEn: bhagyaEn,
    summaryTa: `9-ம் அதிபதி ${bhagyaTa} அருளால் தர்ம சிந்தனை, தந்தை வழி ஆதரவு, இறையருள் மற்றும் பாக்ய யோகம் கிட்டும்.`,
    summaryEn: `9th Lord ${bhagyaEn} bestows divine fortune, paternal grace, higher wisdom, and moral elevation.`,
    detailedTa: `பாக்கிய ஸ்தானமான 9-ம் வீட்டின் அதிபதியாக ${bhagyaTa} திகழ்கிறார். இவரது சுப அனுகிரகத்தால் தந்தை வழி ஆசிகள், பெரியோர்களின் வழிகாட்டல், புண்ணிய ஸ்தல யாத்திரைகள், தெய்வ பக்தி மற்றும் கைநிறைய வருமானம் தரும் நல்வாய்ப்புகள் தானாகத் தேடி வரும். தர்மம் தவறாமல் வாழ்வது பாக்கிய பலனை இரட்டிப்பாக்கும்.`,
    detailedEn: `Presiding over the 9th house of Fortune, ${bhagyaEn} activates divine grace, paternal blessings, and spiritual elevation. Under its influence, auspicious opportunities, pilgrimage journeys, higher learning, and noble prosperity effortlessly gravitate towards you.`
  };

  // 10. Badhakathipathi
  const badhakaTa = lagnaRoles.badhakaTa || 'சந்திரன்';
  const badhakaEn = lagnaRoles.badhakaEn || 'Moon';
  const badhakaItem = {
    id: 'badhakathipathi',
    icon: '🚩',
    titleTa: 'பாதகாதிபதி பலன் & பரிகார வழிகாட்டல்',
    titleEn: 'Badhakathipathi Palan (Obstacle Remediation)',
    factorTa: badhakaTa,
    factorEn: badhakaEn,
    summaryTa: `பாதகாதிபதி ${badhakaTa} அமைப்பிற்கு குலதெய்வ வழிபாடு மற்றும் இஷ்ட தெய்வ ஆராதனை தடைகளை நீக்கி வெற்றி தரும்.`,
    summaryEn: `Badhaka Lord ${badhakaEn}’s obstructions are easily dissolved through ancestral and Kuladeivam devotion.`,
    detailedTa: `இலக்னத்திற்குரிய பாதகாதிபதியாக ${badhakaTa} அமைகிறார். முக்கிய காரியங்களில் திடீர் தாமதங்கள் அல்லது எதிர்பாராத தடைகள் தோன்றினால், குலதெய்வக் கோயிலுக்குச் சென்று நெய் தீபமிட்டு வழிபடுவதும், எளிய ஏழைகளுக்கு அன்னதானம் செய்வதும் பாதகக் கதிர்களை முழுமையாக மாற்றி நல்வழியைத் திறக்கும்.`,
    detailedEn: `Governing the Badhaka domain for your Lagna is ${badhakaEn}. Whenever unexpected delays or roadblocks surface in endeavors, lighting ghee lamps at your ancestral Kuladeivam shrine and offering charitable food completely neutralizes adverse currents, opening gateways to progress.`
  };

  return [
    lagnathipathiItem,
    tithiItem,
    yogaItem,
    karanaItem,
    yogiItem,
    ayogiItem,
    subhaItem,
    asubhaItem,
    bhagyaItem,
    badhakaItem
  ];
}
