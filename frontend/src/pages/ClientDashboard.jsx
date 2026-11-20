import React, { useState, useEffect } from 'react';
import { Calendar, User, Sparkles, ShoppingBag, Heart, Clock, Video, Phone, ShieldCheck, MessageSquare, Building2, MapPin, CheckCircle2, FileText, Lock, Printer, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';
import DailyPanchangam from '../components/DailyPanchangam';
import KundliMatchmaking from '../components/KundliMatchmaking';
import SlotBookingModal from '../components/SlotBookingModal';
import HoroscopeHub from '../components/HoroscopeHub';
import ThirukanithaHoroscopeView from '../components/ThirukanithaHoroscopeView';
import HoroscopePagerView from '../components/HoroscopePagerView';

export default function ClientDashboard({ activeTab: propTab, onTabChange }) {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [internalTab, setInternalTab] = useState('panchangam');
  const activeTab = propTab || internalTab;
  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchAppointments = async () => {
    try {
      const apts = await API.getMyAppointments();
      setAppointments(apts);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (activeTab === 'marketplace' && products.length === 0) {
        setLoadingProducts(true);
        try {
          const items = await API.getMarketplace();
          setProducts(items);
        } catch (err) {
          console.error('Error fetching marketplace:', err);
        } finally {
          setLoadingProducts(false);
        }
      }

      if (activeTab === 'appointments') {
        fetchAppointments();
      }
    }

    loadData();
  }, [activeTab]);

  // Multilingual helpers for Marketplace and Appointments
  const getLocalizedProductCategory = (cat) => {
    const clean = (cat || '').toLowerCase().trim();
    if (clean.includes('rudraksha') || clean.includes('gemstone')) {
      if (lang === 'ta') return 'ருத்ராட்சம் & ரத்தினங்கள்';
      if (lang === 'kn') return 'ರುದ್ರಾಕ್ಷಿ ಮತ್ತು ರತ್ನಗಳು';
      if (lang === 'hi') return 'रुद्राक्ष एवं रत्न';
    }
    if (clean.includes('puja samagri') || clean.includes('samagri')) {
      if (lang === 'ta') return 'பூஜை பொருட்கள்';
      if (lang === 'kn') return 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು';
      if (lang === 'hi') return 'पूजा सामग्री';
    }
    if (clean.includes('service') || clean.includes('pooja services')) {
      if (lang === 'ta') return 'பூஜை சேவைகள்';
      if (lang === 'kn') return 'ಪೂಜಾ ಸೇವೆಗಳು';
      if (lang === 'hi') return 'पूजा सेवाएं';
    }
    return cat;
  };

  const getLocalizedProduct = (item) => {
    if (lang === 'en') return { title: item.title, description: item.description };
    const id = item.id;
    if (id === 'prod-1' || item.title?.includes('5-Mukhi')) {
      if (lang === 'ta') {
        return {
          title: 'உண்மையான 5-முக நேபாள ருத்ராட்ச மாலை (108 மணிகள்)',
          description: 'காசி விஸ்வநாதர் ஆலயத்தில் பூஜித்து உருவேற்றப்பட்ட வெள்ளி உறை கொண்ட அசல் இமயமலை 5-முக ருத்ராட்ச மாலை. மன அமைதி, ஆரோக்கியம் மற்றும் ஆன்மீக வளர்ச்சிக்கு உகந்தது.'
        };
      }
      if (lang === 'kn') {
        return {
          title: 'ಅಸಲಿ 5-ಮುಖಿ ನೇಪಾಳಿ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ (108 ಮಣಿಗಳು)',
          description: 'ಕಾಶಿ ವಿಶ್ವನಾಥ ಸನ್ನಿಧಿಯಲ್ಲಿ ಅಭಿಮಂತ್ರಿತವಾದ ಶುದ್ಧ ಹಿಮಾಲಯದ 5-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ. ಮನಃಶಾಂತಿ, ಆರೋಗ್ಯ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಏಳಿಗೆಗೆ ಶ್ರೇಷ್ಠ.'
        };
      }
      if (lang === 'hi') {
        return {
          title: 'प्रामाणिक 5-मुखी नेपाली रुद्राक्ष माला (108 मनके)',
          description: 'काशी विश्वनाथ मंदिर में प्राण-प्रतिष्ठित, चांदी में जड़ा हुआ प्राकृतिक नेपाली 5-मुखी रुद्राक्ष। शांति, स्वास्थ्य और आध्यात्मिक उन्नति के लिए।'
        };
      }
    }
    if (id === 'prod-2' || item.title?.includes('Navagraha Shanti')) {
      if (lang === 'ta') {
        return {
          title: 'முழுமையான நவக்கிரக சாந்தி பூஜை பொருட்கள் தொகுப்பு',
          description: '9 கிரகங்களின் சாந்தி ஹோமத்திற்கு தேவையான இயற்கை மர சமித்துகள், தூய பசு நெய், நவதானியங்கள் மற்றும் மூலிகைகள் அடங்கிய மங்களகரமான தொகுப்பு.'
        };
      }
      if (lang === 'kn') {
        return {
          title: 'ಸಂಪೂರ್ಣ ನವಗ್ರಹ ಶಾಂತಿ ಪೂಜಾ ಸಾಮಗ್ರಿ ಕಿಟ್',
          description: 'ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮಕ್ಕೆ ಅಗತ್ಯವಿರುವ ನೈಸರ್ಗಿಕ ಸಮಿತ್ತುಗಳು, ಶುದ್ಧ ತುಪ್ಪ, ನವಧಾನ್ಯಗಳು ಹಾಗೂ ಮೂಲಿಕೆಗಳ ಪವಿತ್ರ ಸಂಪುಟ.'
        };
      }
      if (lang === 'hi') {
        return {
          title: 'सम्पूर्ण नवग्रह शांति पूजा सामग्री किट',
          description: 'नवग्रह शांति हवन हेतु सभी आवश्यक प्राकृतिक समिधाएं, शुद्ध गाय का घी, नवधान्य एवं जड़ी-बूटियों का संपूर्ण पावन संकलन।'
        };
      }
    }
    if (id === 'prod-3' || item.title?.includes('Maha Mrityunjaya')) {
      if (lang === 'ta') {
        return {
          title: 'மகா மிருத்யுஞ்சய ஹோமம் & ஜெபம் (11,000 உரு)',
          description: 'ஆயுள் பலம், ஆரோக்கியம் மற்றும் கொடிய நோய்களில் இருந்து நிவாரணம் பெற காசி வைதீக பண்டிதர்களால் நடத்தப்படும் தனிப்பயனாக்கப்பட்ட நேரடி ஹோம சேவை.'
        };
      }
      if (lang === 'kn') {
        return {
          title: 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಹೋಮ ಮತ್ತು ಜಪ (11,000 ಜಪಗಳು)',
          description: 'ದೀರ್ಘಾಯುಷ್ಯ, ಆರೋಗ್ಯ ವೃದ್ಧಿ ಹಾಗೂ ರೋಗ ನಿವಾರಣೆಗಾಗಿ ಕಾಶಿಯ ವಿದ್ವಾಂಸರಿಂದ ನೆರವೇರಿಸಲ್ಪಡುವ ವಿಶೇಷ ವೈದಿಕ ಪೂಜಾ ಸೇವೆ.'
        };
      }
      if (lang === 'hi') {
        return {
          title: 'महा मृत्युंजय होम एवं जाप (11,000 मंत्र जाप)',
          description: 'दीर्घायु, उत्तम स्वास्थ्य एवं संकट निवारण हेतु काशी के अनुभवी आचार्यों द्वारा विधि-विधान से संपन्न विशेष वैदिक अनुष्ठान।'
        };
      }
    }
    if (id === 'prod-4' || item.title?.includes('Shani Sade Sati')) {
      if (lang === 'ta') {
        return {
          title: 'சனி ஏழரைச் சனி நிவாரண பூஜை மற்றும் நல்லெண்ணெய் அர்ச்சனை',
          description: 'சனீஸ்வர பகவானின் தாக்கத்தைக் குறைத்து நன்மைகளைப் பெற திருநள்ளாறு முறைப்படி நல்லெண்ணெய் தீபம் மற்றும் அர்ச்சனையுடன் நடத்தப்படும் சிறப்பு பரிகார பூஜை.'
        };
      }
      if (lang === 'kn') {
        return {
          title: 'ಶನಿ ಸಾಡೇ ಸಾತಿ ನಿವಾರಣಾ ಪೂಜೆ ಮತ್ತು ಎಳ್ಳೆಣ್ಣೆ ಅರ್ಚನೆ',
          description: 'ಶನೇಶ್ವರನ ಅಶುಭ ಪ್ರಭಾವವನ್ನು ಕಡಿಮೆಗೊಳಿಸಲು ತಿರುನಳ್ಳಾರು ಸಂಪ್ರದಾಯದಂತೆ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಮತ್ತು ಅರ್ಚನೆ ಸಹಿತ ನಡೆಸಲಾಗುವ ಶಾಂತಿ ಪೂಜೆ.'
        };
      }
      if (lang === 'hi') {
        return {
          title: 'शनि साढ़े साती निवारण पूजा एवं तिल तेल अर्चना',
          description: 'शनि देव के कुप्रभावों को शांत करने तथा जीवन में स्थायित्व व सुख-शांति हेतु विशेष तिल-तेल दीपदान व शांति पूजा।'
        };
      }
    }
    return { title: item.title, description: item.description };
  };

  const getLocalizedQueryArea = (area) => {
    const clean = (area || '').toLowerCase().trim();
    if (clean.includes('career') || clean.includes('financial')) {
      if (lang === 'ta') return 'தொழில் & நிதி வழிகாட்டுதல்';
      if (lang === 'kn') return 'ವೃತ್ತಿ ಮತ್ತು ಆರ್ಥಿಕ ಮಾರ್ಗದರ್ಶನ';
      if (lang === 'hi') return 'करियर एवं वित्तीय मार्गदर्शन';
    }
    if (clean.includes('vastu')) {
      if (lang === 'ta') return 'வாஸ்து ஆலோசனை';
      if (lang === 'kn') return 'ವಾಸ್ತು ಸಲಹೆ';
      if (lang === 'hi') return 'वास्तु परामर्श';
    }
    if (clean.includes('marriage') || clean.includes('compatibility')) {
      if (lang === 'ta') return 'திருமணம் & உறவுமுறை பொருத்தம்';
      if (lang === 'kn') return 'ವಿವಾಹ ಹೊಂದಾಣಿಕೆ';
      if (lang === 'hi') return 'विवाह एवं संबंध मिलान';
    }
    if (clean.includes('health') || clean.includes('longevity')) {
      if (lang === 'ta') return 'ஆரோக்கியம் & ஆயுள் வழிகாட்டுதல்';
      if (lang === 'kn') return 'ಆರೋಗ್ಯ ಹಾಗೂ ಆಯುಷ್ಯ ಮಾರ್ಗದರ್ಶನ';
      if (lang === 'hi') return 'स्वास्थ्य एवं आयु मार्गदर्शन';
    }
    if (clean.includes('horoscope') || clean.includes('general')) {
      if (lang === 'ta') return 'பொது ஜாதக கணிப்பு';
      if (lang === 'kn') return 'ಸಾಮಾನ್ಯ ಜಾತಕ ವಿಶ್ಲೇಷಣೆ';
      if (lang === 'hi') return 'सामान्य कुंडली विश्लेषण';
    }
    return area;
  };

  const getLocalizedStatus = (status) => {
    if (status === 'Confirmed') {
      if (lang === 'ta') return 'உறுதிசெய்யப்பட்டது';
      if (lang === 'kn') return 'ದೃಢಪಟ್ಟಿದೆ';
      if (lang === 'hi') return 'पुष्ट';
    }
    if (status === 'Completed') {
      if (lang === 'ta') return 'நிறைவு பெற்றது';
      if (lang === 'kn') return 'ಪೂರ್ಣಗೊಂಡಿದೆ';
      if (lang === 'hi') return 'पूर्ण';
    }
    if (status === 'Pending') {
      if (lang === 'ta') return 'நிலுவையில்';
      if (lang === 'kn') return 'ಬಾಕಿ ಉಳಿದಿದೆ';
      if (lang === 'hi') return 'लंबित';
    }
    return status;
  };

  const getLocalizedAppointmentContent = (apt) => {
    if (lang === 'en') return {
      clientQuery: apt.clientQuery,
      astrologerAnswer: apt.astrologerAnswer,
      prescribedRemedies: apt.prescribedRemedies
    };

    if (apt.id === 'apt-2026-u102' || (apt.clientQuery && apt.clientQuery.includes('Ashtakoota'))) {
      if (lang === 'ta') {
        return {
          clientQuery: 'பூஜா ஐயருடன் அஷ்டகூடப் பொருத்தம், குறிப்பாக நாடி தோஷ நிவர்த்தி மற்றும் 2027 தொடக்கத்திற்கான சுப விவாக முகூர்த்த தேதிகளை ஆய்வு செய்யக் கோருகிறேன்.',
        };
      }
      if (lang === 'kn') {
        return {
          clientQuery: 'ಪೂಜಾ ಅಯ್ಯರ್ ಅವರೊಂದಿಗೆ ಅಷ್ಟಕೂಟ ಹೊಂದಾಣಿಕೆ, ವಿಶೇಷವಾಗಿ ನಾಡಿ ದೋಷ ಪರಿಹಾರ ಹಾಗೂ 2027ರ ಆರಂಭದ ಶುಭ ವಿವಾಹ ಮುಹೂರ್ತ ದಿನಾಂಕಗಳ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ವಿನಂತಿ.',
        };
      }
      if (lang === 'hi') {
        return {
          clientQuery: 'पूजा अय्यर के साथ अष्टकूट मिलान, विशेष रूप से नाड़ी दोष निवारण एवं 2027 के आरंभ के शुभ विवाह मुहूर्त तिथियों की समीक्षा हेतु परामर्श।',
        };
      }
    }

    if (apt.id === 'apt-2026-c101' || (apt.clientQuery && apt.clientQuery.includes('stagnancy'))) {
      if (lang === 'ta') {
        return {
          clientQuery: 'சிறந்த மதிப்பீடு இருந்தபோதிலும் வேலையில் பதவி உயர்வு தாமதமாகிறது. அடுத்த சூரிய பெயர்ச்சிக்குப் பின் வேலை மாறுவது நல்லதா அல்லது தற்போதைய நிறுவனத்திலேயே தொடரலாமா?',
          astrologerAnswer: 'உங்கள் 10-ஆம் வீடான கர்ம ஸ்தானம் மற்றும் சூரியப் பெயர்ச்சியை ஆராய்ந்ததில், சனியின் பார்வை காரணமாக டிசம்பர் நடுப்பகுதி வரை தற்காலிக தாமதம் நிலவுகிறது. டிசம்பர் 14-க்குப் பின் சூரியன் தனுசு ராசியில் பிரவேசித்து உங்கள் 5 மற்றும் 9-ஆம் திரிகோண ஸ்தானங்களை செயல்படுத்துகிறது. எனவே டிசம்பர் நடுப்பகுதி வரை பொறுத்திருக்கவும்; தற்போதைய நிறுவனத்திலேயே பதவி உயர்வு மற்றும் சிறந்த ஊதிய உயர்வு கிடைக்க அதிக வாய்ப்புள்ளது.',
          prescribedRemedies: '1. ஞாயிற்றுக்கிழமை தோறும் காலை சூரிய ஹோரை நேரத்தில் ஆதித்ய ஹிருதய ஸ்தோத்திரம் பாராயணம் செய்யவும்.\n2. அதிகாலை உதிக்கும் சூரிய பகவானுக்கு செங்குங்குமம் மற்றும் அட்சதையுடன் அர்க்கியம் சமர்ப்பிக்கவும்.\n3. வெள்ளி உறை கொண்ட அசல் 5-முக நேபாள ருத்ராட்சம் அணியவும்.\n4. இராகு கால நேரத்தில் புதிய வேலைக்கான முக்கிய ஒப்பந்தங்களில் கையெழுத்திடுவதைத் தவிர்க்கவும்.'
        };
      }
      if (lang === 'kn') {
        return {
          clientQuery: 'ಉತ್ತಮ ಮೌಲ್ಯಮಾಪನವಿದ್ದರೂ ಉದ್ಯೋಗದಲ್ಲಿ ಬಡ್ತಿ ವಿಳಂಬವಾಗುತ್ತಿದೆ. ಮುಂದಿನ ಸೂರ್ಯ ಸಂಚಾರದ ನಂತರ ಕೆಲಸ ಬದಲಾಯಿಸುವುದು ಸೂಕ್ತವೇ ಅಥವಾ ಪ್ರಸ್ತುತ ಕಂಪನಿಯಲ್ಲಿಯೇ ಮುಂದುವರಿಯಬೇಕೇ?',
          astrologerAnswer: 'ನಿಮ್ಮ 10ನೇ ಮನೆ (ಕರ್ಮ ಭಾವ) ಮತ್ತು ಸೂರ್ಯನ ಸಂಚಾರವನ್ನು ಪರಿಶೀಲಿಸಿದಾಗ, ಶನಿಯ ದೃಷ್ಟಿಯಿಂದಾಗಿ ಡಿಸೆಂಬರ್ ಮಧ್ಯದವರೆಗೆ ತಾತ್ಕಾಲಿಕ ವಿಳಂಬವಿದೆ. ಡಿಸೆಂಬರ್ 14ರ ನಂತರ ಸೂರ್ಯನು ಧನು ರಾಶಿಯನ್ನು ಪ್ರವೇಶಿಸಿ 5 ಮತ್ತು 9ನೇ ತ್ರಿಕೋನ ಸ್ಥಾನಗಳನ್ನು ಜಾಗೃತಗೊಳಿಸುತ್ತಾನೆ. ಆದ್ದರಿಂದ ಡಿಸೆಂಬರ್ ಮಧ್ಯದವರೆಗೆ ಬಾಹ್ಯ ಆಫರ್‌ಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳದೆ ಕಾಯುವುದು ಸೂಕ್ತ; ಪ್ರಸ್ತುತ ಸಂಸ್ಥೆಯಲ್ಲಿಯೇ ಬಡ್ತಿ ಮತ್ತು ಆಕರ್ಷಕ ವೇತನ ಪರಿಷ್ಕರಣೆ ಲಭ್ಯವಾಗಲಿದೆ.',
          prescribedRemedies: '1. ಪ್ರತಿ ಭಾನುವಾರ ಬೆಳಿಗ್ಗೆ ಸೂರ್ಯ ಹೋರೆಯ ಸಮಯದಲ್ಲಿ ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಠಿಸಿ.\n2. ಉದಯಿಸುವ ಸೂರ್ಯನಿಗೆ ಕೆಂಪು ಕುಂಕುಮ ಮತ್ತು ಅಕ್ಷತೆಯುಕ್ತ ಅರ್ಘ್ಯ ಸಮರ್ಪಿಸಿ.\n3. ಬೆಳ್ಳಿಯ ಕವಚದಲ್ಲಿ ಅಸಲಿ 5-ಮುಖಿ ನೇಪಾಳಿ ರುದ್ರಾಕ್ಷಿ ಧರಿಸಿ.\n4. ರಾಹು ಕಾಲದ ಸಮಯದಲ್ಲಿ ಉದ್ಯೋಗದ ಪ್ರಮುಖ ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಮಾಡಬೇಡಿ.'
        };
      }
      if (lang === 'hi') {
        return {
          clientQuery: 'अच्छे अप्रेजल के बावजूद करियर में पदोन्नति में देरी हो रही है। क्या अगले सूर्य गोचर के बाद नौकरी बदलना शुभ रहेगा या वर्तमान कंपनी में ही रहना चाहिए?',
          astrologerAnswer: 'आपके दशम भाव (कर्म भाव) और सूर्य गोचर के विस्तृत विश्लेषण से स्पष्ट है कि शनि की दृष्टि के कारण मध्य दिसंबर तक अस्थायी विलंब है। 14 दिसंबर के बाद सूर्य धनु राशि में प्रवेश कर आपके 5वें और 9वें त्रिकोण भाव को सक्रिय करेगा। मध्य दिसंबर तक प्रतीक्षा करना अत्यंत श्रेयस्कर है; वर्तमान संस्थान में ही पदोन्नति व वेतन वृद्धि के प्रबल योग हैं।',
          prescribedRemedies: '1. प्रत्येक रविवार सुबह सूर्य होरा में आदित्य हृदय स्तोत्र का पाठ करें।\n2. उगते सूर्य को लाल कुमकुम और अक्षत के साथ अर्घ्य अर्पित करें।\n3. चांदी के आवरण में असली 5-मुखी नेपाली रुद्राक्ष धारण करें।\n4. राहुकाल की अवधि में रोजगार संबंधी बड़े अनुबंधों पर हस्ताक्षर न करें।'
        };
      }
    }

    if (apt.id === 'apt-e451e18d' || (apt.clientQuery && apt.clientQuery.includes('Varanasi') && apt.clientQuery.includes('kitchen'))) {
      if (lang === 'ta') {
        return {
          clientQuery: 'வாரணாசியில் வடக்கு நோக்கிய புதிய குடியிருப்பு இல்லம் கட்டி வருகிறோம். தென்கிழக்கு அல்லது வடமேற்கில் சமையலறை அமைப்பது மற்றும் கிரகப்பிரவேசத்திற்கான உகந்த பூஜை பற்றி அறிய விரும்புகிறேன்.',
          astrologerAnswer: 'பாரம்பரிய வாஸ்து சாஸ்திரத்தின்படி (மயமதம்), தென்கிழக்கு (ஆக்னேய கோணம்) அக்னி தேவனால் ஆளப்படுவதால் சமையலறை அமைப்பதற்கு மிகவும் மங்கலகரமான திசையாகும். குழாய் இணைப்பு சிக்கல்கள் இருந்தால் மட்டுமே வடமேற்கு (வாயுவியம்) இரண்டாம் பட்ச தேர்வாக வைக்கப்பட வேண்டும். சமையல் செய்பவர் கிழக்கு நோக்கி சமைக்கும் வகையில் மேடை அமைக்கப்பட வேண்டும்.',
          prescribedRemedies: '1. கிரகப்பிரவேசத்திற்கு முன் சுக்ல பட்ச திரயோதசியில் வாஸ்து சாந்தி ஹோமம் மற்றும் நவக்கிரக ஹவனம் செய்யவும்.\n2. வீட்டின் வடகிழக்கு (ஈசானிய) மூலையின் அடித்தளத்தில் உருவேற்றப்பட்ட சிறிய செப்பு சுவஸ்திக் மற்றும் வாஸ்து எந்திரத்தை புதைக்கவும்.\n3. கிரகப்பிரவேச பிரம்ம முகூர்த்த நேரத்தில் கோ-பூஜை (பசு & கன்று வழிபாடு) நடத்தவும்.'
        };
      }
      if (lang === 'kn') {
        return {
          clientQuery: 'ವಾರಣಾಸಿಯಲ್ಲಿ ನೂತನ ಉತ್ತರ ಮುಖದ ಮನೆ ನಿರ್ಮಿಸುತ್ತಿದ್ದೇವೆ. ಅಡುಗೆ ಮನೆ ಆಗ್ನೇಯ ಅಥವಾ ವಾಯವ್ಯದಲ್ಲಿ ಇರಬೇಕೆ ಮತ್ತು ಗೃಹ ಪ್ರವೇಶದ ಶುಭ ಪೂಜೆಯ ಬಗ್ಗೆ ಮಾರ್ಗದರ್ಶನ ಬೇಕು.',
          astrologerAnswer: 'ಸನಾತನ ವಾಸ್ತು ಶಾಸ್ತ್ರದ ಪ್ರಕಾರ (ಮಯಮತಂ), ಆಗ್ನೇಯ ಕೋನವು ಅಗ್ನಿ ದೇವನ ದಿಕ್ಕಾಗಿದ್ದು ಅಡುಗೆ ಮನೆಗೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾದ ಸ್ಥಳವಾಗಿದೆ. ಪೈಪ್‌ಲೈನ್ ತೊಂದರೆಗಳಿದ್ದಲ್ಲಿ ಮಾತ್ರ ವಾಯವ್ಯವನ್ನು ಪರ್ಯಾಯವಾಗಿ ಬಳಸಬಹುದು. ಅಡುಗೆ ಮಾಡುವಾಗ ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡುವಂತೆ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಇರಬೇಕು.',
          prescribedRemedies: '1. ಗೃಹ ಪ್ರವೇಶಕ್ಕೆ ಮುನ್ನ ಶುಕ್ಲ ತ್ರಯೋದಶಿಯಂದು ವಾಸ್ತು ಶಾಂತಿ ಹೋಮ ಮತ್ತು ನವಗ್ರಹ ಹವನ ನೆರವೇರಿಸಿ.\n2. ಈಶಾನ್ಯ ಮೂಲೆಯ ಅಡಿಪಾಯದಲ್ಲಿ ಸಣ್ಣ ತಾಮ್ರದ ಸ್ವಸ್ತಿಕ್ ಹಾಗೂ ವಾಸ್ತು ಯಂತ್ರವನ್ನು ಸ್ಥಾಪಿಸಿ.\n3. ಗೃಹ ಪ್ರವೇಶದ ಬ್ರಹ್ಮ ಮುಹೂರ್ತದಲ್ಲಿ ಗೋ-ಪೂಜೆ ನೆರವೇರಿಸಿ.'
        };
      }
      if (lang === 'hi') {
        return {
          clientQuery: 'हम वाराणसी में एक नया उत्तर-मुखी मकान बना रहे हैं। आग्नेय या वायव्य में रसोई की स्थिति तथा गृह प्रवेश के लिए अनुशंसित पूजा के बारे में जानकारी चाहिए।',
          astrologerAnswer: 'प्रामाणिक वास्तु शास्त्र (मयमतम्) के अनुसार, दक्षिण-पूर्व (आग्नेय कोण) अग्नि देव का स्थान है और रसोई हेतु अत्यंत शुभ है। यदि जल-निकासी की समस्या हो तभी वायव्य कोण को विकल्प के रूप में चुनें। खाना बनाते समय मुख पूर्व दिशा की ओर होना चाहिए।',
          prescribedRemedies: '1. गृह प्रवेश से पूर्व शुक्ल त्रयोदशी को वास्तु शांति होम एवं नवग्रह हवन संपन्न कराएं।\n2. ईशान कोण की नींव में अभिमंत्रित तांबे का स्वास्तिक एवं वास्तु यंत्र स्थापित करें।\n3. गृह प्रवेश के ब्रह्म मुहूर्त में गौ-पूजा (गाय और बछड़े का पूजन) अवश्य करें।'
        };
      }
    }

    return {
      clientQuery: apt.clientQuery,
      astrologerAnswer: apt.astrologerAnswer,
      prescribedRemedies: apt.prescribedRemedies
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-2xl p-4 sm:p-6 shadow-sm text-slate-950 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs bg-slate-950/15 font-black px-2 py-0.5 rounded-full border border-slate-950/20">
                {t('clientPortal')}
              </span>
              {user?.astrologerReferralCode && (
                <span className="text-[10px] sm:text-xs text-indigo-950 bg-white/40 font-bold px-2 py-0.5 rounded-full border border-white/50">
                  Ref: {user.astrologerReferralCode}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              {t('namaste')}, <span>{user?.name}</span>
            </h1>
            <p className="text-xs text-slate-900/80 mt-0.5 flex flex-wrap items-center gap-2 sm:gap-3 font-medium">
              <span>{t('born')}: {user?.dob} ({user?.dobTime})</span>
              <span>•</span>
              <span>{t('place')}: {user?.dobPlace}</span>
              <span>•</span>
              <span>{t('mob')}: {user?.mobile}</span>
            </p>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-slate-950 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer self-stretch md:self-auto justify-center transition-transform active:scale-98"
          >
            <Clock className="w-4 h-4 text-amber-400" /> {t('bookSlot')}
          </button>
        </div>

        {/* Mobile-Friendly Horizontal Scroll Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-slate-950/15 overflow-x-auto touch-pan-x scroll-smooth whitespace-nowrap pb-1 scrollbar-none -mx-1 px-1">
          <button
            onClick={() => setActiveTab('panchangam')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'panchangam'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🗓️</span>
            <span>{t('dailyPanchangam')}</span>
          </button>
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'horoscope' || activeTab === 'thirukanitha' || activeTab === 'horoscope_pagers' || activeTab === 'pager'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🪐</span>
            <span>{lang === 'ta' ? 'ஜாதகம்' : 'Horoscope'}</span>
          </button>
          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matchmaking'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>💑</span>
            <span>{t('matchmaking')}</span>
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'marketplace'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🛍️</span>
            <span>{t('spiritualShop')}</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>⏱️</span>
            <span>{t('appointments')}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Panchangam */}
      {activeTab === 'panchangam' && <DailyPanchangam />}

      {/* Tab 2: Unified Horoscope Hub (Screen View + Print Pager) */}
      {(activeTab === 'horoscope' || activeTab === 'thirukanitha' || activeTab === 'horoscope_pagers' || activeTab === 'pager') && (
        <HoroscopeHub
          initialSubView={activeTab === 'horoscope_pagers' || activeTab === 'pager' ? 'print' : 'screen'}
          initialClient={user}
        />
      )}

      {/* Tab 3: Kundli Matchmaking */}
      {activeTab === 'matchmaking' && <KundliMatchmaking />}

      {/* Tab 4: Marketplace */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              {t('marketplaceTitle')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('marketplaceSubtitle')}
            </p>
          </div>

          {loadingProducts ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-spin mb-3" />
              <p className="text-slate-500 text-xs">{t('loadingDivineItems')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((item) => {
                const locItem = getLocalizedProduct(item);
                const locCategory = getLocalizedProductCategory(item.category);
                const locType = item.type === 'Service'
                  ? (lang === 'ta' ? 'சேவை' : lang === 'kn' ? 'ಸೇವೆ' : lang === 'hi' ? 'सेवा' : 'Service')
                  : (lang === 'ta' ? 'பொருள்' : lang === 'kn' ? 'ವಸ್ತು' : lang === 'hi' ? 'सामग्री' : 'Product');
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col hover:border-amber-400 hover:shadow-xs transition-all group"
                  >
                    <div className="h-40 bg-slate-100 relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={locItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.type === 'Service' ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-slate-950 font-bold'
                        }`}>
                          {locType}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/95 text-slate-900 font-black text-sm px-2.5 py-0.5 rounded-lg shadow-xs border border-slate-200">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{locCategory}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                          {locItem.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{locItem.description}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 truncate max-w-[130px]">
                          {t('byVendor')} <span className="text-slate-700 font-semibold">{item.vendorName}</span>
                        </span>
                        <button
                          onClick={() => alert(`Inquiry recorded for "${locItem.title}". The vendor has been notified.`)}
                          className="bg-amber-50 hover:bg-amber-500 hover:text-slate-950 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer"
                        >
                          {t('orderBookBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: My Booked Appointments & Consultation Tracker */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Header Action Strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" /> {t('consultationsTrackerTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('consultationsTrackerSubtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('btnBookNewSlot')}</span>
            </button>
          </div>

          {/* Section 1: Upcoming / Confirmed Appointments */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                {t('upcomingConsultations')} ({appointments.filter((a) => a.status !== 'Completed').length})
              </h4>
              <span className="text-[11px] text-slate-500">
                {t('activeBookingsLabel')}
              </span>
            </div>

            {appointments.filter((a) => a.status !== 'Completed').length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                {t('noUpcomingApts')}
              </div>
            ) : (
              <div className="space-y-3.5">
                {appointments
                  .filter((a) => a.status !== 'Completed')
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-gradient-to-br from-amber-50/40 via-white to-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">
                              {apt.memberAstrologerName
                                ? `${apt.memberAstrologerName} (${apt.astrologerName})`
                                : apt.astrologerName}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              ● {getLocalizedStatus(apt.status)}
                            </span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase">
                              {apt.appointmentType === 'offline'
                                ? '🏛️ ' + t('offline')
                                : apt.appointmentType === 'chat'
                                ? '💬 ' + t('modePlatformChat')
                                : '📹 ' + t('online')}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-amber-800 mt-0.5 block">
                            {t('topicQueryAreaLabel')}: {getLocalizedQueryArea(apt.queryArea || apt.consultationTopic)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                          <span>📅 {apt.date}</span>
                          <span>•</span>
                          <span className="text-amber-700">⏰ {apt.slotTime}</span>
                        </div>
                      </div>

                      {/* Client's Query Asked */}
                      {apt.clientQuery && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-0.5">
                          <span className="font-bold text-amber-950 text-[11px] block">
                            {t('yourQueryToAstrologer')}
                          </span>
                          <p className="text-slate-700 italic leading-relaxed">
                            "{getLocalizedAppointmentContent(apt).clientQuery || apt.clientQuery}"
                          </p>
                        </div>
                      )}

                      {/* Offline office address if applicable */}
                      {apt.appointmentType === 'offline' && apt.officeAddress && (
                        <div className="p-2.5 bg-slate-100/80 border border-slate-200 rounded-xl flex items-start gap-2 text-xs text-slate-700">
                          <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">{t('chamberVenue')}</span>
                            <span>{apt.officeAddress}</span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {lang === 'ta' ? 'பதிவு எண்' : lang === 'kn' ? 'ನೋಂದಣಿ ಸಂಖ್ಯೆ' : lang === 'hi' ? 'आईडी' : 'ID'}: {apt.id}
                        </span>
                        <div>
                          {apt.appointmentType === 'offline' ? (
                            <button
                              onClick={() => alert(`Directions to ${apt.astrologerName}: ${apt.officeAddress || 'Office coordinates sent to your mobile.'}`)}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <MapPin className="w-3.5 h-3.5" /> {t('viewDirections')}
                            </button>
                          ) : apt.appointmentType === 'chat' ? (
                            <button
                              onClick={() => alert(`Opening secure consultation chat with ${apt.astrologerName}... Connecting live session.`)}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> {t('openChat')}
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`Connecting to private HD video consultation session with ${apt.astrologerName}...`)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5" /> {t('joinVideoSession')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Section 2: Previous Meetings, Resolutions & Prescribed Remedies */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t('previousMeetingsTitle')} ({appointments.filter((a) => a.status === 'Completed').length})
                </h4>
                <p className="text-xs text-slate-500">
                  {t('archivedGuidanceSubtitle')}
                </p>
              </div>
              <div className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1 shrink-0">
                <Lock className="w-3 h-3 text-slate-500" /> {t('strictlyPrivateBadge')}
              </div>
            </div>

            {appointments.filter((a) => a.status === 'Completed').length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                {t('noCompletedRecords')}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((a) => a.status === 'Completed')
                  .map((apt) => {
                    const locApt = getLocalizedAppointmentContent(apt);
                    const locType = apt.appointmentType === 'offline'
                      ? (lang === 'ta' ? 'ஆஃப்லைன்' : lang === 'kn' ? 'ಆಫ್‌ಲೈನ್' : lang === 'hi' ? 'ऑफलाइन' : 'OFFLINE')
                      : apt.appointmentType === 'chat'
                      ? (lang === 'ta' ? 'அரட்டை' : lang === 'kn' ? 'ಚಾಟ್' : 'CHAT')
                      : (lang === 'ta' ? 'ஆன்லைன்' : lang === 'kn' ? 'ಆನ್‌ಲೈನ್' : lang === 'hi' ? 'ऑनलाइन' : 'ONLINE');
                    return (
                      <div
                        key={apt.id}
                        className="border-2 border-amber-200/90 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 shadow-xs space-y-3.5"
                      >
                        {/* Top Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-100 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900">
                                {apt.memberAstrologerName
                                  ? `${apt.memberAstrologerName} (${apt.astrologerName})`
                                  : apt.astrologerName}
                              </span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {t('completedVerifiedBadge')}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200 uppercase">
                                {locType}
                              </span>
                            </div>
                            <span className="text-[11px] text-amber-800 font-bold mt-0.5 block">
                              {t('topicQueryAreaLabel')}: {getLocalizedQueryArea(apt.queryArea || apt.consultationTopic)}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 font-medium">
                            📅 {t('conductedOn')} <strong className="text-slate-800">{apt.date} ({apt.slotTime})</strong>
                          </div>
                        </div>

                        {/* 1. Client's Query Asked */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            {t('yourQueryToAstrologer')}
                          </span>
                          <p className="text-slate-700 italic pl-5 leading-relaxed">
                            "{locApt.clientQuery || apt.consultationTopic || (lang === 'ta' ? 'பொது ஜாதக கணிப்பு' : 'General Horoscope Analysis')}"
                          </p>
                        </div>

                        {/* 2. Astrologer's Answer & Resolution */}
                        <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs space-y-1.5">
                          <span className="font-bold text-indigo-950 text-[11px] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            {t('astrologerAnswerHeading')}
                          </span>
                          <p className="text-slate-800 pl-5 leading-relaxed whitespace-pre-line font-medium">
                            {locApt.astrologerAnswer || (lang === 'ta' ? 'ஆலோசனை நிறைவு பெற்றது. ஜோதிட வழிகாட்டுதல் வழங்கப்பட்டது.' : 'Consultation conducted. Planetary guidance delivered.')}
                          </p>
                        </div>

                        {/* 3. Prescribed Vedic Remedies */}
                        {locApt.prescribedRemedies && (
                          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1.5">
                            <span className="font-bold text-amber-950 text-[11px] flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                              {t('prescribedRemediesHeading')}
                            </span>
                            <p className="text-amber-950 pl-5 leading-relaxed whitespace-pre-line">
                              {locApt.prescribedRemedies}
                            </p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                          <span>{lang === 'ta' ? 'ஆவண எண்' : lang === 'kn' ? 'ದಾಖಲೆ ಸಂಖ್ಯೆ' : lang === 'hi' ? 'दस्तावेज सं.' : 'Doc Ref'}: {apt.id}</span>
                          <button
                            onClick={() => window.print()}
                            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3 h-3" /> {t('downloadConsultationSummary')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      <SlotBookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          fetchAppointments();
        }}
      />
    </div>
  );
}
