import React, { useState, useEffect } from 'react';
import {
  Heart, HeartHandshake, Sparkles, CheckCircle2, Phone, User, Calendar, MapPin,
  ExternalLink, ArrowRight, ShieldCheck, Search, Filter, Briefcase, GraduationCap,
  Users, Lock, ChevronRight, ChevronLeft, Plus, Eye, Check, AlertCircle, Bookmark,
  Star, FileText, Camera, RefreshCw, X, MessageSquare, Award, Clock
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { API } from '../api';
import { formatNakshatra, formatRasi, formatDosha, formatMaritalStatus } from '../matrimonyLocalization';
import { calculateThirukanithaHoroscope, NAKSHATRAS, RASHIS } from '../utils/thirukanithaEngine';
import MarriageBiodataModal from './MarriageBiodataModal';
import AstrologerConsultationModal from './AstrologerConsultationModal';

const NAKSHATRA_OPTIONS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const RASI_OPTIONS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karkata (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanus (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

const HEIGHT_OPTIONS = [
  "4'10\" (147 cm)", "4'11\" (150 cm)", "5'0\" (152 cm)", "5'1\" (155 cm)",
  "5'2\" (157 cm)", "5'3\" (160 cm)", "5'4\" (162 cm)", "5'5\" (165 cm)",
  "5'6\" (168 cm)", "5'7\" (170 cm)", "5'8\" (173 cm)", "5'9\" (175 cm)",
  "5'10\" (178 cm)", "5'11\" (180 cm)", "6'0\" (183 cm)", "6'1\" (185 cm)",
  "6'2\" (188 cm)", "6'3\" (190 cm)", "6'4\" (193 cm)"
];

/**
 * Accurately calculate Vedic Thirukanitha Ephemeris details from Astrojit profile
 * Returns empty values if profile has no DOB/Birth Time (strictly NO demo data)
 */
export function getHoroscopeDetailsFromProfile(p) {
  if (!p || !p.dob || !p.dobTime) {
    return {
      starNakshatra: '',
      rasiMoonSign: '',
      lagnamAscendant: '',
      padam: '',
      manglikDosha: 'No Chevvai Dosha',
    };
  }

  try {
    const horo = calculateThirukanithaHoroscope({
      name: p.name || 'Native',
      dob: p.dob,
      dobTime: p.dobTime,
      placeName: p.dobPlace || p.city || 'Salem',
      city: p.city || p.dobPlace || 'Salem',
      lat: p.lat || 11.6643,
      lon: p.lon || 78.1460,
    });

    if (horo && horo.summary) {
      const nakObj = NAKSHATRAS[horo.summary.moonNak];
      const matchedRasi = RASI_OPTIONS[horo.summary.moonRasi] || '';
      const matchedLagna = RASI_OPTIONS[horo.summary.lagnaRasi] || '';

      const mars = (horo.planets || []).find(pl => pl.id === 'mars');
      let manglikDosha = 'No Chevvai Dosha';
      if (mars && horo.summary.lagnaRasi !== undefined) {
        const houseFromLagna = ((mars.rasi - horo.summary.lagnaRasi + 12) % 12) + 1;
        const houseFromMoon = ((mars.rasi - horo.summary.moonRasi + 12) % 12) + 1;
        if ([2, 4, 7, 8, 12].includes(houseFromLagna) || [2, 4, 7, 8, 12].includes(houseFromMoon)) {
          manglikDosha = 'Chevvai Dosham Present';
        }
      }

      return {
        starNakshatra: nakObj?.en || '',
        rasiMoonSign: matchedRasi,
        lagnamAscendant: matchedLagna,
        padam: horo.summary.moonPada || 1,
        manglikDosha,
      };
    }
  } catch (err) {
    console.error('Error computing Thirukanitha horoscope for matrimony profile:', err);
  }

  return {
    starNakshatra: '',
    rasiMoonSign: '',
    lagnamAscendant: '',
    padam: '',
    manglikDosha: 'No Chevvai Dosha',
  };
}

export function formatTimeForInput(val) {
  if (!val) return '';
  const str = String(val).trim();
  const m24 = str.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m24) {
    return `${m24[1].padStart(2, '0')}:${m24[2]}`;
  }
  const m12 = str.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const m = m12[2];
    const isPm = (m12[3] || '').toLowerCase() === 'pm';
    const isAm = (m12[3] || '').toLowerCase() === 'am';
    if (isPm && h < 12) h += 12;
    if (isAm && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
  }
  return str;
}

export function calculateAgeFromDob(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(18, age);
}

export default function MatrimonyPortal({ isModal = false, onClose, defaultTab = 'browse', hideHeroBanner = false }) {
  const { lang, t } = useLang();
  const { user } = useAuth();

  // Pure Unilingual Helper: strict display based on currently selected language
  const tr = (en, ta, kn, hi, te, bn) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    if (lang === 'te') return te || en;
    if (lang === 'bn') return bn || en;
    return en;
  };

  // Navigation tab
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  
  // Data states
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [autofillSources, setAutofillSources] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState('client-self');
  const [interests, setInterests] = useState([]);
  const [shortlists, setShortlists] = useState([]);
  const [autofillSuccessMsg, setAutofillSuccessMsg] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [casteFilter, setCasteFilter] = useState('All');
  const [nakshatraFilter, setNakshatraFilter] = useState('All');

  // Compatibility Modal State
  const [compatibilityModal, setCompatibilityModal] = useState({
    isOpen: false,
    loading: false,
    result: null,
    candidate: null,
  });

  // Contact Modal State
  const [contactModal, setContactModal] = useState({
    isOpen: false,
    profile: null,
  });

  // Biodata Modal State
  const [biodataModalProfile, setBiodataModalProfile] = useState(null);

  // Astrologer Consultation Modal State
  const [consultationModal, setConsultationModal] = useState({
    isOpen: false,
    candidate: null,
    result: null,
  });

  // Family Member Modal State
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relation: 'Sister',
    gender: 'Bride',
    dob: '',
    dobTime: '',
    dobPlace: '',
    fatherName: user?.fatherName || '',
    motherName: user?.motherName || '',
    mobile: '',
    occupation: '',
    highestEducation: '',
  });

  // Wizard state (Steps 1 to 10)
  const [wizardStep, setWizardStep] = useState(1);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [registeredProfileResult, setRegisteredProfileResult] = useState(null);

  // 12-section Registration Form State
  const [formData, setFormData] = useState({
    // 1. Basic Profile Information
    profileCreatedBy: 'Self',
    profileType: 'Groom',
    name: user?.name || '',
    gender: 'Male',
    dob: user?.dob || '',
    age: '',
    height: '',
    weight: '',
    maritalStatus: 'Never Married',
    physicalStatus: 'Normal',
    bloodGroup: '',
    motherTongue: '',
    aboutMe: '',

    // 2. Personal & Lifestyle
    religion: 'Hindu',
    caste: '',
    subCaste: '',
    community: '',
    sect: '',
    gotra: '',
    manglikDosha: 'No',
    eatingHabits: '',
    drinkingHabits: 'No',
    smokingHabits: 'No',
    hobbies: '',
    personality: '',
    languagesKnown: '',

    // 3. Religious & Horoscope
    starNakshatra: '',
    rasiMoonSign: '',
    lagnamAscendant: '',
    padam: '',
    doshamDetails: '',
    birthTime: user?.dobTime || '',
    birthPlace: user?.dobPlace || '',
    horoscopeMatchingPreference: 'Must Match',
    horoscopeDocUrl: '',

    // 4. Education
    highestEducation: '',
    degree: '',
    specialization: '',
    college: '',
    passingYear: '',
    additionalQualifications: '',
    certifications: '',
    educationDescription: '',

    // 5. Career & Employment
    employmentStatus: '',
    occupation: '',
    jobTitle: '',
    companyName: '',
    industry: '',
    workLocationCountry: 'India',
    workLocationState: '',
    workLocationCity: '',
    annualIncome: '',
    monthlyIncome: '',
    workExperience: '',
    careerDescription: '',

    // 6. Family Background
    fatherName: user?.fatherName || '',
    fatherOccupation: '',
    motherName: user?.motherName || '',
    motherOccupation: '',
    brothersCount: 0,
    brothersMarried: 0,
    sistersCount: 0,
    sistersMarried: 0,
    familyType: 'Nuclear',
    familyStatus: 'Middle Class',
    familyValues: 'Traditional',
    nativePlace: '',
    familyOrigin: '',
    familyDescription: '',

    // 7. Location Details
    country: 'India',
    state: '',
    district: '',
    city: '',
    currentResidence: '',
    citizenship: 'Indian',
    residentialStatus: 'Citizen',

    // 8. Physical Appearance
    bodyType: '',
    complexion: '',
    physicalDisability: 'None',
    primaryPhotoUrl: '',

    // 9. Partner Preferences
    partnerAgeMin: '',
    partnerAgeMax: '',
    partnerHeightMin: '',
    partnerHeightMax: '',
    partnerMaritalStatus: 'Never Married',
    partnerReligion: 'Hindu',
    partnerCaste: '',
    partnerMotherTongue: '',
    partnerEducation: '',
    partnerOccupation: '',
    partnerIncome: '',
    partnerLocationCountry: 'India',
    partnerDiet: '',
    partnerHoroscopeMatch: 'Must Match',
    partnerDoshaPreference: '',
    partnerExpectations: '',

    // 10. Contact Information
    mobile: user?.mobile || '',
    altMobile: '',
    email: '',
    whatsappNumber: user?.mobile || '',
    contactPerson: user?.name || '',
    contactPersonRelation: 'Self',
    preferredContactMethod: 'WhatsApp & Direct Call',
    contactVisibility: 'Public',

    // 11. Profile Photos & Documents
    photoGallery: [],

    // 12. Account & Security Details
    loginMobile: user?.mobile || '',
    profileVisibility: 'Public',
    termsAccepted: false,
    privacyAccepted: false,
  });

  // Calculate age automatically whenever DOB changes
  useEffect(() => {
    if (formData.dob) {
      const birth = new Date(formData.dob);
      if (!isNaN(birth.getTime())) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calculatedAge--;
        }
        setFormData(prev => ({ ...prev, age: Math.max(18, calculatedAge) }));
      }
    }
  }, [formData.dob]);

  // Auto-calculate Thirukanitha horoscope from provided birth details
  const handleAutoComputeHoroscope = (birthDate, birthTime, birthPlace) => {
    const d = birthDate || formData.dob;
    const t = birthTime || formData.birthTime;
    const p = birthPlace || formData.birthPlace || formData.city;
    if (!d || !t) return;
    const computed = getHoroscopeDetailsFromProfile({
      dob: d,
      dobTime: t,
      dobPlace: p,
      city: p,
      lat: user?.lat,
      lon: user?.lon
    });
    if (computed.starNakshatra) {
      setFormData(prev => ({
        ...prev,
        starNakshatra: computed.starNakshatra,
        rasiMoonSign: computed.rasiMoonSign,
        lagnamAscendant: computed.lagnamAscendant,
        padam: computed.padam,
        manglikDosha: computed.manglikDosha
      }));
    }
  };

  // Synchronize profile details strictly from Astrojit profile whenever user changes
  useEffect(() => {
    if (!user) return;

    let computedHoro = { starNakshatra: '', rasiMoonSign: '', lagnamAscendant: '', padam: '', manglikDosha: 'No Chevvai Dosha' };
    if (user.dob && user.dobTime) {
      computedHoro = getHoroscopeDetailsFromProfile(user);
    }

    setFormData(prev => ({
      ...prev,
      name: user.name || prev.name || '',
      gender: user.gender === 'female' ? 'Female' : (user.gender === 'male' ? 'Male' : prev.gender),
      profileType: (user.gender === 'female' || user.profileType === 'Bride') ? 'Bride' : (user.gender === 'male' || user.profileType === 'Groom' ? 'Groom' : prev.profileType),
      dob: user.dob || prev.dob || '',
      birthTime: user.dobTime || prev.birthTime || '',
      birthPlace: user.dobPlace || user.city || prev.birthPlace || '',
      country: user.country || prev.country || 'India',
      state: user.state || prev.state || '',
      city: user.city || user.dobPlace || prev.city || '',
      fatherName: user.fatherName || prev.fatherName || '',
      motherName: user.motherName || prev.motherName || '',
      mobile: user.mobile || prev.mobile || '',
      whatsappNumber: user.mobile || prev.whatsappNumber || '',
      loginMobile: user.mobile || prev.loginMobile || '',
      email: user.email || prev.email || '',
      caste: user.caste || prev.caste || '',
      gotra: user.gotra || prev.gotra || '',
      religion: user.religion || prev.religion || 'Hindu',
      contactPerson: user.name || prev.contactPerson || '',
      starNakshatra: computedHoro.starNakshatra || prev.starNakshatra || '',
      rasiMoonSign: computedHoro.rasiMoonSign || prev.rasiMoonSign || '',
      lagnamAscendant: computedHoro.lagnamAscendant || prev.lagnamAscendant || '',
      padam: computedHoro.padam || prev.padam || '',
      manglikDosha: computedHoro.manglikDosha || prev.manglikDosha || 'No Chevvai Dosha',
    }));
  }, [user]);

  // Load Initial Data (Profiles, Autofill Sources, Shortlists, Interests)
  const loadInitialData = async () => {
    try {
      setLoadingProfiles(true);
      const [profs, sources, ints, shorts] = await Promise.all([
        API.getMatrimonyProfiles(),
        API.getMatrimonyAutofillSources(user?.id),
        API.getMatrimonyInterests().catch(() => []),
        API.getMatrimonyShortlists().catch(() => []),
      ]);

      setProfiles(profs || []);
      setAutofillSources(sources);
      setInterests(ints || []);
      setShortlists(shorts || []);
    } catch (err) {
      console.error('Error loading initial matrimony data:', err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle Person Selection & 1-Click Autofill from Astrojit profile
  const handleAutofillPerson = (personId) => {
    setSelectedPersonId(personId);
    setActiveTab('register');

    const isSelf = personId === 'client-self';
    const foundClient = !isSelf && (autofillSources?.clientsList || []).find(cl => cl.id === personId);
    const fm = !isSelf && !foundClient && (autofillSources?.familyMembers || []).find(m => m.id === personId);

    const c = isSelf ? (autofillSources?.client || user) : (foundClient || null);

    if (c) {
      const horoDetails = getHoroscopeDetailsFromProfile(c);
      const targetDob = c.dob || user?.dob || '';
      const calculatedAge = c.age || calculateAgeFromDob(targetDob) || '';
      const birthTimeVal = formatTimeForInput(c.dobTime || c.birthTime || user?.dobTime || '');
      const birthPlaceStr = c.dobPlace || c.city || user?.dobPlace || user?.city || '';
      const cityStr = c.city || user?.city || (birthPlaceStr ? birthPlaceStr.split(',')[0].trim() : '');
      const stateStr = c.state || user?.state || (birthPlaceStr && birthPlaceStr.includes(',') ? birthPlaceStr.split(',')[1].trim() : 'Tamil Nadu');
      const countryStr = c.country || user?.country || 'India';
      const isBride = (c.gender === 'female' || c.gender === 'Female' || c.profileType === 'Bride');

      setFormData(prev => ({
        ...prev,
        // 1. Basic Profile Information
        profileCreatedBy: isSelf ? 'Self' : 'Astrologer / Manager',
        profileType: isBride ? 'Bride' : 'Groom',
        name: c.name || user?.name || prev.name || '',
        gender: isBride ? 'Female' : 'Male',
        dob: targetDob || prev.dob || '',
        age: calculatedAge || prev.age || '',
        maritalStatus: c.maritalStatus || prev.maritalStatus || 'Never Married',
        motherTongue: c.motherTongue || prev.motherTongue || (lang === 'ta' ? 'Tamil' : lang === 'kn' ? 'Kannada' : lang === 'hi' ? 'Hindi' : 'Tamil'),
        physicalStatus: c.physicalStatus || prev.physicalStatus || 'Normal',

        // 2. Personal & Lifestyle
        religion: c.religion || user?.religion || prev.religion || 'Hindu',
        caste: c.caste || user?.caste || prev.caste || '',
        subCaste: c.subCaste || user?.subCaste || prev.subCaste || '',
        gotra: c.gotra || user?.gotra || prev.gotra || '',

        // 3. Religious & Horoscope
        starNakshatra: horoDetails.starNakshatra || c.horoscope?.nakshatra || prev.starNakshatra || '',
        rasiMoonSign: horoDetails.rasiMoonSign || c.horoscope?.rasi || prev.rasiMoonSign || '',
        lagnamAscendant: horoDetails.lagnamAscendant || c.horoscope?.lagna || prev.lagnamAscendant || '',
        padam: horoDetails.padam || c.horoscope?.pada || prev.padam || '',
        manglikDosha: horoDetails.manglikDosha || c.horoscope?.chevvaiDosha || prev.manglikDosha || 'No Chevvai Dosha',
        birthTime: birthTimeVal || prev.birthTime || '',
        birthPlace: birthPlaceStr || prev.birthPlace || '',
        horoscopeMatchingPreference: 'Must Match',

        // 4. Education & Career
        highestEducation: c.highestEducation || c.education || user?.highestEducation || user?.education || prev.highestEducation || '',
        degree: c.degree || c.highestEducation || c.education || prev.degree || '',
        occupation: c.occupation || user?.occupation || prev.occupation || '',
        jobTitle: c.jobTitle || c.occupation || user?.occupation || prev.jobTitle || '',
        annualIncome: c.annualIncome || user?.annualIncome || prev.annualIncome || '',
        workLocationCity: cityStr || prev.workLocationCity || '',
        workLocationState: stateStr || prev.workLocationState || '',
        workLocationCountry: countryStr || prev.workLocationCountry || 'India',

        // 5. Family Background
        fatherName: c.fatherName || user?.fatherName || prev.fatherName || '',
        motherName: c.motherName || user?.motherName || prev.motherName || '',
        nativePlace: c.nativePlace || cityStr || birthPlaceStr || prev.nativePlace || '',

        // 6. Location Details
        country: countryStr,
        state: stateStr,
        city: cityStr,
        district: c.district || cityStr || prev.district || '',
        currentResidence: c.currentResidence || cityStr || birthPlaceStr || prev.currentResidence || '',
        citizenship: 'Indian',
        residentialStatus: 'Citizen',

        // 7. Contact Information
        mobile: c.mobile || user?.mobile || prev.mobile || '',
        whatsappNumber: c.whatsappNumber || c.mobile || user?.mobile || prev.whatsappNumber || '',
        loginMobile: c.mobile || user?.mobile || prev.loginMobile || '',
        email: c.email || user?.email || prev.email || '',
        contactPerson: `${c.name || user?.name || prev.contactPerson || ''}`,
        contactPersonRelation: isSelf ? 'Self' : 'Astrologer / Manager',
        preferredContactMethod: 'WhatsApp & Direct Call',
        contactVisibility: 'Public',

        // 8. Security & Account
        profileVisibility: 'Public',
        termsAccepted: true,
        privacyAccepted: true,
      }));

      const starLabel = horoDetails.starNakshatra || c.horoscope?.nakshatra;
      const rasiLabel = horoDetails.rasiMoonSign || c.horoscope?.rasi;
      setAutofillSuccessMsg(
        tr(
          `Successfully gathered Astrojit details for ${c.name}!${starLabel ? ` Star: ${starLabel}, Rasi: ${rasiLabel}.` : ''}`,
          `Astrojit சுயவிவரத்திலிருந்து ${c.name} அவர்களின் விவரங்கள் வெற்றிகரமாக நிரப்பப்பட்டன!${starLabel ? ` நட்சத்திரம்: ${starLabel}, ராசி: ${rasiLabel}.` : ''}`,
          `Astrojit ಪ್ರೊಫೈಲ್‌ನಿಂದ ${c.name} ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಭರ್ತಿ ಮಾಡಲಾಗಿದೆ!`,
          `Astrojit प्रोफाइल से ${c.name} के संबंधित विवरण सफलतापूर्वक भर दिए गए हैं!`
        )
      );
      setTimeout(() => setAutofillSuccessMsg(''), 6000);
      return;
    }

    if (fm) {
      const isBride = (fm.gender || '').toLowerCase().includes('bride') || (fm.relation || '').toLowerCase().includes('sister') || (fm.relation || '').toLowerCase().includes('daughter');
      const horoDetails = getHoroscopeDetailsFromProfile(fm);
      const calculatedAge = fm.age || calculateAgeFromDob(fm.dob) || '';
      const birthTimeVal = formatTimeForInput(fm.dobTime || '');
      const birthPlaceStr = fm.dobPlace || '';
      const cityStr = (birthPlaceStr ? birthPlaceStr.split(',')[0].trim() : '') || 'Chennai';
      const stateStr = (birthPlaceStr && birthPlaceStr.includes(',') ? birthPlaceStr.split(',')[1].trim() : 'Tamil Nadu');

      setFormData(prev => ({
        ...prev,
        profileCreatedBy: fm.relation === 'Sister' ? 'Brother' : fm.relation === 'Brother' ? 'Brother' : (fm.relation || 'Relative'),
        profileType: isBride ? 'Bride' : 'Groom',
        name: fm.name || '',
        gender: isBride ? 'Female' : 'Male',
        dob: fm.dob || '',
        age: calculatedAge,
        birthTime: birthTimeVal,
        birthPlace: birthPlaceStr,
        country: 'India',
        state: stateStr,
        city: cityStr,
        nativePlace: cityStr,
        currentResidence: cityStr,
        fatherName: fm.fatherName || user?.fatherName || '',
        motherName: fm.motherName || user?.motherName || '',
        mobile: fm.mobile || user?.mobile || '',
        whatsappNumber: fm.mobile || user?.mobile || '',
        loginMobile: user?.mobile || '',
        email: fm.email || '',
        occupation: fm.occupation || '',
        maritalStatus: fm.maritalStatus || 'Never Married',
        highestEducation: fm.highestEducation || '',
        contactPerson: `${user?.name || ''}`,
        contactPersonRelation: fm.relation || 'Relative',
        starNakshatra: horoDetails.starNakshatra || fm.horoscope?.nakshatra || '',
        rasiMoonSign: horoDetails.rasiMoonSign || fm.horoscope?.rasi || '',
        lagnamAscendant: horoDetails.lagnamAscendant || fm.horoscope?.lagna || '',
        padam: horoDetails.padam || fm.horoscope?.pada || '',
        manglikDosha: horoDetails.manglikDosha || fm.horoscope?.chevvaiDosha || 'No Chevvai Dosha',
        primaryPhotoUrl: fm.photoUrl || '',
        termsAccepted: true,
        privacyAccepted: true,
      }));

      setAutofillSuccessMsg(
        tr(
          `Successfully gathered details for ${fm.name} (${fm.relation}) from Astrojit family profile!`,
          `Astrojit குடும்ப சுயவிவரத்திலிருந்து ${fm.name} (${fm.relation}) விவரங்கள் பெறப்பட்டன!`,
          `Astrojit ಕುಟುಂಬ ಪ್ರೊಫೈಲ್‌ನಿಂದ ${fm.name} ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗಿದೆ!`,
          `Astrojit पारिवारिक प्रोफाइल से ${fm.name} के विवरण प्राप्त किए गए!`
        )
      );
      setTimeout(() => setAutofillSuccessMsg(''), 6000);
    }
  };

  // Add Family Member Modal Submit
  const handleCreateFamilyMember = async (e) => {
    e.preventDefault();
    try {
      const res = await API.addFamilyMember(newFamilyMember);
      if (res.success) {
        setFamilyModalOpen(false);
        await loadInitialData();
        setSelectedPersonId(res.familyMember.id);
        handleAutofillPerson(res.familyMember.id);
        setAutofillSuccessMsg(
          tr(
            `Family member ${newFamilyMember.name} added and horoscope computed!`,
            `குடும்ப உறுப்பினர் ${newFamilyMember.name} சேர்க்கப்பட்டு ஜாதகம் கணக்கிடப்பட்டது!`,
            `ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಲಾಗಿದೆ ಮತ್ತು ಜಾತಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ!`,
            `पारिवारिक सदस्य जोड़े गए एवं कुंडली गणना पूर्ण हुई!`
          )
        );
        setTimeout(() => setAutofillSuccessMsg(''), 6000);
      }
    } catch (err) {
      alert('Error adding family member: ' + err.message);
    }
  };

  // Wizard Profile Submission
  const handleRegisterProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await API.registerMatrimonyProfile(formData);
      if (res.success) {
        setRegisteredProfileResult(res.profile);
        await loadInitialData();
      }
    } catch (err) {
      alert('Failed to register matrimony profile: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Send Interest
  const handleSendInterest = async (toProfileId) => {
    try {
      const fromId = profiles[0]?.id || 'AJ-MAT-2026-1001';
      const res = await API.sendMatrimonyInterest({
        fromProfileId: fromId,
        toProfileId,
        message: 'Namaste! We came across your matrimony profile and found strong alignment. Would love to connect and share horoscopes.',
      });
      alert(tr('Interest sent successfully to candidate!', 'விருப்பக் கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது!', 'ಆಸಕ್ತಿಯ ವಿನಂತಿ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!', 'रुचि अनुरोध सफलतापूर्वक भेजा गया!'));
      const updatedInts = await API.getMatrimonyInterests();
      setInterests(updatedInts);
    } catch (err) {
      alert('Failed to send interest: ' + err.message);
    }
  };

  // Toggle Shortlist Bookmark
  const handleToggleShortlist = async (profileId) => {
    try {
      const res = await API.toggleMatrimonyShortlist({
        userId: user?.id || 'client-1',
        profileId,
      });
      const updatedShorts = await API.getMatrimonyShortlists();
      setShortlists(updatedShorts);
    } catch (err) {
      alert('Error updating shortlist: ' + err.message);
    }
  };

  // Compatibility Check
  const handleCheckCompatibility = async (candidate) => {
    setCompatibilityModal({
      isOpen: true,
      loading: true,
      result: null,
      candidate,
    });

    try {
      const myProfile = profiles.find(p => p.matrimonyId === 'AJ-MAT-2026-1001' || p.gender !== candidate.gender) || profiles[0];
      const isCandidateBride = (candidate.profileType || candidate.gender || '').toLowerCase().includes('bride');

      const boy = isCandidateBride ? myProfile : candidate;
      const girl = isCandidateBride ? candidate : myProfile;

      const data = await API.checkMatrimonyCompatibility({
        boyProfileId: boy?.matrimonyId || boy?.id,
        girlProfileId: girl?.matrimonyId || girl?.id,
        boyData: boy,
        girlData: girl,
      });

      setCompatibilityModal({
        isOpen: true,
        loading: false,
        result: data,
        candidate,
      });
    } catch (err) {
      console.error('Compatibility error:', err);
      alert('Could not calculate compatibility: ' + err.message);
      setCompatibilityModal(prev => ({ ...prev, loading: false, isOpen: false }));
    }
  };

  // Filtered Profiles
  const filteredProfiles = profiles.filter(p => {
    if (genderFilter !== 'All') {
      const type = (p.profileType || p.gender || '').toLowerCase();
      if (genderFilter === 'Brides' && !type.includes('bride') && !type.includes('female')) return false;
      if (genderFilter === 'Grooms' && !type.includes('groom') && !type.includes('male')) return false;
    }
    if (casteFilter !== 'All' && !(p.caste || '').toLowerCase().includes(casteFilter.toLowerCase())) {
      return false;
    }
    if (nakshatraFilter !== 'All' && !(p.starNakshatra || p.nakshatra || '').toLowerCase().includes(nakshatraFilter.toLowerCase())) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (p.name || '').toLowerCase().includes(q) ||
        (p.matrimonyId || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.occupation || '').toLowerCase().includes(q) ||
        (p.highestEducation || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Calculate completeness progress for registration form
  const computeCurrentCompleteness = () => {
    let score = 20;
    if (formData.name && formData.dob) score += 10;
    if (formData.starNakshatra && formData.rasiMoonSign) score += 15;
    if (formData.highestEducation && formData.occupation) score += 15;
    if (formData.fatherName && formData.motherName) score += 15;
    if (formData.partnerAgeMin && formData.partnerEducation) score += 10;
    if (formData.mobile && formData.email) score += 15;
    return Math.min(100, score);
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${isModal ? 'max-h-[88vh] overflow-y-auto p-1' : ''}`}>
      {/* Top Header Card */}
      {!hideHeroBanner && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                {tr('VEDIC MATRIMONY & JATHAGAM', 'வைதீக திருமணத் தகவல் மையம்', 'ವೈದಿಕ ಮ್ಯಾಟ್ರಿಮೋನಿ & ಜಾತಕ', 'वैदिक मैट्रिमोनी एवं कुंडली')}
              </span>
              <span className="text-[11px] font-bold bg-amber-300 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" /> {tr('10 Poruthams & 36 Gunas Verified', '10 பொருத்தங்கள் & 36 குணங்கள் சரிபார்க்கப்பட்டது', '10 ಹೊಂದಾಣಿಕೆಗಳು & 36 ಗುಣಗಳು', '10 पोरुथम एवं 36 गुण सत्यापित')}
              </span>
              <span className="text-[11px] font-bold bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {tr('100% Privacy Control', '100% பாதுகாப்பு', '100% ಗೌಪ್ಯತೆ ರಕ್ಷಣೆ', '100% गोपनीयता संरक्षण')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {tr('Astrojit Vedic Matrimony Portal', 'அஸ்ட்ரோஜித் வைதீக திருமணத் தகவல் மையம்', 'ಆಸ್ಟ್ರೋಜಿತ್ ವೈದಿಕ ವಿವಾಹ ಪೋರ್ಟಲ್', 'एस्ट्रोजित वैदिक विवाह पोर्टल')}
            </h1>
            <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-medium">
              {tr(
                'Connect with verified life partners with authentic 10 Poruthams & 36 Gunas Vedic alignment. Direct profile registration & family member integration.',
                'உங்கள் குடும்ப உறுப்பினர்களுக்கான மங்களகரமான வரன்களை 10 பொருத்தங்கள் மற்றும் 36 குணங்கள் துல்லிய அஷ்டகூட ஆய்வுடன் கண்டறியுங்கள்.',
                'ನಿಖರ 10 ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು 36 ಗುಣಗಳ ಆಧಾರದ ಮೇಲೆ ಪರಿಶೀಲಿತ ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ.',
                '10 पोरुथम एवं 36 गुण वैदिक मिलान के साथ सुयोग्य वर-वधू खोजें। परिवार के सदस्यों का त्वरित पंजीकरण।'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { setActiveTab('register'); setWizardStep(1); }}
              className="px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {tr('Register New Profile', 'புதிய வரன் பதிவு செய்க', 'ಹೊಸ ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ', 'नई प्रोफाइल पंजीकृत करें')}
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              {tr('Family Members', 'குடும்ப உறுப்பினர்கள்', 'ಕುಟುಂಬ ಸದಸ್ಯರು', 'पारिवारिक सदस्य')}
            </button>
          </div>
        </div>

        {/* Portal Navigation Pills */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/20 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'bg-white text-rose-900 shadow-md font-black'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Search className="w-4 h-4" />
            {tr('Browse Profiles', 'வரன் தேடல்', 'ವರನ್ ಹುಡುಕಾಟ', 'वर-वधू खोजें')}
            <span className="ml-1 px-1.5 py-0.2 bg-rose-200 text-rose-900 rounded-full text-[10px]">
              {profiles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-rose-900 shadow-md font-black'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <FileText className="w-4 h-4" />
            {tr('10-Step Registration', 'வரன் பதிவு', 'ಹಂತ-ಹಂತದ ನೋಂದಣಿ', 'पंजीकरण फॉर्म')}
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'family'
                ? 'bg-white text-rose-900 shadow-md font-black'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Users className="w-4 h-4" />
            {tr('Family & Autofill', 'குடும்பம் & தானியங்கு நிரப்புதல்', 'ಕುಟುಂಬ & ಸ್ವಯಂ ಭರ್ತಿ', 'परिवार एवं स्वतः भरण')}
            <span className="ml-1 px-1.5 py-0.2 bg-amber-200 text-amber-950 rounded-full text-[10px]">
              {(autofillSources?.familyMembers || []).length + 1}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interests')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'interests'
                ? 'bg-white text-rose-900 shadow-md font-black'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Heart className="w-4 h-4" />
            {tr('Interests & Shortlists', 'விருப்பங்கள் & சேமித்தவை', 'ಆಸಕ್ತಿಗಳು & ಉಳಿಸಿದವು', 'रुचियां व पसंदीदा')}
            <span className="ml-1 px-1.5 py-0.2 bg-pink-200 text-pink-950 rounded-full text-[10px]">
              {shortlists.length}
            </span>
          </button>
        </div>
      </div>
      )}

      {/* Success Notification Banner */}
      {autofillSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{autofillSuccessMsg}</p>
          </div>
          <button onClick={() => setAutofillSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            {tr('Dismiss', 'நீக்குக', 'ಮುಚ್ಚಿ', 'हटाएं')}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: BROWSE PROFILES */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-4 sm:space-y-5">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={tr(
                    'Search by name, profession, city, Matrimony ID...',
                    'பெயர், தொழில், ஊர், வரன் ஐடி தேடுக...',
                    'ಹೆಸರು, ವೃತ್ತಿ, ಊರು ಅಥವಾ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ...',
                    'नाम, पेशा, शहर या विवाह आईडी से खोजें...'
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Gender / Profile Type */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  {['All', 'Brides', 'Grooms'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        genderFilter === g
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {g === 'All' 
                        ? tr('All', 'அனைத்தும்', 'ಎಲ್ಲವೂ', 'सभी') 
                        : g === 'Brides' 
                        ? tr('Brides', 'மணமகள்', 'ವಧು', 'वधू') 
                        : tr('Grooms', 'மணமகன்', 'ವರ', 'वर')}
                    </button>
                  ))}
                </div>

                {/* Caste Filter */}
                <select
                  value={casteFilter}
                  onChange={(e) => setCasteFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-hidden"
                >
                  <option value="All">{tr('All Castes', 'அனைத்து சாதி / சமூகம்', 'ಎಲ್ಲಾ ಜಾತಿಗಳು', 'सभी जातियां')}</option>
                  <option value="Brahmin">{tr('Brahmin', 'பிராமணர்', 'ಬ್ರಾಹ್ಮಣ', 'ब्राह्मण')}</option>
                  <option value="Pillai">{tr('Pillai / Mudaliar', 'பிள்ளை / முதலியார்', 'ಪಿಳ್ಳೈ / ಮೊದಲಿಯಾರ್', 'पिल्लई / मुदलियार')}</option>
                  <option value="Chettiar">{tr('Chettiar', 'செட்டியார்', 'ಚೆಟ್ಟಿಯಾರ್', 'செட்டியார்')}</option>
                  <option value="Nadar">{tr('Nadar', 'நாடார்', 'ನಾಡಾರ್', 'नाडार')}</option>
                  <option value="Naidu">{tr('Naidu / Reddy', 'நாயுடு / ரெட்டி', 'ನಾಯ್ಡು / ರೆಡ್ಡಿ', 'नायडू / रेड्डी')}</option>
                </select>

                {/* Star Filter */}
                <select
                  value={nakshatraFilter}
                  onChange={(e) => setNakshatraFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-hidden"
                >
                  <option value="All">{tr('All Nakshatras', 'அனைத்து நட்சத்திரங்கள்', 'ಎಲ್ಲಾ ನಕ್ಷತ್ರಗಳು', 'सभी नक्षत्र')}</option>
                  {NAKSHATRA_OPTIONS.map((n) => (
                    <option key={n} value={n}>{formatNakshatra(n, lang)}</option>
                  ))}
                </select>

                <button
                  onClick={loadInitialData}
                  className="p-2 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
                  title={tr('Refresh', 'புதுப்பிக்க', 'ನವೀಕರಿಸಿ', 'रिफ्रेश')}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">
                {tr(
                  `Showing ${filteredProfiles.length} verified matrimony profiles`,
                  `காண்பிக்கப்படும் வரன்கள்: ${filteredProfiles.length}`,
                  `${filteredProfiles.length} ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗಳು`,
                  `प्रदर्शित सत्यापित प्रोफाइलें: ${filteredProfiles.length}`
                )}
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> {tr('Thirukanitha Panchangam Verified', 'திருக்கணிதப் பஞ்சாங்க சான்றளிக்கப்பட்டது', 'ತಿರುಕಣಿತ ಪಂಚಾಂಗ ಪರಿಶೀಲಿತ', 'थिरुकणिता पंचांग सत्यापित')}
              </span>
            </div>
          </div>

          {/* Profiles Grid */}
          {loadingProfiles ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Sparkles className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-bold">
                {tr('Loading Matrimony Profiles...', 'வரன்கள் பதிவேற்றப்படுகின்றன...', 'ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...', 'प्रोफाइलें लोड हो रही हैं...')}
              </p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {tr('No Matrimony Profiles Match the Filter', 'பொருத்தமான வரன்கள் இல்லை', 'ಯಾವುದೇ ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ', 'कोई प्रोफाइल नहीं मिली')}
              </h3>
              <p className="text-xs text-slate-500">
                {tr('Try broadening your search criteria or register a new candidate.', 'வடிப்பானை மாற்றி அமைக்கவும் அல்லது புதிய வரனை பதிவு செய்யவும்.', 'ಶೋಧಕಗಳನ್ನು ಬದಲಿಸಿ ಅಥವಾ ಹೊಸ ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ.', 'कृपया फिल्टर बदलें या नया पंजीकरण करें।')}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setGenderFilter('All'); setCasteFilter('All'); setNakshatraFilter('All'); }}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {tr('Reset Filters', 'வடிப்பான்களை மீட்டமைக்க', 'ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ', 'फिल्टर रीसेट करें')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map((p) => {
                const isShortlisted = shortlists.some(s => s.profileId === (p.matrimonyId || p.id));
                const isBride = (p.profileType || p.gender || '').toLowerCase().includes('bride') || (p.gender || '').toLowerCase().includes('female');

                return (
                  <div
                    key={p.matrimonyId || p.id}
                    className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Image & Header */}
                    <div>
                      <div className="relative h-56 sm:h-64 bg-slate-100 overflow-hidden">
                        <img
                          src={p.primaryPhotoUrl || p.photoUrl || (isBride ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&fit=crop' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&fit=crop')}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white backdrop-blur-md border ${
                            isBride ? 'bg-pink-600/90 border-pink-400' : 'bg-indigo-600/90 border-indigo-400'
                          }`}>
                            {isBride ? tr('Bride', 'மணமகள்', 'ವಧು', 'वधू') : tr('Groom', 'மணமகன்', 'ವರ', 'वर')}
                          </span>

                          <button
                            onClick={() => handleToggleShortlist(p.matrimonyId || p.id)}
                            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                              isShortlisted
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
                            }`}
                            title={tr('Shortlist profile', 'சேமிக்க', 'ಉಳಿಸಿ', 'पसंदीदा में जोड़ें')}
                          >
                            <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Bottom Overlay Info on Photo */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{tr('ID', 'எண்', 'ಐಡಿ', 'आईडी')}: {p.matrimonyId || p.id}</span>
                            <span>•</span>
                            <span className="text-white/90">{p.completenessScore || 90}% {tr('Complete', 'முழுமை', 'ಪೂರ್ಣ', 'पूर्ण')}</span>
                          </div>
                          <h3 className="text-lg font-black tracking-tight">{p.name}</h3>
                          <p className="text-xs text-slate-200 flex items-center gap-2">
                            <span>{p.age} {tr('Yrs', 'வயது', 'ವರ್ಷ', 'वर्ष')}</span>
                            <span>•</span>
                            <span>{p.height || "5'6\""}</span>
                            <span>•</span>
                            <span>{p.city || p.workLocationCity || 'Chennai'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 space-y-3">
                        {/* Vedic Astrological Chip */}
                        <div className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🕉️</span>
                            <div>
                              <p className="font-bold text-amber-950">
                                {formatNakshatra(p.starNakshatra || p.nakshatra || 'Magha', lang)} ({p.padam || 1} {tr('Padam', 'பாதம்', 'ಪಾದ', 'चरण')})
                              </p>
                              <p className="text-[10px] text-amber-800">
                                {formatRasi(p.rasiMoonSign || p.rasi || 'Simha', lang)} • {formatDosha(p.manglikDosha || p.manglikStatus || 'No Chevvai Dosha', lang)}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                            {tr('Thirukanitha', 'திருக்கணிதம்', 'ತಿರುಕಣಿತ', 'थिरुकणिता')}
                          </span>
                        </div>

                        {/* Education & Occupation */}
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-900 truncate">
                              {p.highestEducation || p.degree || 'Degree'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{p.occupation || 'Professional'} {p.companyName ? `at ${p.companyName}` : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{p.caste || 'Caste'}, {p.subCaste || p.gotra || 'Gotra'}</span>
                          </div>
                        </div>

                        {/* Brief About Me Snippet */}
                        {p.aboutMe && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 italic border-t border-slate-100 pt-2">
                            "{p.aboutMe}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 pt-0 space-y-2">
                      {/* Check Compatibility Button */}
                      <button
                        onClick={() => handleCheckCompatibility(p)}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        {tr('Check Compatibility', 'பொருத்தம் காண்க', 'ಹೊಂದಾಣಿಕೆ ಪರಿಶೀಲಿಸಿ', 'कुंडली मिलान देखें')}
                      </button>

                      {/* Secondary Buttons Row */}
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <button
                          onClick={() => handleSendInterest(p.matrimonyId || p.id)}
                          className="py-2 px-2 border border-pink-200 bg-pink-50/70 hover:bg-pink-100 text-pink-700 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title={tr('Send Interest', 'விருப்பம் அனுப்ப')}
                        >
                          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                          <span>{tr('Interest', 'விருப்பம்', 'ಆಸಕ್ತಿ', 'रुचि')}</span>
                        </button>
                        <button
                          onClick={() => setContactModal({ isOpen: true, profile: p })}
                          className="py-2 px-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title={tr('View Contact', 'தொடர்பு கொள்ள')}
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{tr('Contact', 'தொடர்பு', 'ಸಂಪರ್ಕ', 'संपर्क')}</span>
                        </button>
                        <button
                          onClick={() => setBiodataModalProfile(p)}
                          className="py-2 px-2 border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title={tr('View Traditional Vedic Bio-Data', 'ஜாதக பயோடேட்டா பார்க்க')}
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>{tr('Bio-Data', 'ஜாதகம்', 'ಜಾತಕ', 'बायो-डेटा')}</span>
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

      {/* ========================================================================= */}
      {/* TAB 2: 10-STEP PROFILE REGISTRATION WIZARD */}
      {/* ========================================================================= */}
      {activeTab === 'register' && (
        <div className="space-y-5">
          {/* Registration Header & Person Selector Bar */}
          <div className="bg-white border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                    {tr('COMPLETE 10-STEP PROFILE WIZARD', '10 நிலை வரன் பதிவு', '10 ಹಂತಗಳ ನೋಂದಣಿ ವಿಧಾನ', '10 चरणीय पूर्ण पंजीकरण')}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    {computeCurrentCompleteness()}% {tr('Complete', 'முழுமை', 'ಪೂರ್ಣ', 'पूर्ण')}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {tr('Register Complete Matrimony Profile', 'வைதீக வரன் முழு விவர பதிவு', 'ಸಂಪೂರ್ಣ ವೈದಿಕ ವಿವಾಹ ನೋಂದಣಿ', 'संपूर्ण वैदिक विवाह प्रोफाइल पंजीकरण')}
                </h2>
                <p className="text-xs text-slate-500">
                  {tr(
                    'Select a saved Astrojit client or family member to autofill details & compute Thirukanitha horoscope instantly.',
                    'அஸ்ட்ரோஜித் கணக்கிலிருந்து சுயவிவரம் அல்லது குடும்ப உறுப்பினரைத் தேர்ந்தெடுத்து தானியங்கு முறையில் நிரப்பலாம்.',
                    'ಉಳಿಸಿದ ಆಸ್ಟ್ರೋಜಿತ್ ಕ್ಲೈಂಟ್ ಅಥವಾ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಜಾತಕವನ್ನು ತಕ್ಷಣ ಭರ್ತಿ ಮಾಡಿ.',
                    'सहेजे गए सदस्य का चयन करें और थिरुकणिता कुंडली सहित विवरण स्वतः भरें।'
                  )}
                </p>
              </div>

              {/* Person Selector Dropdown & Autofill Action */}
              <div className="flex items-center gap-2 bg-rose-50/70 p-2 rounded-2xl border border-rose-200">
                <div className="flex flex-col text-xs">
                  <span className="text-[10px] font-bold text-rose-900 uppercase">
                    {tr('REGISTER PROFILE FOR:', 'வரன் பதிவு யாருக்கு:', 'ಪ್ರೊಫೈಲ್ ನೋಂದಣಿ ಯಾರಿಗೆ:', 'प्रोफाइल पंजीकरण किसके लिए:')}
                  </span>
                  <select
                    value={selectedPersonId}
                    onChange={(e) => handleAutofillPerson(e.target.value)}
                    className="bg-white border border-rose-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="client-self">
                      {user?.name || tr('Primary Account', 'முதன்மை கணக்கு')} ({tr('Self', 'சுய விவரம்', 'ಸ್ವತಃ', 'स्वयं')})
                    </option>
                    {(autofillSources?.clientsList || []).filter(cl => cl.id !== user?.id && cl.mobile !== user?.mobile).length > 0 && (
                      <optgroup label={tr('Registered Astrojit Clients', 'பதிவுசெய்த பயனர்கள்', 'ನೋಂದಾಯಿತ ಕ್ಲೈಂಟ್‌ಗಳು', 'पंजीकृत सदस्य')}>
                        {(autofillSources.clientsList || [])
                          .filter(cl => cl.id !== user?.id && cl.mobile !== user?.mobile)
                          .map((cl) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.name} ({cl.gender === 'Bride' ? tr('Bride', 'மணமகள்') : tr('Groom', 'மணமகன்')} • {cl.mobile})
                            </option>
                          ))}
                      </optgroup>
                    )}
                    {(autofillSources?.familyMembers || []).length > 0 && (
                      <optgroup label={tr('Family Members', 'குடும்ப உறுப்பினர்கள்', 'ಕುಟುಂಬ ಸದಸ್ಯರು', 'पारिवारिक सदस्य')}>
                        {(autofillSources?.familyMembers || []).map((fm) => {
                          const isFmBride = fm.gender === 'Bride' || fm.gender === 'female' || (fm.relation || '').toLowerCase().includes('sister') || (fm.relation || '').toLowerCase().includes('daughter');
                          return (
                            <option key={fm.id} value={fm.id}>
                              {fm.name} ({tr(fm.relation, fm.relation === 'Sister' ? 'சகோதரி' : fm.relation === 'Brother' ? 'சகோதரன்' : fm.relation === 'Son' ? 'மகன்' : fm.relation === 'Daughter' ? 'மகள்' : 'உறவினர்')} - {isFmBride ? tr('Bride', 'மணமகள்', 'ವಧು', 'वधू') : tr('Groom', 'மணமகன்', 'ವರ', 'वर')})
                            </option>
                          );
                        })}
                      </optgroup>
                    )}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleAutofillPerson(selectedPersonId)}
                  className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-sm hover:brightness-105 transition-all cursor-pointer shrink-0"
                  title={tr('Autofill details and calculate horoscope', 'தானியங்கு நிரப்புதல் மற்றும் ஜாதகம் கணக்கிடுதல்', 'ಸ್ವಯಂ ಭರ್ತಿ', 'स्वतः भरें')}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {tr('1-Click Autofill', 'தானியங்கு நிரப்புதல்', 'ಸ್ವಯಂಚಾಲಿತ ಭರ್ತಿ', '1-क्लिक स्वतः भरें')}
                </button>
              </div>
            </div>

            {/* Stepper Wizard Progress Indicators */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-1.5 min-w-[700px]">
                {[
                  { step: 1, title: tr('Creator & Account', 'கணக்கு விவரங்கள்', 'ಖಾತೆ ವಿವರ', 'खाता विवरण') },
                  { step: 2, title: tr('Basic Info', 'அடிப்படைத் தகவல்', 'ಮೂಲ ಮಾಹಿತಿ', 'मूल जानकारी') },
                  { step: 3, title: tr('Lifestyle & Caste', 'வாழ்க்கை & சாதி', 'ಜೀವನಶೈಲಿ & ಜಾತಿ', 'जीवनशैली व जाति') },
                  { step: 4, title: tr('Horoscope', 'ஜாதக விவரம்', 'ಜಾತಕ', 'कुंडली') },
                  { step: 5, title: tr('Education & Career', 'கல்வி & தொழில்', 'ಶಿಕ್ಷಣ & ಉದ್ಯೋಗ', 'शिक्षा एवं करियर') },
                  { step: 6, title: tr('Family Details', 'குடும்ப விவரம்', 'ಕುಟುಂಬ ವಿವರ', 'पारिवारिक विवरण') },
                  { step: 7, title: tr('Location & Photo', 'இருப்பிடம் & படம்', 'ಸ್ಥಳ & ಫೋಟೋ', 'स्थान एवं फोटो') },
                  { step: 8, title: tr('Partner Preferences', 'எதிர்பார்ப்புகள்', 'ನಿರೀಕ್ಷೆಗಳು', 'साथी की प्राथमिकता') },
                  { step: 9, title: tr('Contact & Privacy', 'தொடர்பு & பாதுகாப்பு', 'ಸಂಪರ್ಕ & ಗೌಪ್ಯತೆ', 'संपर्क एवं गोपनीयता') },
                  { step: 10, title: tr('Preview & Publish', 'முன்னோட்டம் & பதிவு', 'ಪೂರ್ವವೀಕ್ಷಣೆ & ಪ್ರಕಟಣೆ', 'पूर्वावलोकन एवं प्रकाशन') },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setWizardStep(s.step)}
                    className={`flex-1 py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      wizardStep === s.step
                        ? 'bg-rose-600 text-white shadow-md'
                        : wizardStep > s.step
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {wizardStep > s.step ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <span className="text-[10px]">{s.step}.</span>
                      )}
                      <span className="truncate">{s.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Step Body */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
            {registeredProfileResult ? (
              /* Success Celebration State */
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {tr('Matrimony Profile Successfully Activated!', 'வரன் பதிவு வெற்றிகரமாக முடிந்தது!', 'ವಿವಾಹ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಸಕ್ರಿಯಗೊಂಡಿದೆ!', 'विवाह प्रोफाइल सफलतापूर्वक सक्रिय हो गई!')}
                </h3>
                <p className="text-xs text-slate-600">
                  {tr('Assigned Matrimony ID:', 'ஒதுக்கப்பட்ட வரன் எண்:', 'ನಿಗದಿಪಡಿಸಿದ ಮ್ಯಾಟ್ರಿಮೋನಿ ಐಡಿ:', 'आवंटित विवाह आईडी:')}{' '}
                  <strong className="text-rose-600">{registeredProfileResult.matrimonyId}</strong>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => { setRegisteredProfileResult(null); setActiveTab('browse'); }}
                    className="px-5 py-2.5 bg-rose-600 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                  >
                    {tr('Browse Matches', 'வரன் பட்டியலைக் காண்க', 'ಹೊಂದಾಣಿಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ', 'सुयोग्य मिलान देखें')}
                  </button>
                  <button
                    onClick={() => { setRegisteredProfileResult(null); setWizardStep(1); }}
                    className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {tr('Register Another Profile', 'மற்றொரு வரன் பதிவு', 'ಇನ್ನೊಂದು ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ', 'अन्य प्रोफाइल पंजीकृत करें')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterProfileSubmit} className="space-y-6">
                {/* STEP 1: Account Registration & Creator */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-rose-600" />
                        {tr('Step 1: Profile Creator & Account Credentials', 'நிலை 1: கணக்கு மற்றும் பதிவு விவரங்கள்', 'ಹಂತ 1: ಪ್ರೊಫೈಲ್ ಮತ್ತು ಖಾತೆಯ ವಿವರಗಳು', 'चरण 1: प्रोफाइल एवं खाता विवरण')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr('Specify who is creating this profile and basic account verification details.', 'பதிவு செய்பவர் யார் மற்றும் அடிப்படை சரிபார்ப்பு விவரங்களைக் குறிப்பிடவும்.', 'ಪ್ರೊಫೈಲ್ ರಚಿಸುವವರು ಯಾರು ಎಂಬುದನ್ನು ತಿಳಿಸಿ.', 'बताएं कि यह प्रोफाइल कौन बना रहा है एवं सत्यापन विवरण दें।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Profile Created By*', 'பதிவு செய்பவர்*', 'ಪ್ರೊಫೈಲ್ ರಚಿಸಿದವರು*', 'प्रोफाइल निर्माता*')}
                        </label>
                        <select
                          value={formData.profileCreatedBy}
                          onChange={(e) => setFormData({ ...formData, profileCreatedBy: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Self">{tr('Self', 'சுய விவரம்', 'ಸ್ವತಃ', 'स्वयं')}</option>
                          <option value="Father">{tr('Father', 'தந்தை', 'ತಂದೆ', 'पिता')}</option>
                          <option value="Mother">{tr('Mother', 'தாய்', 'ತಾಯಿ', 'माता')}</option>
                          <option value="Brother">{tr('Brother', 'சகோதரன்', 'ಸಹೋದರ', 'भाई')}</option>
                          <option value="Sister">{tr('Sister', 'சகோதரி', 'ಸಹೋದರಿ', 'बहन')}</option>
                          <option value="Relative">{tr('Relative', 'உறவினர்', 'ಸಂಬಂಧಿ', 'रिश्तेदार')}</option>
                          <option value="Friend">{tr('Friend', 'நண்பர்', 'ಸ್ನೇಹಿತ', 'मित्र')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Profile Type*', 'வரன் வகை*', 'ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರ*', 'प्रोफाइल प्रकार*')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, profileType: 'Groom', gender: 'Male' })}
                            className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                              formData.profileType === 'Groom'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            🤵 {tr('Groom', 'மணமகன்', 'ವರ', 'वर')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, profileType: 'Bride', gender: 'Female' })}
                            className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                              formData.profileType === 'Bride'
                                ? 'bg-pink-600 text-white border-pink-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            👰 {tr('Bride', 'மணமகள்', 'ವಧು', 'वधू')}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Login / Contact Mobile*', 'அலைபேசி எண்*', 'ಸಂಪರ್ಕ ಮೊಬೈಲ್*', 'मोबाइल नंबर*')}
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value, loginMobile: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Email Address*', 'மின்னஞ்சல் முகவரி*', 'ಇಮೇಲ್ ವಿಳಾಸ*', 'ईमेल पता*')}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('WhatsApp Number', 'வாட்ஸ்அப் எண்', 'ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ', 'व्हाट्सएप नंबर')}
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Profile Visibility', 'பார்வை நிலை', 'ಗೋಚರತೆ', 'प्रोफाइल दृश्यता')}
                        </label>
                        <select
                          value={formData.profileVisibility}
                          onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Public">{tr('Public', 'பொதுவானது', 'ಸಾರ್ವಜನಿಕ', 'सार्वजनिक')}</option>
                          <option value="Members Only">{tr('Verified Members Only', 'உறுப்பினர்கள் மட்டும்', 'ಪರಿಶೀಲಿತ ಸದಸ್ಯರಿಗೆ ಮಾತ್ರ', 'केवल सत्यापित सदस्यों के लिए')}</option>
                          <option value="Private">{tr('Request Only', 'அனுமதி பெற்று மட்டும்', 'ವಿನಂತಿಯ ಮೇರೆಗೆ ಮಾತ್ರ', 'केवल अनुरोध पर')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Basic Profile Information */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-rose-600" />
                        {tr('Step 2: Basic Profile Information', 'நிலை 2: அடிப்படைத் தகவல்கள்', 'ಹಂತ 2: ಮೂಲ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ', 'चरण 2: मूल व्यक्तिगत विवरण')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr("Candidate's name, date of birth, age, height, weight, and bio.", 'பெயர், பிறந்த தேதி, வயது, உயரம், எடை மற்றும் சுயகுறிப்பு.', 'ಹೆಸರು, ಹುಟ್ಟಿದ ದಿನಾಂಕ, ವಯಸ್ಸು, ಎತ್ತರ, ತೂಕ ಮತ್ತು ಸಂಕ್ಷಿಪ್ತ ಪರಿಚಯ.', 'नाम, जन्म तिथि, आयु, ऊंचाई, वजन एवं बायो।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Candidate Full Name*', 'முழுப் பெயர்*', 'ಪೂರ್ಣ ಹೆಸರು*', 'पूरा नाम*')}
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Date of Birth*', 'பிறந்த தேதி*', 'ಹುಟ್ಟಿದ ದಿನಾಂಕ*', 'जन्म तिथि*')}
                        </label>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => {
                            setFormData({ ...formData, dob: e.target.value });
                            handleAutoComputeHoroscope(e.target.value, formData.birthTime, formData.birthPlace);
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Age (Auto-Calculated)', 'வயது (கணக்கிடப்பட்டது)', 'ವಯಸ್ಸು (ಸ್ವಯಂ ಲೆಕ್ಕ)', 'आयु (स्वतः गणना)')}
                        </label>
                        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-rose-600 flex items-center justify-between">
                          <span>{formData.age} {tr('Years', 'வயது', 'ವರ್ಷಗಳು', 'वर्ष')}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{tr('Calculated from DOB', 'பிறந்த தேதியிலிருந்து', 'ಹುಟ್ಟಿದ ದಿನಾಂಕದಿಂದ', 'जन्म तिथि से गणना')}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Height*', 'உயரம்*', 'ಎತ್ತರ*', 'कद (ऊंचाई)*')}
                        </label>
                        <select
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          {HEIGHT_OPTIONS.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Weight (Optional)', 'எடை (விருப்பத்தேர்வு)', 'ತೂಕ (ಐಚ್ಛಿಕ)', 'वजन (वैकल्पिक)')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 68 kg"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Marital Status*', 'திருமண நிலை*', 'ವೈವಾಹಿಕ ಸ್ಥಿತಿ*', 'वैवाहिक स्थिति*')}
                        </label>
                        <select
                          value={formData.maritalStatus}
                          onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Never Married">{tr('Never Married', 'முதல் மணம்', 'ಅವಿವಾಹಿತ', 'अविवाहित')}</option>
                          <option value="Divorced">{tr('Divorced', 'விவாகரத்து', 'ವಿಚ್ಛೇದಿತ', 'तलाकशुदा')}</option>
                          <option value="Widowed">{tr('Widowed', 'துணையை இழந்தவர்', 'ವಿಧವೆ/ವಿಧುರ', 'विधवा/विधुर')}</option>
                          <option value="Awaiting Divorce">{tr('Awaiting Divorce', 'விவாகரத்து நிலுவையில்', 'ವಿಚ್ಛೇದನ ನಿರೀಕ್ಷೆಯಲ್ಲಿ', 'तलाक प्रक्रियाधीन')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Mother Tongue*', 'தாய்மொழி*', 'ಮಾತೃಭಾಷೆ*', 'मातृभाषा*')}
                        </label>
                        <input
                          type="text"
                          value={formData.motherTongue}
                          onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Blood Group', 'இரத்த வகை', 'ರಕ್ತದ ಗುಂಪು', 'रक्त समूह')}
                        </label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="">{tr('Select Blood Group', 'இரத்த வகையைத் தேர்ந்தெடுக்கவும்', 'ರಕ್ತದ ಗುಂಪನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'रक्त समूह चुनें')}</option>
                          <option value="A+ Positive">A+ Positive</option>
                          <option value="A- Negative">A- Negative</option>
                          <option value="B+ Positive">B+ Positive</option>
                          <option value="B- Negative">B- Negative</option>
                          <option value="O+ Positive">O+ Positive</option>
                          <option value="O- Negative">O- Negative</option>
                          <option value="AB+ Positive">AB+ Positive</option>
                          <option value="AB- Negative">AB- Negative</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Physical Status', 'உடல் நிலை', 'ದೈಹಿಕ ಸ್ಥಿತಿ', 'शारीरिक स्थिति')}
                        </label>
                        <select
                          value={formData.physicalStatus}
                          onChange={(e) => setFormData({ ...formData, physicalStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Normal">{tr('Normal', 'இயல்பு நிலை', 'ಸಾಮಾನ್ಯ', 'सामान्य')}</option>
                          <option value="Differently Abled">{tr('Differently Abled', 'மாற்றுத் திறனாளி', 'ವಿಶೇಷ ಚೇತನ', 'दिव्यांग')}</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('About Me / Description', 'சுயவிவரக் குறிப்பு', 'ನನ್ನ ಬಗ್ಗೆ', 'मेरे बारे में')}
                        </label>
                        <textarea
                          rows={3}
                          value={formData.aboutMe}
                          onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                          placeholder={tr('Brief description about values, personality, and aspirations...', 'சுயவிவரம், வாழ்க்கை விழுமியங்கள் பற்றிய சிறு குறிப்பு...', 'ನಿಮ್ಮ ವ್ಯಕ್ತಿತ್ವ ಮತ್ತು ಮೌಲ್ಯಗಳ ಬಗ್ಗೆ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ...', 'अपने व्यक्तित्व एवं जीवन मूल्यों के बारे में संक्षेप में लिखें...')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Personal & Lifestyle Details */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        {tr('Step 3: Personal, Community & Lifestyle Details', 'நிலை 3: வாழ்க்கை முறை & சமூகம்', 'ಹಂತ 3: ವೈಯಕ್ತಿಕ ಮತ್ತು ಜೀವನಶೈಲಿ', 'चरण 3: व्यक्तिगत एवं जीवनशैली विवरण')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr('Religion, caste, gotra, food habits, lifestyle choices, and hobbies.', 'மதம், சாதி, கோத்திரம், உணவுப் பழக்கம், வாழ்க்கை முறை மற்றும் பொழுதுபோக்குகள்.', 'ಧರ್ಮ, ಜಾತಿ, ಗೋತ್ರ, ಆಹಾರ ಪದ್ಧತಿ ಹಾಗೂ ಹವ್ಯಾಸಗಳು.', 'धर्म, जाति, गोत्र, खान-पान एवं जीवनशैली।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Religion*', 'மதம்*', 'ಧರ್ಮ*', 'धर्म*')}
                        </label>
                        <input
                          type="text"
                          value={formData.religion}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Caste*', 'சாதி*', 'ಜಾತಿ*', 'जाति*')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Brahmin - Iyer, Mudaliar, Chettiar"
                          value={formData.caste}
                          onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Sub-Caste', 'உட்பிரிவு', 'ಉಪಜಾತಿ', 'उपजाति')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vadama, Brahacharanam"
                          value={formData.subCaste}
                          onChange={(e) => setFormData({ ...formData, subCaste: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Gotra', 'கோத்திரம்', 'ಗೋತ್ರ', 'गोत्र')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Kaundinya, Harita, Bharadwaja"
                          value={formData.gotra}
                          onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Eating Habits', 'உணவுப் பழக்கம்', 'ಆಹಾರ ಪದ್ಧತಿ', 'खान-पान')}
                        </label>
                        <select
                          value={formData.eatingHabits}
                          onChange={(e) => setFormData({ ...formData, eatingHabits: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Vegetarian">{tr('Vegetarian', 'சைவம்', 'ಸಸ್ಯಾಹಾರಿ', 'शाकाहारी')}</option>
                          <option value="Eggetarian">{tr('Eggetarian', 'முட்டை மட்டும்', 'ಮೊಟ್ಟೆ ಸೇವನೆ', 'अंडाहारी')}</option>
                          <option value="Non-Vegetarian">{tr('Non-Vegetarian', 'அசைவம்', 'ಮಾಂಸಾಹಾರಿ', 'मांसाहारी')}</option>
                          <option value="Vegan">{tr('Vegan', 'வீகன்', 'ಸಂಪೂರ್ಣ ಸಸ್ಯಾಹಾರಿ', 'वीगन')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Drinking & Smoking Habits', 'மது & புகை பழக்கம்', 'ಮದ್ಯಪಾನ ಮತ್ತು ಧೂಮಪಾನ ಅಭ್ಯಾಸ', 'धूम्रपान एवं मद्यपान')}
                        </label>
                        <select
                          value={formData.drinkingHabits}
                          onChange={(e) => setFormData({ ...formData, drinkingHabits: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="No">{tr('No', 'இல்லை', 'ಇಲ್ಲ', 'नहीं')}</option>
                          <option value="Occasionally">{tr('Occasionally', 'எப்போதாவது', 'ಅಪರೂಪಕ್ಕೆ', 'कभी-कभी')}</option>
                          <option value="Yes">{tr('Yes', 'உண்டு', 'ಹೌದು', 'हाँ')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Languages Known', 'தெரிந்த மொழிகள்', 'ತಿಳಿದಿರುವ ಭಾಷೆಗಳು', 'ज्ञात भाषाएं')}
                        </label>
                        <input
                          type="text"
                          value={formData.languagesKnown}
                          onChange={(e) => setFormData({ ...formData, languagesKnown: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Hobbies & Interests', 'விருப்பங்கள் & பொழுதுபோக்கு', 'ಹವ್ಯಾಸಗಳು', 'शौक एवं रुचियां')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Carnatic music, reading, yoga, traveling"
                          value={formData.hobbies}
                          onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Religious & Horoscope Details */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500" />
                          {tr('Step 4: Religious & Horoscope Details', 'நிலை 4: ஜாதக விவரங்கள்', 'ಹಂತ 4: ಜಾತಕ ವಿವರಗಳು', 'चरण 4: धार्मिक एवं कुंडली विवरण')}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {tr('Thirukanitha Vedic astrological details used for 36 Gunas & 10 Poruthams matching.', 'திருக்கணித பஞ்சாங்க முறைப்படி 10 பொருத்தங்கள் மற்றும் 36 குணங்கள் ஆய்வுக்கான விவரங்கள்.', 'ತಿರುಕಣಿತ ಪದ್ಧತಿಯಂತೆ 10 ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು 36 ಗುಣಗಳ ಲೆಕ್ಕಾಚಾರ.', 'थिरुकणिता पंचांग अनुसार 10 पोरुथम एवं 36 गुण मिलान विवरण।')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAutoComputeHoroscope()}
                        className="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        title={tr('Recalculate Thirukanitha horoscope from DOB & Birth Time', 'பிறந்த நேரம் & தேதியிலிருந்து திருக்கணித ஜாதகத்தை கணக்கிடு', 'ಜನನ ವಿವರಗಳಿಂದ ತಿರುಕಣಿತ ಲೆಕ್ಕಾಚಾರ', 'जन्म विवरण से थिरुकणिता गणना')}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{tr('Auto-Calculate from Profile', 'சுயவிவரத்திலிருந்து கணக்கிடு', 'ಪ್ರೊಫೈಲ್‌ನಿಂದ ಲೆಕ್ಕಾಚಾರ', 'प्रोफाइल से गणना करें')}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Star / Nakshatra*', 'நட்சத்திரம்*', 'ನಕ್ಷತ್ರ*', 'नक्षत्र*')}
                        </label>
                        <select
                          value={formData.starNakshatra}
                          onChange={(e) => setFormData({ ...formData, starNakshatra: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-bold text-rose-700 focus:ring-2 focus:ring-rose-400"
                          required
                        >
                          <option value="">{tr('Select Nakshatra', 'நட்சத்திரத்தைத் தேர்ந்தெடுக்கவும்', 'ನಕ್ಷತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'नक्षत्र चुनें')}</option>
                          {NAKSHATRA_OPTIONS.map((n) => (
                            <option key={n} value={n}>{formatNakshatra(n, lang)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Rasi / Moon Sign*', 'ராசி*', 'ರಾಶಿ*', 'राशि*')}
                        </label>
                        <select
                          value={formData.rasiMoonSign}
                          onChange={(e) => setFormData({ ...formData, rasiMoonSign: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-bold text-rose-700 focus:ring-2 focus:ring-rose-400"
                          required
                        >
                          <option value="">{tr('Select Rasi', 'ராசியைத் தேர்ந்தெடுக்கவும்', 'ರಾಶಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'राशि चुनें')}</option>
                          {RASI_OPTIONS.map((r) => (
                            <option key={r} value={r}>{formatRasi(r, lang)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Lagnam / Ascendant', 'லக்னம்', 'ಲಗ್ನ', 'लग्न')}
                        </label>
                        <select
                          value={formData.lagnamAscendant}
                          onChange={(e) => setFormData({ ...formData, lagnamAscendant: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="">{tr('Select Lagna', 'லக்னத்தைத் தேர்ந்தெடுக்கவும்', 'ಲಗ್ನವನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'लग्न चुनें')}</option>
                          {RASI_OPTIONS.map((r) => (
                            <option key={r} value={r}>{formatRasi(r, lang)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Padam*', 'பாதம்*', 'ಪಾದ*', 'चरण*')}
                        </label>
                        <select
                          value={formData.padam}
                          onChange={(e) => setFormData({ ...formData, padam: parseInt(e.target.value) || '' })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-bold focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="">{tr('Select Pada', 'பாதத்தைத் தேர்ந்தெடுக்கவும்', 'ಪಾದ ಆಯ್ಕೆಮಾಡಿ', 'चरण चुनें')}</option>
                          <option value={1}>{tr('Pada 1', '1 ஆம் பாதம்', 'ಪಾದ 1', 'चरण 1')}</option>
                          <option value={2}>{tr('Pada 2', '2 ஆம் பாதம்', 'ಪಾದ 2', 'चरण 2')}</option>
                          <option value={3}>{tr('Pada 3', '3 ஆம் பாதம்', 'ಪಾದ 3', 'चरण 3')}</option>
                          <option value={4}>{tr('Pada 4', '4 ஆம் பாதம்', 'ಪಾದ 4', 'चरण 4')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Chevvai / Manglik Dosham', 'செவ்வாய் தோஷம்', 'ಕುಜ / ಮಾಂಗಲ್ಯ ದೋಷ', 'मांगलिक / मंगल दोष')}
                        </label>
                        <select
                          value={formData.manglikDosha}
                          onChange={(e) => setFormData({ ...formData, manglikDosha: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="No Chevvai Dosha">{tr('No Dosha', 'தோஷம் இல்லை', 'ದೋಷವಿಲ್ಲ', 'ದೋಷ ಮುಕ್ತ')}</option>
                          <option value="Chevvai Dosham Present">{tr('Dosha Present', 'தோஷம் உண்டு', 'ದೋಷವಿದೆ', 'दोष युक्त')}</option>
                          <option value="Dosham Cancelled">{tr('Dosha Cancelled', 'தோஷ நிவர்த்தி', 'ದೋಷ ನಿವಾರಣೆ', 'दोष निवारण')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Birth Time', 'பிறந்த நேரம்', 'ಜನನ ಸಮಯ', 'जन्म समय')}
                        </label>
                        <input
                          type="time"
                          value={formData.birthTime}
                          onChange={(e) => {
                            setFormData({ ...formData, birthTime: e.target.value });
                            handleAutoComputeHoroscope(formData.dob, e.target.value, formData.birthPlace);
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Birth Place', 'பிறந்த இடம்', 'ಜನನ ಸ್ಥಳ', 'जन्म स्थान')}
                        </label>
                        <input
                          type="text"
                          value={formData.birthPlace}
                          onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Horoscope Matching Preference', 'பொருத்த விருப்பம்', 'ಜಾತಕ ಹೊಂದಾಣಿಕೆ ಆದ್ಯತೆ', 'कुंडली मिलान प्राथमिकता')}
                        </label>
                        <select
                          value={formData.horoscopeMatchingPreference}
                          onChange={(e) => setFormData({ ...formData, horoscopeMatchingPreference: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Must Match">{tr('Must Match', 'பொருத்தம் அவசியம்', 'ಹೊಂದಾಣಿಕೆ ಅಗತ್ಯ', 'मिलान आवश्यक')}</option>
                          <option value="Not Mandatory">{tr('Not Mandatory', 'கட்டாயமில்லை', 'ಕಡ್ಡಾಯವಲ್ಲ', 'अनिवार्य नहीं')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Education & Career Details */}
                {wizardStep === 5 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        {tr('Step 5: Education & Career Details', 'நிலை 5: கல்வி & தொழில் விவரங்கள்', 'ಹಂತ 5: ಶಿಕ್ಷಣ ಮತ್ತು ಉದ್ಯೋಗ', 'चरण 5: शिक्षा एवं आजीविका विवरण')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr('Qualifications, employment status, designation, company, and annual income.', 'கல்வித் தகுதி, பணி நிலை, பதவி, நிறுவனம் மற்றும் ஆண்டு வருமானம்.', 'ವಿದ್ಯಾರ್ಹತೆ, ಉದ್ಯೋಗ, ಹುದ್ದೆ ಹಾಗೂ ವಾರ್ಷಿಕ ಆದಾಯ.', 'शिक्षा, पद, कंपनी एवं वार्षिक आय।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Highest Qualification*', 'உயர் கல்வி*', 'ಗರಿಷ್ಠ ವಿದ್ಯಾರ್ಹತೆ*', 'उच्चतम शिक्षा*')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech, M.S, MBA, MBBS, CA"
                          value={formData.highestEducation}
                          onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Degree & Major', 'பட்டம் & துறை', 'ಪದವಿ & ವಿಭಾಗ', 'डिग्री एवं विषय')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science, Finance"
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('College / University', 'கல்லூரி / பல்கலைக்கழகம்', 'ಕಾಲೇಜು / ವಿಶ್ವವಿದ್ಯಾಲಯ', 'कॉलेज / विश्वविद्यालय')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IIT Madras, Anna University"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Employment Status*', 'பணி நிலை*', 'ಉದ್ಯೋಗ ಸ್ಥಿತಿ*', 'रोजगार स्थिति*')}
                        </label>
                        <select
                          value={formData.employmentStatus}
                          onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Employed in Private Sector">{tr('Private Sector', 'தனியார் துறை', 'ಖಾಸಗಿ ವಲಯ', 'निजी क्षेत्र')}</option>
                          <option value="Employed in Govt / PSU">{tr('Government / PSU', 'அரசுப் பணி', 'ಸರ್ಕಾರಿ ವಲಯ', 'सरकारी क्षेत्र')}</option>
                          <option value="Business / Entrepreneur">{tr('Business / Entrepreneur', 'சொந்த தொழில்', 'ವ್ಯಾಪಾರ / ಉದ್ಯಮಿ', 'व्यवसाय / उद्यमी')}</option>
                          <option value="Self Employed Professional">{tr('Self-Employed Professional', 'தொழில்முறை நிபுணர்', 'ಸ್ವಯಂ ಉದ್ಯೋಗಿ', 'स्व-नियोजित पेशेवर')}</option>
                          <option value="Not Working">{tr('Not Working', 'வேலையில் இல்லை', 'ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ', 'कार्यरत नहीं')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Occupation / Job Title*', 'தொழில் / பதவி*', 'ಹುದ್ದೆ / ಉದ್ಯೋಗ*', 'पद / व्यवसाय*')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Software Engineer"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value, jobTitle: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Company / Organization Name', 'நிறுவனத்தின் பெயர்', 'ಸಂಸ್ಥೆಯ ಹೆಸರು', 'कंपनी का नाम')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Microsoft, TCS, Infosys"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Annual Income*', 'ஆண்டு வருமானம்*', 'ವಾರ್ಷಿಕ ಆದಾಯ*', 'वार्षिक आय*')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹ 25,00,000 / annum (25 LPA)"
                          value={formData.annualIncome}
                          onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-emerald-700 focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Work Location', 'பணிபுரியும் இடம்', 'ಕೆಲಸದ ಸ್ಥಳ', 'कार्य स्थल')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Chennai, Bangalore, USA"
                          value={formData.workLocationCity}
                          onChange={(e) => setFormData({ ...formData, workLocationCity: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Work Experience', 'அனுபவம்', 'ಕಾರ್ಯಾನುಭವ', 'कार्य अनुभव')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 6+ Years"
                          value={formData.workExperience}
                          onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Family Details */}
                {wizardStep === 6 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        {tr('Step 6: Family Background Details', 'நிலை 6: குடும்ப விவரங்கள்', 'ಹಂತ 6: ಕುಟುಂಬದ ವಿವರಗಳು', 'चरण 6: पारिवारिक विवरण')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr("Parents' details, siblings, family values, and native place.", 'பெற்றோர் விவரங்கள், உடன் பிறந்தவர்கள், குடும்பப் பண்பாடு மற்றும் சொந்த ஊர்.', 'ಪೋಷಕರ ವಿವರ, ಸಹೋದರ-ಸಹೋದರಿಯರು, ಕುಟುಂಬದ ಮೌಲ್ಯಗಳು.', 'माता-पिता, भाई-बहन, पारिवारिक मूल्य एवं मूल निवास।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr("Father's Name*", 'தந்தை பெயர்*', 'ತಂದೆಯ ಹೆಸರು*', 'पिता का नाम*')}
                        </label>
                        <input
                          type="text"
                          value={formData.fatherName}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr("Father's Occupation", 'தந்தை பணி', 'ತಂದೆಯ ಉದ್ಯೋಗ', 'पिता का व्यवसाय')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Retired Govt Officer, Business"
                          value={formData.fatherOccupation}
                          onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr("Mother's Name*", 'தாய் பெயர்*', 'ತಾಯಿಯ ಹೆಸರು*', 'माता का नाम*')}
                        </label>
                        <input
                          type="text"
                          value={formData.motherName}
                          onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr("Mother's Occupation", 'தாய் பணி', 'ತಾಯಿಯ ಉದ್ಯೋಗ', 'माता का व्यवसाय')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Homemaker, Teacher, Bank Officer"
                          value={formData.motherOccupation}
                          onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Brothers Count', 'சகோதரர்கள் எண்ணிக்கை', 'ಸಹೋದರರ ಸಂಖ್ಯೆ', 'भाइयों की संख्या')}
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={formData.brothersCount}
                          onChange={(e) => setFormData({ ...formData, brothersCount: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Sisters Count', 'சகோதரிகள் எண்ணிக்கை', 'ಸಹೋದರಿಯರ ಸಂಖ್ಯೆ', 'बहनों की संख्या')}
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={formData.sistersCount}
                          onChange={(e) => setFormData({ ...formData, sistersCount: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Family Type', 'குடும்ப வகை', 'ಕುಟುಂಬದ ವಿಧ', 'परिवार का प्रकार')}
                        </label>
                        <select
                          value={formData.familyType}
                          onChange={(e) => setFormData({ ...formData, familyType: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Nuclear">{tr('Nuclear Family', 'தனிக்குடும்பம்', 'ವಿಭಕ್ತ ಕುಟುಂಬ', 'एकल परिवार')}</option>
                          <option value="Joint">{tr('Joint Family', 'கூட்டுக் குடும்பம்', 'ಅವಿಭಕ್ತ ಕುಟುಂಬ', 'संयुक्त परिवार')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Family Values', 'குடும்ப பண்பாடு', 'ಕುಟುಂಬದ ಮೌಲ್ಯಗಳು', 'पारिवारिक मूल्य')}
                        </label>
                        <select
                          value={formData.familyValues}
                          onChange={(e) => setFormData({ ...formData, familyValues: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Traditional">{tr('Traditional', 'பாரம்பரியம்', 'ಸಾಂಪ್ರದಾಯಿಕ', 'पारंपरिक')}</option>
                          <option value="Moderate">{tr('Moderate', 'நடுத்தர பண்பு', 'ಮಧ್ಯಮ', 'मध्यम')}</option>
                          <option value="Liberal">{tr('Liberal', 'முற்போக்கு', 'ಮುಕ್ತ', 'उदार')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Native Place*', 'சொந்த ஊர்*', 'ಮೂಲ ಸ್ಥಳ*', 'मूल स्थान*')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Thanjavur, Madurai, Tirunelveli"
                          value={formData.nativePlace}
                          onChange={(e) => setFormData({ ...formData, nativePlace: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: Location & Physical Appearance */}
                {wizardStep === 7 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-rose-600" />
                        {tr('Step 7: Location, Physical Appearance & Photos', 'நிலை 7: இருப்பிடம் & புகைப்படம்', 'ಹಂತ 7: ಸ್ಥಳ ಮತ್ತು ಛಾಯಾಚಿತ್ರ', 'चरण 7: स्थान एवं फोटो विवरण')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr('Current residence, physical attributes, and profile photograph.', 'வசிக்கும் ஊர், உடல் அமைப்பு மற்றும் புகைப்பட விவரங்கள்.', 'ಪ್ರಸ್ತುತ ನಿವಾಸ, ದೈಹಿಕ ಲಕ್ಷಣಗಳು ಹಾಗೂ ಛಾಯಾಚಿತ್ರ.', 'वर्तमान निवास, शारीरिक विवरण एवं फोटो।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Current City*', 'வசிக்கும் நகரம்*', 'ಪ್ರಸ್ತುತ ನಗರ*', 'वर्तमान शहर*')}
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('State*', 'மாநிலம்*', 'ರಾಜ್ಯ*', 'राज्य*')}
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Country*', 'நாடு*', 'ದೇಶ*', 'देश*')}
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Body Type', 'உடல் வாகு', 'ದೇಹದ ಪ್ರಕಾರ', 'शारीरिक गठन')}
                        </label>
                        <select
                          value={formData.bodyType}
                          onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Average">{tr('Average', 'சராசரி', 'ಸಾಮಾನ್ಯ', 'औसत')}</option>
                          <option value="Slim">{tr('Slim', 'ஒல்லியான', 'ತೆಳ್ಳಗೆ', 'पतला')}</option>
                          <option value="Athletic">{tr('Athletic', 'உறுதியான', 'ಉತ್ತಮ ಮೈಕಟ್ಟು', 'एथलेटिक')}</option>
                          <option value="Heavy">{tr('Heavy', 'பருமனான', 'ದಪ್ಪ', 'भारी')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Complexion', 'நிறம்', 'ಮೈಬಣ್ಣ', 'रंग-रूप')}
                        </label>
                        <select
                          value={formData.complexion}
                          onChange={(e) => setFormData({ ...formData, complexion: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Wheatish">{tr('Wheatish', 'மாநிறம்', 'ಗೋಧಿ ಬಣ್ಣ', 'गेहुंआ')}</option>
                          <option value="Fair">{tr('Fair', 'வெள்ளை', 'ಬಿಳಿ ಬಣ್ಣ', 'गोरा')}</option>
                          <option value="Very Fair">{tr('Very Fair', 'மிக வெள்ளை', 'ತುಂಬಾ ಬಿಳಿ', 'अत्यंत गोरा')}</option>
                          <option value="Dark">{tr('Dark', 'கருமை', 'ಕಪ್ಪು', 'सांवला')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Citizenship', 'குடியுரிமை', 'ಪೌರತ್ವ', 'नागरिकता')}
                        </label>
                        <input
                          type="text"
                          value={formData.citizenship}
                          onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Profile Photograph URL*', 'புகைப்பட இணைப்பு*', 'ಫೋಟೋ ಲಿಂಕ್*', 'फोटो यूआरएल*')}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={formData.primaryPhotoUrl}
                            onChange={(e) => setFormData({ ...formData, primaryPhotoUrl: e.target.value })}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                          />
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <img
                            src={formData.primaryPhotoUrl}
                            alt="Preview"
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                          />
                          <span className="text-[11px] text-slate-500">
                            {tr('Clear, traditional, recent portrait photo recommended for faster responses.', 'தெளிவான, அண்மையில் எடுக்கப்பட்ட நேர்த்தியான புகைப்படம் பரிந்துரைக்கப்படுகிறது.', 'ಸ್ಪಷ್ಟ ಮತ್ತು ಇತ್ತೀಚಿನ ಭಾವಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', 'स्पष्ट एवं नवीनतम चित्र अपलोड करने की सलाह दी जाती है।')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Partner Preferences */}
                {wizardStep === 8 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500" />
                        {tr('Step 8: Partner Preferences', 'நிலை 8: வாழ்க்கைத்துணை எதிர்பார்ப்புகள்', 'ಹಂತ 8: ಸಂಗಾತಿಯ ನಿರೀಕ್ಷೆಗಳು', 'चरण 8: जीवनसाथी की प्राथमिकताएं')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr('Expected age, height, education, caste preference, and horoscope requirements.', 'எதிர்பார்க்கும் வயது, உயரம், கல்வி, சாதி விருப்பம் மற்றும் ஜாதகப் பொருத்தம்.', 'ನಿರೀಕ್ಷಿತ ವಯಸ್ಸು, ಎತ್ತರ, ಶಿಕ್ಷಣ, ಜಾತಿ ಮತ್ತು ಜಾತಕ ಅಗತ್ಯತೆಗಳು.', 'वांछित आयु, शिक्षा, जाति एवं कुंडली आवश्यकताएं।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Preferred Age Range*', 'வயது வரம்பு*', 'ವಯಸ್ಸಿನ ಮಿತಿ*', 'आयु सीमा*')}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={18}
                            max={60}
                            value={formData.partnerAgeMin}
                            onChange={(e) => setFormData({ ...formData, partnerAgeMin: parseInt(e.target.value) || 20 })}
                            className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-center"
                          />
                          <span className="text-xs text-slate-400">{tr('to', 'முதல்', 'ಇಂದ', 'से')}</span>
                          <input
                            type="number"
                            min={18}
                            max={60}
                            value={formData.partnerAgeMax}
                            onChange={(e) => setFormData({ ...formData, partnerAgeMax: parseInt(e.target.value) || 35 })}
                            className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-center"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Preferred Marital Status', 'திருமண நிலை விருப்பம்', 'ವೈವಾಹಿಕ ಸ್ಥಿತಿ ಆದ್ಯತೆ', 'वैवाहिक स्थिति प्राथमिकता')}
                        </label>
                        <select
                          value={formData.partnerMaritalStatus}
                          onChange={(e) => setFormData({ ...formData, partnerMaritalStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Never Married">{tr('Never Married', 'முதல் மணம்', 'ಅವಿವಾಹಿತ', 'अविवाहित')}</option>
                          <option value="Divorced / Widowed">{tr('Divorced / Widowed', 'விவாகரத்து / துணை இழந்தவர்', 'ವಿಚ್ಛೇದಿತ / ವಿಧವೆ', 'तलाकशुदा / विधवा')}</option>
                          <option value="Doesn't Matter">{tr("Doesn't Matter", 'பொருட்டல்ல', 'ಅಡ್ಡಿಯಿಲ್ಲ', 'कोई भी')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Preferred Caste / Community', 'சாதி / சமூகம் விருப்பம்', 'ಜಾತಿ / ಸಮುದಾಯ ಆದ್ಯತೆ', 'जाति / समुदाय प्राथमिकता')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Same Caste / Any Brahmin / Open"
                          value={formData.partnerCaste}
                          onChange={(e) => setFormData({ ...formData, partnerCaste: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Preferred Education', 'கல்வித் தகுதி விருப்பம்', 'ಶಿಕ್ಷಣ ಆದ್ಯತೆ', 'शिक्षा प्राथमिकता')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Engineering / Masters / Any Graduate"
                          value={formData.partnerEducation}
                          onChange={(e) => setFormData({ ...formData, partnerEducation: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Preferred Occupation & Income', 'தொழில் & வருமானம் விருப்பம்', 'ಉದ್ಯೋಗ ಮತ್ತು ಆದಾಯ ಆದ್ಯತೆ', 'व्यवसाय एवं आय प्राथमिकता')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IT Professional, Open"
                          value={formData.partnerOccupation}
                          onChange={(e) => setFormData({ ...formData, partnerOccupation: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Dosha / Chevvai Preference', 'செவ்வாய் தோஷ விருப்பம்', 'ದೋಷ ಆದ್ಯತೆ', 'दोष प्राथमिकता')}
                        </label>
                        <select
                          value={formData.partnerDoshaPreference}
                          onChange={(e) => setFormData({ ...formData, partnerDoshaPreference: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="No Dosha / Matching Dosha">{tr('No Dosha / Matching Dosha', 'தோஷமில்லை / சம தோஷம்', 'ದೋಷವಿಲ್ಲ / ಸಮ ದೋಷ', 'दोष मुक्त / सम दोष')}</option>
                          <option value="Must have Chevvai Dosha">{tr('Must have Chevvai Dosha', 'செவ்வாய் தோஷம் அவசியம்', 'ಕುಜ ದೋಷ ಇರಬೇಕು', 'मंगल दोष आवश्यक')}</option>
                          <option value="Doesn't Matter">{tr("Doesn't Matter", 'பொருட்டல்ல', 'ಅಡ್ಡಿಯಿಲ್ಲ', 'कोई भी')}</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Other Expectations / Special Notes', 'கூடுதல் எதிர்பார்ப்புகள்', 'ಇತರ ನಿರೀಕ್ಷೆಗಳು', 'अन्य विशेष अपेक्षाएं')}
                        </label>
                        <textarea
                          rows={2}
                          value={formData.partnerExpectations}
                          onChange={(e) => setFormData({ ...formData, partnerExpectations: e.target.value })}
                          placeholder={tr('Looking for a well-educated, respectful partner...', 'நல்ல குணமும் பண்பும் உள்ள துணையை எதிர்பார்க்கிறோம்...', 'ಉತ್ತಮ ಸಂಸ್ಕಾರಯುತ ಜೀವನ ಸಂಗಾತಿಗಾಗಿ ಹುಡುಕಾಟ...', 'सुसंस्कृत और समझदार जीवनसाथी की तलाश...')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 9: Contact Information & Privacy */}
                {wizardStep === 9 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        {tr('Step 9: Contact Information & Privacy Settings', 'நிலை 9: தொடர்பு & பாதுகாப்பு அமைப்புகள்', 'ಹಂತ 9: ಸಂಪರ್ಕ ಮತ್ತು ಗೌಪ್ಯತೆ', 'चरण 9: संपर्क एवं गोपनीयता सेटिंग्स')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {tr('Designated contact person and privacy restrictions for phone and WhatsApp.', 'தொடர்பு கொள்ள வேண்டிய நபர் மற்றும் அலைபேசி எண் பாதுகாப்பு அமைப்புகள்.', 'ಸಂಪರ್ಕಿಸಬೇಕಾದ ವ್ಯಕ್ತಿ ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯ ಗೌಪ್ಯತೆ ವಿವರ.', 'संपर्क व्यक्ति एवं मोबाइल गोपनीयता सेटिंग्स।')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Contact Person Name*', 'தொடர்பு கொள்ள வேண்டியவர்*', 'ಸಂಪರ್ಕಿಸಬೇಕಾದ ವ್ಯಕ್ತಿ*', 'संपर्क सूत्र व्यक्ति*')}
                        </label>
                        <input
                          type="text"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Relationship to Candidate*', 'உறவுமுறை*', 'ಸಂಬಂಧ*', 'संबंध*')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Father, Self, Mother, Brother"
                          value={formData.contactPersonRelation}
                          onChange={(e) => setFormData({ ...formData, contactPersonRelation: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Alternate Mobile Number', 'மாற்று அலைபேசி எண்', 'ಪರ್ಯಾಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'वैकल्पिक मोबाइल नंबर')}
                        </label>
                        <input
                          type="tel"
                          value={formData.altMobile}
                          onChange={(e) => setFormData({ ...formData, altMobile: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Preferred Contact Method', 'விருப்பமான தொடர்பு முறை', 'ಆದ್ಯತೆಯ ಸಂಪರ್ಕ ವಿಧಾನ', 'पसंदीदा संपर्क माध्यम')}
                        </label>
                        <select
                          value={formData.preferredContactMethod}
                          onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="WhatsApp & Direct Call">{tr('WhatsApp & Direct Call', 'வாட்ஸ்அப் & நேரடி அழைப்பு', 'ವಾಟ್ಸಾಪ್ & ನೇರ ಕರೆ', 'व्हाट्सएप एवं कॉल')}</option>
                          <option value="WhatsApp Only">{tr('WhatsApp Only', 'வாட்ஸ்அப் மட்டும்', 'ವಾಟ್ಸಾಪ್ ಮಾತ್ರ', 'केवल व्हाट्सएप')}</option>
                          <option value="Call Only">{tr('Direct Call Only', 'அழைப்பு மட்டும்', 'ಕರೆ ಮಾತ್ರ', 'केवल कॉल')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {tr('Phone Number Visibility Setting', 'அலைபேசி எண் பார்வை நிலை', 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ ಗೋಚರತೆ', 'फोन नंबर दृश्यता')}
                        </label>
                        <select
                          value={formData.contactVisibility}
                          onChange={(e) => setFormData({ ...formData, contactVisibility: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-bold text-rose-700 focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="Public">{tr('Public', 'பொதுவானது', 'ಸಾರ್ವಜನಿಕ', 'सार्वजनिक')}</option>
                          <option value="request_only">{tr('On Request Only', 'அனுமதி பெற்று மட்டும்', 'ವಿನಂತಿಯ ಮೇರೆಗೆ ಮಾತ್ರ', 'केवल अनुरोध पर')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 10: Preview & Publish */}
                {wizardStep === 10 && (
                  <div className="space-y-5">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          {tr('Step 10: Profile Preview & Final Activation', 'நிலை 10: முன்னோட்டம் & உறுதிப்படுத்தல்', 'ಹಂತ 10: ಪೂರ್ವವೀಕ್ಷಣೆ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ', 'चरण 10: पूर्वावलोकन एवं अंतिम सत्यापन')}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {tr('Review all details before publishing to the Vedic Matrimony directory.', 'வரன் விவரங்களைச் சரிபார்த்து பதிவைச் செயல்படுத்தவும்.', 'ಪ್ರಕಟಿಸುವ ಮುನ್ನ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.', 'प्रकाशित करने से पूर्व सभी विवरणों की समीक्षा करें।')}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                        {tr('Completeness', 'முழுமை நிலை', 'ಪೂರ್ಣತೆ', 'पूर्णता')}: {computeCurrentCompleteness()}%
                      </div>
                    </div>

                    {/* Preview Bio Card */}
                    <div className="bg-gradient-to-r from-rose-50/50 via-pink-50/30 to-amber-50/50 border border-rose-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-5">
                      <div className="w-full md:w-44 h-56 rounded-2xl overflow-hidden shrink-0 shadow-md">
                        <img
                          src={formData.primaryPhotoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2.5 flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
                            {formData.profileType === 'Bride' ? tr('Bride', 'மணமகள்', 'ವಧು', 'वधू') : tr('Groom', 'மணமகன்', 'ವರ', 'वर')}
                          </span>
                          <span className="text-slate-400 font-bold">•</span>
                          <span className="text-slate-600 font-semibold">{tr('Created by', 'பதிவு செய்தவர்', 'ರಚಿಸಿದವರು', 'निर्माता')} {formData.profileCreatedBy}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900">{formData.name}</h3>
                        <p className="text-slate-600 font-medium">
                          {formData.age} {tr('Years', 'வயது', 'ವರ್ಷಗಳು', 'वर्ष')} • {formData.height} • {formatMaritalStatus(formData.maritalStatus, lang)} • {formData.city}, {formData.state}
                        </p>

                        <div className="p-2.5 bg-white border border-amber-200 rounded-xl space-y-1">
                          <p className="font-bold text-amber-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            {formatNakshatra(formData.starNakshatra, lang)} ({formData.padam} {tr('Padam', 'பாதம்', 'ಪಾದ', 'चरण')}) • {formatRasi(formData.rasiMoonSign, lang)}
                          </p>
                          <p className="text-[11px] text-amber-800">
                            {tr('Lagna', 'லக்னம்', 'ಲಗ್ன', 'लग्न')}: {formatRasi(formData.lagnamAscendant, lang)} • {formatDosha(formData.manglikDosha, lang)}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                          <p><strong>{tr('Education', 'கல்வி', 'ಶಿಕ್ಷಣ', 'शिक्षा')}:</strong> {formData.highestEducation}</p>
                          <p><strong>{tr('Profession', 'தொழில்', 'ವೃತ್ತಿ', 'व्यवसाय')}:</strong> {formData.occupation} ({formData.annualIncome})</p>
                          <p><strong>{tr('Caste / Gotra', 'சாதி / கோத்திரம்', 'ಜಾತಿ / ಗೋತ್ರ', 'जाति / गोत्र')}:</strong> {formData.caste}, {formData.gotra}</p>
                          <p><strong>{tr('Father', 'தந்தை', 'ತಂದೆ', 'पिता')}:</strong> {formData.fatherName} ({formData.fatherOccupation})</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                      <label className="flex items-center gap-2 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>{tr('I confirm all information provided is accurate and adheres to Astrojit Matrimony Guidelines.', 'வழங்கப்பட்டுள்ள அனைத்து விவரங்களும் உண்மையானவை என உறுதிப்படுத்துகிறேன்.', 'ನೀಡಿರುವ ಎಲ್ಲಾ ಮಾಹಿತಿಯು ನಿಖರವಾಗಿದೆ ಎಂದು ದೃಢೀಕರಿಸುತ್ತೇನೆ.', 'मैं पुष्टि करता/करती हूँ कि दी गई सभी जानकारी सत्य एवं सटीक है।')}</span>
                      </label>
                      <label className="flex items-center gap-2 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.privacyAccepted}
                          onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>{tr('I agree to the Terms of Service & Privacy Policy for Vedic Matchmaking.', 'வைதீக திருமண சேவையின் விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கைகளை ஏற்கிறேன்.', 'ವೈದಿಕ ವಿವಾಹ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಒಪ್ಪುತ್ತೇನೆ.', 'मैं सेवा की शर्तों एवं गोपनीयता नीति से सहमत हूँ।')}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Wizard Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                    disabled={wizardStep === 1}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> {tr('Previous', 'முந்தைய நிலை', 'ಹಿಂದಿನ ಹಂತ', 'पिछला चरण')}
                  </button>

                  <div className="flex items-center gap-2">
                    {wizardStep < 10 ? (
                      <button
                        type="button"
                        onClick={() => setWizardStep(prev => Math.min(10, prev + 1))}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {tr('Next Step', 'அடுத்த நிலை', 'ಮುಂದಿನ ಹಂತ', 'अगला चरण')} <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                      >
                        {formSubmitting ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin" /> {tr('Activating Profile...', 'பதிவு செய்யப்படுகிறது...', 'ಪ್ರೊಫೈಲ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗುತ್ತಿದೆ...', 'प्रोफाइल सक्रिय हो रही है...')}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> {tr('Publish & Activate Matrimony Profile', 'வரன் பதிவைச் செயல்படுத்துக', 'ಪ್ರೊಫೈಲ್ ಪ್ರಕಟಿಸಿ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸಿ', 'प्रोफाइल प्रकाशित करें')}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FAMILY MEMBERS & AUTOFILL MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'family' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  {tr('FAMILY HOROSCOPE VAULT', 'குடும்ப ஜாதகப் பெட்டகம்', 'ಕುಟುಂಬ ಜಾತಕ ಕೋಶ', 'पारिवारिक कुंडली संग्रह')}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {tr('Astrojit Family Members & Astrological Profiles', 'குடும்ப உறுப்பினர்கள் & ஜாதகத் தகவல்', 'ಕುಟುಂಬ ಸದಸ್ಯರು ಮತ್ತು ಜಾತಕ ಮಾಹಿತಿ', 'परिवार के सदस्य एवं कुंडली विवरण')}
              </h2>
              <p className="text-xs text-slate-500">
                {tr(
                  'Manage family members. Once their DOB and place are entered, Thirukanitha astrology is automatically computed for rapid matrimony matchmaking.',
                  'குடும்பத்தில் உள்ள மகன், மகள், சகோதரி அல்லது சகோதரரின் விவரங்களைச் சேமித்து வைத்து, உடனுக்குடன் வரன் பதிவு மற்றும் பொருத்த ஆய்வு செய்யுங்கள்.',
                  'ಕುಟುಂಬ ಸದಸ್ಯರ ವಿವರಗಳನ್ನು ನಿರ್ವಹಿಸಿ. ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿದ ತಕ್ಷಣ ತಿರುಕಣಿತ ಜಾತಕವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.',
                  'परिवार के सदस्यों का प्रबंधन करें। जन्म विवरण दर्ज करते ही थिरुकणिता गणना स्वतः उपलब्ध होगी।'
                )}
              </p>
            </div>

            <button
              onClick={() => setFamilyModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              {tr('+ Add New Family Member', '+ குடும்ப உறுப்பினர் சேர்க்க', '+ ಹೊಸ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ', '+ नया पारिवारिक सदस्य जोड़ें')}
            </button>
          </div>

          {/* Family Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary Client Self Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-yellow-500/10 border-2 border-amber-300 rounded-3xl p-5 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                  {tr('Primary Client (Self)', 'முதன்மைப் பயனர் (சுய விவரம்)', 'ಮುಖ್ಯ ಕ್ಲೈಂಟ್ (ಸ್ವತಃ)', 'मुख्य सदस्य (स्वयं)')}
                </span>
                <span className="text-xs font-bold text-amber-900">{user?.name || tr('Self Account', 'சுய கணக்கு')}</span>
              </div>

              <div className="space-y-1 text-xs text-slate-700">
                <p><strong>{tr('DOB', 'பிறந்த தேதி', 'ಹುಟ್ಟಿದ ದಿನಾಂಕ', 'जन्म तिथि')}:</strong> {user?.dob || '-'}</p>
                <p><strong>{tr('Birth Place', 'பிறந்த இடம்', 'ಜನನ ಸ್ಥಳ', 'जन्म स्थान')}:</strong> {user?.dobPlace || '-'} {user?.dobTime ? `(${user?.dobTime})` : ''}</p>
                <p><strong>{tr('Mobile', 'மொபைல்', 'ಮೊಬೈಲ್', 'मोबाइल')}:</strong> {user?.mobile || '-'}</p>
              </div>

              <button
                onClick={() => {
                  handleAutofillPerson('client-self');
                  setActiveTab('register');
                  setWizardStep(1);
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {tr('Register Matrimony Profile', 'வரன் பதிவு செய்க', 'ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ', 'प्रोफाइल बनाएं')}
              </button>
            </div>

            {/* Other Saved Family Members */}
            {(autofillSources?.familyMembers || []).map((fm) => (
              <div
                key={fm.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase bg-pink-100 text-pink-900 px-2.5 py-0.5 rounded-full">
                      {tr(fm.relation, fm.relation === 'Sister' ? 'சகோதரி' : fm.relation === 'Brother' ? 'சகோதரன்' : fm.relation === 'Son' ? 'மகன்' : fm.relation === 'Daughter' ? 'மகள்' : 'உறவினர்')} ({(fm.gender === 'Bride' || fm.gender === 'female' || (fm.relation || '').toLowerCase().includes('sister') || (fm.relation || '').toLowerCase().includes('daughter')) ? tr('Bride', 'மணமகள்', 'ವಧು', 'वधू') : tr('Groom', 'மணமகன்', 'ವರ', 'वर')})
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{tr('ID', 'எண்', 'ಐಡಿ', 'आईडी')}: {fm.id}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{fm.name}</h3>

                  <div className="space-y-1 mt-2 text-xs text-slate-600">
                    <p><strong>{tr('DOB', 'பிறந்த தேதி', 'ಹುಟ್ಟಿದ ದಿನಾಂಕ', 'जन्म तिथि')}:</strong> {fm.dob} ({fm.age} {tr('Yrs', 'வயது', 'ವರ್ಷ', 'वर्ष')})</p>
                    <p><strong>{tr('Place', 'இடம்', 'ಸ್ಥಳ', 'स्थान')}:</strong> {fm.dobPlace}</p>
                    {fm.horoscope && (
                      <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-xl my-2 text-[11px] text-amber-950 font-medium">
                        ✨ <strong>{fm.horoscope.nakshatra}</strong> • {fm.horoscope.rasi} • {fm.horoscope.chevvaiDosha}
                      </div>
                    )}
                    <p><strong>{tr('Father', 'தந்தை', 'ತಂದೆ', 'पिता')}:</strong> {fm.fatherName}</p>
                    <p><strong>{tr('Occupation', 'தொழில்', 'ವೃತ್ತಿ', 'व्यवसाय')}:</strong> {fm.occupation || tr('Professional', 'தொழில்முறை பணியாளர்', 'ವೃತ್ತಿಪರ', 'पेशेवर')}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAutofillPerson(fm.id);
                    setActiveTab('register');
                    setWizardStep(1);
                  }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer mt-3"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {tr(`Register Profile for ${fm.name}`, `${fm.name} அவர்களுக்கு வரன் பதிவு`, `${fm.name} ಅವರಿಗೆ ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ`, `${fm.name} के लिए प्रोफाइल बनाएं`)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INTERESTS & SHORTLISTS */}
      {/* ========================================================================= */}
      {activeTab === 'interests' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
            <h2 className="text-xl font-black text-slate-900">
              {tr('My Matrimony Interests & Shortlists', 'விருப்பங்கள் & சேமிக்கப்பட்ட வரன்கள்', 'ನನ್ನ ಆಸಕ್ತಿಗಳು ಮತ್ತು ಉಳಿಸಿದ ಪ್ರೊಫೈಲ್‌ಗಳು', 'मेरी रुचियां एवं पसंदीदा प्रोफाइलें')}
            </h2>
            <p className="text-xs text-slate-500">
              {tr('Manage profiles you have shortlisted and express interest to candidates.', 'நீங்கள் சேமித்த வரன்கள் மற்றும் அனுப்பிய விருப்பக் கோரிக்கைகளை நிர்வகியுங்கள்.', 'ನೀವು ಉಳಿಸಿದ ಪ್ರೊಫೈಲ್‌ಗಳು ಮತ್ತು ಆಸಕ್ತಿಯ ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.', 'पसंदीदा प्रोफाइल और भेजे गए अनुरोधों का प्रबंधन करें।')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Shortlisted Candidates */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-rose-600 fill-rose-600" />
                {tr('Shortlisted Profiles', 'சேமிக்கப்பட்ட வரன்கள்', 'ಉಳಿಸಿದ ಪ್ರೊಫೈಲ್‌ಗಳು', 'पसंदीदा प्रोफाइलें')} ({shortlists.length})
              </h3>

              {shortlists.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  {tr('No shortlisted profiles yet. Bookmark profiles while browsing!', 'சேமிக்கப்பட்ட வரன்கள் எதுவும் இல்லை. வரன்களைப் பார்வையிடும்போது புக்மார்க் செய்யலாம்!', 'ಯಾವುದೇ ಪ್ರೊಫೈಲ್ ಉಳಿಸಿಲ್ಲ!', 'अभी कोई पसंदीदा प्रोफाइल नहीं है।')}
                </div>
              ) : (
                <div className="space-y-3">
                  {shortlists.map((s) => {
                    const prof = profiles.find(p => (p.matrimonyId || p.id) === s.profileId);
                    if (!prof) return null;
                    return (
                      <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={prof.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop'}
                            alt={prof.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">{prof.name}</h4>
                            <p className="text-[10px] text-slate-500">{prof.age} {tr('Yrs', 'வயது', 'ವರ್ಷ', 'वर्ष')} • {prof.starNakshatra} • {prof.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCheckCompatibility(prof)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                          >
                            {tr('Compatibility', 'பொருத்தம்', 'ಹೊಂದಾಣಿಕೆ', 'मिलान')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sent & Received Interests */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
                {tr('Sent & Received Interests', 'விருப்பக் கோரிக்கைகள்', 'ಆಸಕ್ತಿಯ ವಿನಂತಿಗಳು', 'भेजी गई रुचियां')} ({interests.length})
              </h3>

              {interests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  {tr('No active interest requests at this time.', 'செயலில் உள்ள விருப்பக் கோரிக்கைகள் எதுவும் இல்லை.', 'ಯಾವುದೇ ವಿನಂತಿಗಳಿಲ್ಲ.', 'वर्तमान में कोई सक्रिय अनुरोध नहीं है।')}
                </div>
              ) : (
                <div className="space-y-3">
                  {interests.map((int) => {
                    const targetProf = profiles.find(p => (p.matrimonyId || p.id) === int.toProfileId);
                    return (
                      <div key={int.id} className="p-3 bg-pink-50/60 border border-pink-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-pink-200 text-pink-900 px-2 py-0.2 rounded-full uppercase">
                              {int.status}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {targetProf?.name || int.toProfileId}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-1 italic">"{int.message}"</p>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(int.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIVE VEDIC COMPATIBILITY MODAL (36 GUNAS & 10 PORUTHAMS) */}
      {/* ========================================================================= */}
      {compatibilityModal.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-rose-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white p-5 relative">
              <button
                onClick={() => setCompatibilityModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                  {tr('AUTHENTIC THIRUKANITHA HOROSCOPE MATCH', 'திருக்கணித முறைப்படி துல்லிய ஜாதகப் பொருத்தம்', 'ತಿರುಕಣಿತ ನಿಖರ ಜಾತಕ ಹೊಂದಾಣಿಕೆ', 'थिरुकणिता सटीक कुंडली मिलान')}
                </span>
              </div>
              <h3 className="text-xl font-black mt-1">
                {tr('Vedic Kundli & 10 Poruthams Compatibility', 'அஷ்டகூட 36 குணங்கள் & 10 பொருத்தங்கள் ஆய்வு', 'ವೈದಿಕ ಜಾತಕ ಮತ್ತು 10 ಹೊಂದಾಣಿಕೆಗಳ ವಿಶ್ಲೇಷಣೆ', 'वैदिक कुंडली एवं 10 पोरुथम मिलान')}
              </h3>
              <p className="text-xs text-rose-50 mt-1">
                {tr(
                  'Deep astrological mutual alignment based on Thirukanitha ephemeris and Maharishi Parashara rules.',
                  'திருக்கணிதப் பஞ்சாங்கம் மற்றும் பராசர முனிவர் விதிகளின்படி கணிக்கப்பட்ட பொருத்தம்.',
                  'ತಿರುಕಣಿತ ಪದ್ಧತಿಯಂತೆ ಗ್ರಹಗಳ ಹೊಂದಾಣಿಕೆ ವಿಶ್ಲೇಷಣೆ.',
                  'थिरुकणिता पंचांग एवं पराशर सिद्धांत पर आधारित प्रामाणिक विश्लेषण।'
                )}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {compatibilityModal.loading ? (
                <div className="py-12 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-rose-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    {tr('Computing 36 Gunas Ashtakoota, 10 Tamil Poruthams & Chevvai Dosha...', '10 பொருத்தங்கள் மற்றும் 36 குணங்கள் கணக்கிடப்படுகின்றன...', '10 ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು 36 ಗುಣಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...', '10 पोरुथम एवं 36 गुणों की गणना जारी है...')}
                  </p>
                </div>
              ) : compatibilityModal.result ? (
                <div className="space-y-4">
                  {/* Candidates Comparison Ribbon */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        {tr('Groom', 'மணமகன்', 'ವರ', 'वर')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{compatibilityModal.result.boy.name}</h4>
                      <p className="text-[11px] text-slate-600">
                        {formatNakshatra(compatibilityModal.result.boy.nakshatra, lang)} • {formatRasi(compatibilityModal.result.boy.rasi, lang)}
                      </p>
                    </div>

                    <div className="space-y-1 text-right">
                      <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                        {tr('Bride', 'மணமகள்', 'ವಧು', 'वधू')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{compatibilityModal.result.girl.name}</h4>
                      <p className="text-[11px] text-slate-600">
                        {formatNakshatra(compatibilityModal.result.girl.nakshatra, lang)} • {formatRasi(compatibilityModal.result.girl.rasi, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Overall Verdict Badge */}
                  <div className={`p-4 rounded-2xl border text-center space-y-1 ${compatibilityModal.result.overallColor}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {tr('OVERALL ASTROLOGICAL VERDICT', 'ஒட்டுமொத்த ஜோதிடப் பொருத்த முடிவு', 'ಒಟ್ಟಾರೆ ಜ್ಯೋತಿಷ್ಯ ತೀರ್ಪು', 'समग्र ज्योतिषीय मिलान निर्णय')}
                    </span>
                    <h4 className="text-lg font-black">
                      {lang === 'ta' && compatibilityModal.result.tamilPoruthams?.verdictTamil
                        ? compatibilityModal.result.tamilPoruthams.verdictTamil
                        : compatibilityModal.result.overallVerdict}
                    </h4>
                  </div>

                  {/* Dual Score Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-900">
                        {tr('36 Gunas Ashtakoota', '36 குணங்கள் அஷ்டகூடம்', '36 ಗುಣಗಳ ಅಷ್ಟಕೂಟ', '36 गुण अष्टकूट')}
                      </span>
                      <div className="text-2xl font-black text-indigo-700">
                        {compatibilityModal.result.ashtakoota?.totalScore} / 36
                      </div>
                      <p className="text-[10px] text-indigo-800 font-semibold">
                        {compatibilityModal.result.ashtakoota?.percentage}% {tr('Compatibility', 'பொருத்தம்', 'ಹೊಂದಾಣಿಕೆ', 'समानता')}
                      </p>
                    </div>

                    <div className="p-3.5 bg-pink-50 border border-pink-200 rounded-2xl text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase text-pink-900">
                        {tr('10 Vedic Poruthams', '10 வைதீகப் பொருத்தங்கள்', '10 ವೈದಿಕ ಹೊಂದಾಣಿಕೆಗಳು', '10 वैदिक पोरुथम')}
                      </span>
                      <div className="text-2xl font-black text-pink-700">
                        {compatibilityModal.result.tamilPoruthams?.totalPoints} / {compatibilityModal.result.tamilPoruthams?.maxPossible}
                      </div>
                      <p className="text-[10px] text-pink-800 font-semibold">
                        {lang === 'ta' ? compatibilityModal.result.tamilPoruthams?.verdictTamil : compatibilityModal.result.tamilPoruthams?.verdict}
                      </p>
                    </div>
                  </div>

                  {/* Chevvai Dosha Section */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      {tr('Chevvai (Mars) Dosha Analysis:', 'செவ்வாய் தோஷ ஆய்வு:', 'ಕುಜ ದೋಷ ವಿಶ್ಲೇಷಣೆ:', 'मंगल दोष विश्लेषण:')}
                    </span>
                    <p className="text-slate-800 font-bold">
                      {lang === 'ta' 
                        ? compatibilityModal.result.chevvaiDoshaMatch?.verdictTamil 
                        : compatibilityModal.result.chevvaiDoshaMatch?.verdict}
                    </p>
                  </div>

                  {/* 10 Poruthams Breakdown Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs">
                      {tr('Primary 10 Poruthams Breakdown:', '10 முக்கியப் பொருத்தங்கள் விவரம்:', 'ಪ್ರಮುಖ 10 ಹೊಂದಾಣಿಕೆಗಳ ವಿವರ:', 'मुख्य 10 पोरुथम विवरण:')}
                    </h4>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[340px] text-left text-[11px]">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2">{tr('Porutham', 'பொருத்தம்', 'ಹೊಂದಾಣಿಕೆ', 'पोरुथम')}</th>
                            <th className="p-2">{tr('Significance', 'முக்கியத்துவம்', 'ಮಹತ್ವ', 'महत्व')}</th>
                            <th className="p-2 text-right">{tr('Status', 'நிலை', 'ಸ್ಥಿತಿ', 'स्थिति')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(compatibilityModal.result.tamilPoruthams?.poruthams || []).slice(0, 10).map((pt, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-bold text-slate-800">
                                {lang === 'ta' ? pt.tamilName : pt.name}
                              </td>
                              <td className="p-2 text-slate-600 text-[10px]">
                                {pt.significance}
                              </td>
                              <td className="p-2 text-right">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  pt.points > 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {lang === 'ta' ? pt.statusTamil : pt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <button
                onClick={() => {
                  setConsultationModal({
                    isOpen: true,
                    candidate: compatibilityModal.candidate,
                    result: compatibilityModal.result,
                  });
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-amber-700 hover:from-indigo-800 hover:to-amber-800 text-white font-black rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>🌟</span>
                <span>{tr('Request Astrologer Review on this Alliance', 'ஜோதிடர் விரிவான ஆய்வு கோரல்', 'ಜ್ಯೋತಿಷಿ ವಿಮರ್ಶೆ ಕೋರಿ', 'ज्योतिषी समीक्षा का अनुरोध करें')}</span>
              </button>

              <button
                onClick={() => setCompatibilityModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                {tr('Close Report', 'அறிக்கையை மூடுக', 'ವರದಿ ಮುಚ್ಚಿ', 'रिपोर्ट बंद करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW FAMILY MEMBER MODAL */}
      {/* ========================================================================= */}
      {familyModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-rose-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-r from-rose-600 to-amber-600 text-white p-5 relative">
              <button
                onClick={() => setFamilyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-black">
                {tr('+ Add New Family Member to Astrojit', '+ புதிய குடும்ப உறுப்பினர் சேர்க்க', '+ ಹೊಸ ಕುಟುಂಬ ಸದಸ್ಯರ ವಿವರ', '+ नया परिवार सदस्य जोड़ें')}
              </h3>
              <p className="text-xs text-rose-50 mt-1">
                {tr(
                  'Enter your family member details. Astrojit will compute their Thirukanitha horoscope for rapid matrimony autofill.',
                  'குடும்ப உறுப்பினர் விவரங்களைப் பதிவு செய்யவும். திருக்கணித ஜாதகக் கணிப்பு தானாகவே கணக்கிடப்படும்.',
                  'ಕುಟುಂಬ ಸದಸ್ಯರ ವಿವರ ನಮೂದಿಸಿ, ತಿರುಕಣಿತ ಜಾತಕ ತಕ್ಷಣ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.',
                  'पारिवारिक सदस्य विवरण भरें, थिरुकणिता कुंडली स्वतः निकलेगी।'
                )}
              </p>
            </div>

            <form onSubmit={handleCreateFamilyMember} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Full Name*', 'முழுப் பெயர்*', 'ಪೂರ್ಣ ಹೆಸರು*', 'पूरा नाम*')}
                </label>
                <input
                  type="text"
                  required
                  value={newFamilyMember.name}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  placeholder={tr('Enter Full Name', 'முழுப் பெயரை உள்ளிடவும்', 'ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ', 'पूरा नाम दर्ज करें')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Relationship*', 'உறவுமுறை*', 'ಸಂಬಂಧ*', 'संबंध*')}
                  </label>
                  <select
                    value={newFamilyMember.relation}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Sister">{tr('Sister', 'சகோதரி', 'ಸಹೋದರಿ', 'बहन')}</option>
                    <option value="Brother">{tr('Brother', 'சகோதரன்', 'ಸಹೋದರ', 'भाई')}</option>
                    <option value="Son">{tr('Son', 'மகன்', 'ಮಗ', 'बेटा')}</option>
                    <option value="Daughter">{tr('Daughter', 'மகள்', 'ಮಗಳು', 'बेटी')}</option>
                    <option value="Relative">{tr('Relative', 'உறவினர்', 'ಸಂಬಂಧಿ', 'रिश्तेदार')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Gender*', 'பாலினம்*', 'ಲಿಂಗ*', 'लिंग*')}
                  </label>
                  <select
                    value={newFamilyMember.gender}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Bride">{tr('Bride', 'மணமகள்', 'ವಧು', 'वधू')}</option>
                    <option value="Groom">{tr('Groom', 'மணமகன்', 'ವರ', 'वर')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Date of Birth*', 'பிறந்த தேதி*', 'ಹುಟ್ಟಿದ ದಿನಾಂಕ*', 'जन्म तिथि*')}
                  </label>
                  <input
                    type="date"
                    required
                    value={newFamilyMember.dob}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Birth Time', 'பிறந்த நேரம்', 'ಜನನ ಸಮಯ', 'जन्म समय')}
                  </label>
                  <input
                    type="time"
                    value={newFamilyMember.dobTime}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, dobTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Birth Place*', 'பிறந்த இடம்*', 'ಜನನ ಸ್ಥಳ*', 'जन्म स्थान*')}
                </label>
                <input
                  type="text"
                  required
                  value={newFamilyMember.dobPlace}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, dobPlace: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  placeholder={tr('Enter Birth Place', 'பிறந்த இடம் உள்ளிடவும்', 'ಜನನ ಸ್ಥಳ ನಮೂದಿಸಿ', 'जन्म स्थान दर्ज करें')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr("Father's Name", 'தந்தை பெயர்', 'ತಂದೆಯ ಹೆಸರು', 'पिता का नाम')}
                  </label>
                  <input
                    type="text"
                    value={newFamilyMember.fatherName}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Mobile Number', 'அலைபேசி எண்', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'मोबाइल नंबर')}
                  </label>
                  <input
                    type="tel"
                    value={newFamilyMember.mobile}
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px]">
                ⚡ {tr('On saving, Astrojit will immediately compute their Nakshatra, Rasi, Lagna, and Chevvai Dosha status.', 'சேமித்தவுடன், நட்சத்திரம், ராசி, லக்னம் மற்றும் செவ்வாய் தோஷ நிலை உடனே கணக்கிடப்படும்.', 'ಉಳಿಸಿದ ತಕ್ಷಣ ನಕ್ಷತ್ರ, ರಾಶಿ, ಲಗ್ನ ಮತ್ತು ಕುಜ ದೋಷವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.', 'सहेजते ही नक्षत्र, राशि, लग्न एवं मंगल दोष स्वतः निकल जाएगा।')}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFamilyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  {tr('Cancel', 'ரத்து செய்க', 'ರದ್ದುಮಾಡಿ', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer shadow-md"
                >
                  {tr('Save & Compute Horoscope', 'சேமி & ஜாதகம் கணக்கிடுக', 'ಉಳಿಸಿ & ಜಾತಕ ಲೆಕ್ಕಹಾಕಿ', 'सहेजें व कुंडली निकालें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONTACT CANDIDATE MODAL */}
      {/* ========================================================================= */}
      {contactModal.isOpen && contactModal.profile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-600" />
                {tr('Contact Details', 'தொடர்புத் தகவல்', 'ಸಂಪರ್ಕ ಮಾಹಿತಿ', 'संपर्क विवरण')}
              </h3>
              <button
                onClick={() => setContactModal({ isOpen: false, profile: null })}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                <img
                  src={contactModal.profile.primaryPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'}
                  alt={contactModal.profile.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{contactModal.profile.name}</h4>
                  <p className="text-[11px] text-slate-500">{tr('ID', 'எண்', 'ಐಡಿ', 'आईडी')}: {contactModal.profile.matrimonyId}</p>
                </div>
              </div>

              <div className="space-y-2 text-slate-700">
                <p><strong>{tr('Contact Person:', 'தொடர்பு கொள்ள வேண்டியவர்:', 'ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ:', 'संपर्क सूत्र:')}</strong> {contactModal.profile.contactPerson || contactModal.profile.name}</p>
                <p><strong>{tr('Mobile Number:', 'அலைபேசி எண்:', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ:', 'मोबाइल नंबर:')}</strong> <span className="font-mono font-bold text-rose-700">{contactModal.profile.mobile}</span></p>
                {contactModal.profile.whatsappNumber && (
                  <p><strong>{tr('WhatsApp:', 'வாட்ஸ்அப்:', 'ವಾಟ್ಸಾಪ್:', 'व्हाट्सएप:')}</strong> <span className="font-mono font-bold text-emerald-700">{contactModal.profile.whatsappNumber}</span></p>
                )}
                {contactModal.profile.email && (
                  <p><strong>{tr('Email:', 'மின்னஞ்சல்:', 'ಇಮೇಲ್:', 'ईमेल:')}</strong> {contactModal.profile.email}</p>
                )}
                <p><strong>{tr('City / Residence:', 'வசிக்கும் ஊர்:', 'ನಗರ / ನಿವಾಸ:', 'शहर / निवास:')}</strong> {contactModal.profile.city}, {contactModal.profile.state}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                🔒 {tr('Please mention you found their profile on Astrojit Vedic Matrimony when connecting.', 'தொடர்பு கொள்ளும்போது அஸ்ட்ரோஜித் மேட்ரிமோனி தளத்தில் விவரம் பார்த்ததாகக் குறிப்பிடவும்.', 'ಸಂಪರ್ಕಿಸುವಾಗ ಆಸ್ಟ್ರೋಜಿತ್ ಮ್ಯಾಟ್ರಿಮೋನಿಯಲ್ಲಿ ವಿವರ ನೋಡಿದ್ದಾಗಿ ತಿಳಿಸಿ.', 'संपर्क करते समय कृपया बताएं कि आपने प्रोफाइल एस्ट्रोजित मैट्रिमोनी पर देखी।')}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setContactModal({ isOpen: false, profile: null })}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {tr('Close', 'மூடுக', 'ಮುಚ್ಚಿ', 'बंद करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TRADITIONAL VEDIC MARRIAGE BIO-DATA */}
      {biodataModalProfile && (
        <MarriageBiodataModal
          profile={biodataModalProfile}
          isOpen={Boolean(biodataModalProfile)}
          onClose={() => setBiodataModalProfile(null)}
        />
      )}

      {/* MODAL: 1-ON-1 ASTROLOGER MATCH CONSULTATION */}
      {consultationModal.isOpen && (
        <AstrologerConsultationModal
          candidate={consultationModal.candidate}
          userProfile={user}
          compatibilityResult={consultationModal.result}
          isOpen={consultationModal.isOpen}
          onClose={() => setConsultationModal({ isOpen: false, candidate: null, result: null })}
          onSuccess={() => {
            setCompatibilityModal(prev => ({ ...prev, isOpen: false }));
          }}
        />
      )}
    </div>
  );
}
