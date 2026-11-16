import React, { useState, useEffect } from 'react';
import {
  Printer,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  FileText
} from 'lucide-react';
import { useLang, LANGUAGES } from '../i18n';
import { printElementById } from '../utils/printHelper';
import DossierCover from './dossier/DossierCover';
import {
  DossierVinayakarStuti,
  DossierNavagrahaStotram,
  DossierCombinedStutis
} from './dossier/DossierStutis';
import {
  DossierJananaVivaramPart1,
  DossierJananaVivaramPart2,
  DossierCombinedJananaVivaram
} from './dossier/DossierJananaVivaram';
import DossierCharts from './dossier/DossierCharts';
import DossierNirayana from './dossier/DossierNirayana';
import DossierDivisionalCharts from './dossier/DossierDivisionalCharts';
import DossierBhavaSphutam from './dossier/DossierBhavaSphutam';
import DossierShadbala from './dossier/DossierShadbala';
import DossierDashaVarga from './dossier/DossierDashaVarga';
import DossierUpagrahas from './dossier/DossierUpagrahas';
import DossierSpecialLagnas from './dossier/DossierSpecialLagnas';
import DossierFriendships from './dossier/DossierFriendships';
import DossierAspectAngles from './dossier/DossierAspectAngles';
import DossierPachakaBodhaka from './dossier/DossierPachakaBodhaka';
import DossierPanchaPakshi from './dossier/DossierPanchaPakshi';
import DossierChevvaiDosha from './dossier/DossierChevvaiDosha';
import DossierPlanetaryStates from './dossier/DossierPlanetaryStates';
import DossierMahadashaRemedies from './dossier/DossierMahadashaRemedies';
import DossierBhuktiAntara from './dossier/DossierBhuktiAntara';
import DossierAshtakavargaShodhana from './dossier/DossierAshtakavargaShodhana';
import DossierDashaBhuktiTable from './dossier/DossierDashaBhuktiTable';
import DossierSarvashtakavarga from './dossier/DossierSarvashtakavarga';
import DossierNumerology from './dossier/DossierNumerology';
import { DOSSIER_TRANSLATIONS, translatePlanet } from './dossier/dossierI18n';

/**
 * FullHoroscopeDossier - Vedic Janma Patrika Booklet Engine
 * Dynamically supports authentic editions:
 * 7 Pages, 18 Pages, 21 Pages, 25 Pages, 33 Pages, and 51 Pages
 */
export default function FullHoroscopeDossier({
  horoscope,
  dossierPages = 21,
  clientNotes = [],
  onAddNote = null,
  isAstrologer = false,
}) {
  const { lang: globalLang } = useLang();
  const [docLang, setDocLang] = useState(globalLang || 'ta');
  const [activePageIdx, setActivePageIdx] = useState('all'); // 'all' or page index number
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (globalLang) {
      setDocLang(globalLang);
    }
  }, [globalLang]);

  if (!horoscope) {
    return (
      <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-spin mb-3" />
        <p className="text-slate-600 text-sm font-medium">Computing complete Vedic horoscope dossier...</p>
      </div>
    );
  }

  const rawClient = horoscope?.client || {};
  const client = {
    ...rawClient,
    gender: (rawClient.gender || horoscope?.gender || 'male').toLowerCase(),
  };
  const {
    astrologicalDetails = {},
    nirayanaTable = [],
    southIndianRashiGrid = {},
    southIndianNavamshaGrid = {},
    southIndianDrekkanaGrid = {},
    bhavaSphutam = [],
    shadbalaPlanets = [],
    bhavaBalas = [],
    dashaVargas = [],
    vargaSubhaTotals = { subha: [5, 10, 8, 7, 8, 9, 5, 3, 2, 8], asubha: [5, 0, 2, 3, 2, 1, 5, 7, 8, 2], grandSubha: 65, grandAsubha: 35 },
    sarvashtakavarga = {},
    allMahadashas = [],
    numerology = {},
    shodashavargaCharts = [],
    upagrahasData = {},
    friendshipData = {},
    aspectAnglesData = {},
    pachakaBodhakaData = {},
    panchaPakshiData = {},
    chevvaiDoshaAnalysis = {},
    bhuktiAntaraData = [],
    ashtakavargaShodhanaData = [],
  } = horoscope;

  const handlePrint = () => {
    printElementById('printable-full-horoscope-dossier', `Dossier_${client?.name || 'Native'}_${dossierPages}P`);
  };

  // Helper to slice divisional chart pairs for 6 pages
  const getVarga = (code, fallbackName, fallbackTamil, fallbackPurpose, fallbackGrid) => {
    const found = shodashavargaCharts?.find((v) => v.code === code);
    if (found) return found;
    return { code, name: fallbackName, tamil: fallbackTamil, purpose: fallbackPurpose, grid: fallbackGrid };
  };

  const dCharts = shodashavargaCharts?.length >= 10 ? shodashavargaCharts : [
    getVarga('D3', 'Drekkana', '3-திரேக்காணம்', 'Siblings, Courage, Vitality', southIndianDrekkanaGrid),
    getVarga('D7', 'Saptamsha', '7-சப்தாம்சம்', 'Children, Progeny, Lineage', southIndianNavamshaGrid),
    getVarga('D60', 'Shashtiamsha', '60-ஷஷ்டியாம்சம்', 'Past Life Karma, Micro Precision', southIndianNavamshaGrid),
    getVarga('D30', 'Trimshamsha', '30-திரிம்சாம்சம்', 'Afflictions, Evils, Health Trials', southIndianRashiGrid),
    getVarga('D10', 'Dashamsha', '10-தசாம்சம்', 'Career, Profession, Social Status', southIndianRashiGrid),
    getVarga('D16', 'Shodashamsha', '16-சோடசாம்சம்', 'Vehicles, Luxuries, Inner Happiness', southIndianRashiGrid),
    getVarga('D4', 'Chaturthamsha', '4-சதுர்த்தாம்சம்', 'Property, Fixed Assets, Vehicles', southIndianRashiGrid),
    getVarga('D12', 'Dwadashamsha', '12-துவாதசாம்சம்', 'Parents, Lineage, Heritage', southIndianNavamshaGrid),
    getVarga('D2', 'Hora', 'ஹோரா சக்கரம்', 'Wealth, Assets, Prosperity', southIndianNavamshaGrid),
    getVarga('D20', 'Vimshamsha', '20-விம்சாம்சம்', 'Spiritual Pursuits, Divine Grace', southIndianNavamshaGrid),
  ];

  // =========================================================================
  // BUILD EXACT PAGES SEQUENCE BASED ON DOSSIER LENGTH (7, 18, 21, 25, 33, 51)
  // =========================================================================
  let pageItems = [];

  if (dossierPages === 7) {
    pageItems = [
      { id: 1, title: 'Cover Page', comp: <DossierCover client={client} pageNumber={1} totalPages={7} lang={docLang} /> },
      { id: 2, title: 'Rashi & Navamsha Charts', comp: <DossierCharts client={client} astrologicalDetails={astrologicalDetails} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} pageNumber={2} lang={docLang} /> },
      { id: 3, title: 'Nirayana Planetary Positions', comp: <DossierNirayana nirayanaTable={nirayanaTable} pageNumber={3} lang={docLang} /> },
      { id: 4, title: 'Dasha Varga System', comp: <DossierDashaVarga dashaVargas={dashaVargas} vargaSubhaTotals={vargaSubhaTotals} pageNumber={4} lang={docLang} /> },
      { id: 5, title: 'Sarvashtakavarga System', comp: <DossierSarvashtakavarga sarvashtakavarga={sarvashtakavarga} pageNumber={5} lang={docLang} /> },
      { id: 6, title: 'Mahadasha-Bhukti Lifespan Summary', comp: <DossierDashaBhuktiTable client={client} astrologicalDetails={astrologicalDetails} allMahadashas={allMahadashas} pageNumber={6} lang={docLang} /> },
      { id: 7, title: 'Chaldean Numerology', comp: <DossierNumerology client={client} numerology={numerology} pageNumber={7} lang={docLang} /> },
    ];
  } else if (dossierPages === 18) {
    pageItems = [
      { id: 1, title: 'Cover Page', comp: <DossierCover client={client} pageNumber={1} totalPages={18} lang={docLang} /> },
      { id: 2, title: 'Janana Vivaram (Part 1)', comp: <DossierJananaVivaramPart1 client={client} astrologicalDetails={astrologicalDetails} pageNumber={2} lang={docLang} /> },
      { id: 3, title: 'Janana Vivaram (Part 2 - Panchangam)', comp: <DossierJananaVivaramPart2 astrologicalDetails={astrologicalDetails} pageNumber={3} lang={docLang} /> },
      { id: 4, title: 'Rashi & Navamsha Charts', comp: <DossierCharts client={client} astrologicalDetails={astrologicalDetails} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} pageNumber={4} lang={docLang} /> },
      { id: 5, title: 'Nirayana Planetary Positions', comp: <DossierNirayana nirayanaTable={nirayanaTable} pageNumber={5} lang={docLang} /> },
      { id: 6, title: 'Bhava Sphutam & Drekkana', comp: <DossierBhavaSphutam client={client} planets={horoscope.planets || []} bhavaSphutam={bhavaSphutam} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} southIndianDrekkanaGrid={southIndianDrekkanaGrid} southIndianBhavaChalitGrid={horoscope.southIndianBhavaChalitGrid || {}} bhavaShiftsTa={horoscope.bhavaShiftsTa || astrologicalDetails?.bhavaShifts} bhavaShiftsEn={horoscope.bhavaShiftsEn || astrologicalDetails?.bhavaShiftsEn} pageNumber={6} lang={docLang} /> },
      { id: 7, title: 'Dasha Varga System', comp: <DossierDashaVarga dashaVargas={dashaVargas} vargaSubhaTotals={vargaSubhaTotals} pageNumber={7} lang={docLang} /> },
      ...allMahadashas.map((d, i) => ({
        id: 8 + i,
        title: `${translatePlanet(d.name || d.lord || d.tamilLord, docLang)} Mahadasha & Remedies`,
        comp: <DossierMahadashaRemedies dasha={d} pageNumber={8 + i} lang={docLang} />
      })),
      { id: 17, title: 'Sarvashtakavarga System', comp: <DossierSarvashtakavarga sarvashtakavarga={sarvashtakavarga} pageNumber={17} lang={docLang} /> },
      { id: 18, title: 'Chaldean Numerology', comp: <DossierNumerology client={client} numerology={numerology} pageNumber={18} lang={docLang} /> },
    ];
  } else if (dossierPages === 21) {
    pageItems = [
      { id: 1, title: 'Cover Page', comp: <DossierCover client={client} pageNumber={1} totalPages={21} lang={docLang} /> },
      { id: 2, title: 'Vinayakar Stuti', comp: <DossierVinayakarStuti pageNumber={2} lang={docLang} /> },
      { id: 3, title: 'Navagraha Stotram', comp: <DossierNavagrahaStotram pageNumber={3} lang={docLang} /> },
      { id: 4, title: 'Janana Vivaram (Part 1)', comp: <DossierJananaVivaramPart1 client={client} astrologicalDetails={astrologicalDetails} pageNumber={4} lang={docLang} /> },
      { id: 5, title: 'Janana Vivaram (Part 2 - Panchangam)', comp: <DossierJananaVivaramPart2 astrologicalDetails={astrologicalDetails} pageNumber={5} lang={docLang} /> },
      { id: 6, title: 'Rashi & Navamsha Charts', comp: <DossierCharts client={client} astrologicalDetails={astrologicalDetails} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} pageNumber={6} lang={docLang} /> },
      { id: 7, title: 'Nirayana Planetary Positions', comp: <DossierNirayana nirayanaTable={nirayanaTable} pageNumber={7} lang={docLang} /> },
      { id: 8, title: 'Bhava Sphutam & Drekkana', comp: <DossierBhavaSphutam client={client} planets={horoscope.planets || []} bhavaSphutam={bhavaSphutam} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} southIndianDrekkanaGrid={southIndianDrekkanaGrid} southIndianBhavaChalitGrid={horoscope.southIndianBhavaChalitGrid || {}} bhavaShiftsTa={horoscope.bhavaShiftsTa || astrologicalDetails?.bhavaShifts} bhavaShiftsEn={horoscope.bhavaShiftsEn || astrologicalDetails?.bhavaShiftsEn} pageNumber={8} lang={docLang} /> },
      { id: 9, title: 'Shadbala Strengths & Bhava Bala', comp: <DossierShadbala shadbalaPlanets={shadbalaPlanets} bhavaBalas={bhavaBalas} pageNumber={9} lang={docLang} /> },
      { id: 10, title: 'Dasha Varga System', comp: <DossierDashaVarga dashaVargas={dashaVargas} vargaSubhaTotals={vargaSubhaTotals} pageNumber={10} lang={docLang} /> },
      ...allMahadashas.map((d, i) => ({
        id: 11 + i,
        title: `${translatePlanet(d.name || d.lord || d.tamilLord, docLang)} Mahadasha & Remedies`,
        comp: <DossierMahadashaRemedies dasha={d} pageNumber={11 + i} lang={docLang} />
      })),
      { id: 20, title: 'Sarvashtakavarga System', comp: <DossierSarvashtakavarga sarvashtakavarga={sarvashtakavarga} pageNumber={20} lang={docLang} /> },
      { id: 21, title: 'Chaldean Numerology', comp: <DossierNumerology client={client} numerology={numerology} pageNumber={21} lang={docLang} /> },
    ];
  } else if (dossierPages === 25) {
    pageItems = [
      { id: 1, title: 'Cover Page', comp: <DossierCover client={client} pageNumber={1} totalPages={25} lang={docLang} /> },
      { id: 2, title: 'Navagraha Stotram', comp: <DossierNavagrahaStotram pageNumber={2} lang={docLang} /> },
      { id: 3, title: 'Vinayakar Stuti', comp: <DossierVinayakarStuti pageNumber={3} lang={docLang} /> },
      { id: 4, title: 'Janana Vivaram & Panchangam', comp: <DossierCombinedJananaVivaram client={client} astrologicalDetails={astrologicalDetails} pageNumber={4} lang={docLang} /> },
      { id: 5, title: 'Nirayana Planetary Positions', comp: <DossierNirayana nirayanaTable={nirayanaTable} pageNumber={5} lang={docLang} /> },
      { id: 6, title: 'Dasha Varga System', comp: <DossierDashaVarga dashaVargas={dashaVargas} vargaSubhaTotals={vargaSubhaTotals} pageNumber={6} lang={docLang} /> },
      { id: 7, title: 'Rashi & Navamsha Charts', comp: <DossierCharts client={client} astrologicalDetails={astrologicalDetails} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} pageNumber={7} lang={docLang} /> },
      { id: 8, title: 'Bhava Sphutam & Drekkana', comp: <DossierBhavaSphutam client={client} planets={horoscope.planets || []} bhavaSphutam={bhavaSphutam} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} southIndianDrekkanaGrid={southIndianDrekkanaGrid} southIndianBhavaChalitGrid={horoscope.southIndianBhavaChalitGrid || {}} bhavaShiftsTa={horoscope.bhavaShiftsTa || astrologicalDetails?.bhavaShifts} bhavaShiftsEn={horoscope.bhavaShiftsEn || astrologicalDetails?.bhavaShiftsEn} pageNumber={8} lang={docLang} /> },
      { id: 9, title: 'Shadbala Strengths & Bhava Bala', comp: <DossierShadbala shadbalaPlanets={shadbalaPlanets} bhavaBalas={bhavaBalas} pageNumber={9} lang={docLang} /> },
      { id: 10, title: 'Upagrahas (Mandhyadhi & Dhumyadhi)', comp: <DossierUpagrahas upagrahasData={upagrahasData} pageNumber={10} lang={docLang} /> },
      { id: 11, title: 'Naisargika & Tatkalika Friendships', comp: <DossierFriendships friendshipData={friendshipData} showPanchadha={false} pageNumber={11} lang={docLang} /> },
      { id: 12, title: 'Planetary Aspect Angles (0°-300°)', comp: <DossierAspectAngles aspectAnglesData={aspectAnglesData} isBhava={false} pageNumber={12} lang={docLang} /> },
      { id: 13, title: 'Rahu Mahadasha & Remedies', comp: <DossierMahadashaRemedies dasha={allMahadashas[0]} pageNumber={13} lang={docLang} /> },
      { id: 14, title: 'Mercury Mahadasha & Remedies', comp: <DossierMahadashaRemedies dasha={allMahadashas[3]} pageNumber={14} lang={docLang} /> },
      { id: 15, title: 'Sun Mahadasha & Remedies', comp: <DossierMahadashaRemedies dasha={allMahadashas[6]} pageNumber={15} lang={docLang} /> },
      { id: 16, title: 'Pachaka, Bodhaka, Karaka, Vedhaka', comp: <DossierPachakaBodhaka pachakaBodhakaData={pachakaBodhakaData} pageNumber={16} lang={docLang} /> },
      { id: 17, title: `${translatePlanet('rahu', docLang)} Dasha Bhukti-Antara Schedule`, comp: <DossierBhuktiAntara clientName={client.name} dashaTitle="Rahu" antaras={bhuktiAntaraData[0]?.antaras || []} pageNumber={17} lang={docLang} /> },
      { id: 18, title: `${translatePlanet('saturn', docLang)} Dasha Bhukti-Antara Schedule`, comp: <DossierBhuktiAntara clientName={client.name} dashaTitle="Saturn" antaras={bhuktiAntaraData[2]?.antaras || []} pageNumber={18} lang={docLang} /> },
      { id: 19, title: `${translatePlanet('ketu', docLang)} Dasha Bhukti-Antara Schedule`, comp: <DossierBhuktiAntara clientName={client.name} dashaTitle="Ketu" antaras={bhuktiAntaraData[4]?.antaras || []} pageNumber={19} lang={docLang} /> },
      { id: 20, title: `${translatePlanet('sun', docLang)} Dasha Bhukti-Antara Schedule`, comp: <DossierBhuktiAntara clientName={client.name} dashaTitle="Sun" antaras={bhuktiAntaraData[6]?.antaras || []} pageNumber={20} lang={docLang} /> },
      { id: 21, title: `${translatePlanet('sun', docLang)} Ashtakavarga Shodhana`, comp: <DossierAshtakavargaShodhana planetShodhana={ashtakavargaShodhanaData[0]} pageNumber={21} lang={docLang} /> },
      { id: 22, title: `${translatePlanet('mars', docLang)} Ashtakavarga Shodhana`, comp: <DossierAshtakavargaShodhana planetShodhana={ashtakavargaShodhanaData[2]} pageNumber={22} lang={docLang} /> },
      { id: 23, title: `${translatePlanet('jupiter', docLang)} Ashtakavarga Shodhana`, comp: <DossierAshtakavargaShodhana planetShodhana={ashtakavargaShodhanaData[4]} pageNumber={23} lang={docLang} /> },
      { id: 24, title: `${translatePlanet('saturn', docLang)} Ashtakavarga Shodhana`, comp: <DossierAshtakavargaShodhana planetShodhana={ashtakavargaShodhanaData[6]} pageNumber={24} lang={docLang} /> },
      { id: 25, title: 'Chaldean Numerology', comp: <DossierNumerology client={client} numerology={numerology} pageNumber={25} lang={docLang} /> },
    ];
  } else if (dossierPages === 33) {
    pageItems = [
      { id: 1, title: 'Cover Page', comp: <DossierCover client={client} pageNumber={1} totalPages={33} lang={docLang} /> },
      { id: 2, title: 'Vinayakar Stuti', comp: <DossierVinayakarStuti pageNumber={2} lang={docLang} /> },
      { id: 3, title: 'Navagraha Stotram', comp: <DossierNavagrahaStotram pageNumber={3} lang={docLang} /> },
      { id: 4, title: 'Janana Vivaram (Part 1)', comp: <DossierJananaVivaramPart1 client={client} astrologicalDetails={astrologicalDetails} pageNumber={4} lang={docLang} /> },
      { id: 5, title: 'Janana Vivaram (Part 2 - Panchangam)', comp: <DossierJananaVivaramPart2 astrologicalDetails={astrologicalDetails} pageNumber={5} lang={docLang} /> },
      { id: 6, title: 'Rashi & Navamsha Charts', comp: <DossierCharts client={client} astrologicalDetails={astrologicalDetails} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} pageNumber={6} lang={docLang} /> },
      { id: 7, title: 'Nirayana Planetary Positions', comp: <DossierNirayana nirayanaTable={nirayanaTable} pageNumber={7} lang={docLang} /> },
      // Pages 8-13: 6 Divisional Charts Pairs
      { id: 8, title: 'Divisional Charts (D3 Drekkana & D7 Saptamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[0], dCharts[1]]} pageNumber={8} lang={docLang} /> },
      { id: 9, title: 'Divisional Charts (D60 Shashtiamsha & D30 Trimshamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[2], dCharts[3]]} pageNumber={9} lang={docLang} /> },
      { id: 10, title: 'Divisional Charts (D10 Dashamsha & D16 Shodashamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[4], dCharts[5]]} pageNumber={10} lang={docLang} /> },
      { id: 11, title: 'Divisional Charts (D4 Chaturthamsha & D12 Dwadashamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[6], dCharts[7]]} pageNumber={11} lang={docLang} /> },
      { id: 12, title: 'Divisional Charts (D2 Hora & D20 Vimshamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[8], dCharts[9]]} pageNumber={12} lang={docLang} /> },
      { id: 13, title: 'Bhava Sphutam & Bhavaka Matram', comp: <DossierBhavaSphutam client={client} planets={horoscope.planets || []} bhavaSphutam={bhavaSphutam} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} southIndianDrekkanaGrid={southIndianDrekkanaGrid} southIndianBhavaChalitGrid={horoscope.southIndianBhavaChalitGrid || {}} bhavaShiftsTa={horoscope.bhavaShiftsTa || astrologicalDetails?.bhavaShifts} bhavaShiftsEn={horoscope.bhavaShiftsEn || astrologicalDetails?.bhavaShiftsEn} pageNumber={13} lang={docLang} /> },
      { id: 14, title: 'Dasha Varga System', comp: <DossierDashaVarga dashaVargas={dashaVargas} vargaSubhaTotals={vargaSubhaTotals} pageNumber={14} lang={docLang} /> },
      { id: 15, title: 'Planetary States & Kendram/Trikonam', comp: <DossierPlanetaryStates sarvashtakavarga={sarvashtakavarga} pageNumber={15} lang={docLang} /> },
      // Pages 16-24: 9 Mahadasha Bhukti-Antara Schedules
      ...allMahadashas.map((d, i) => ({
        id: 16 + i,
        title: `${translatePlanet(d.tamilLord || d.name, docLang)} Bhukti & Antara Schedule`,
        comp: <DossierBhuktiAntara clientName={client.name} dashaTitle={d.name || d.tamilLord || 'Rahu'} antaras={bhuktiAntaraData[i]?.antaras || []} pageNumber={16 + i} lang={docLang} />
      })),
      // Pages 25-31: 7 Planets Ashtakavarga Shodhana
      ...ashtakavargaShodhanaData.map((pl, i) => ({
        id: 25 + i,
        title: `${translatePlanet(pl.tamil || pl.name, docLang)} Ashtakavarga Shodhana`,
        comp: <DossierAshtakavargaShodhana planetShodhana={pl} pageNumber={25 + i} lang={docLang} />
      })),
      { id: 32, title: 'Sarvashtakavarga System', comp: <DossierSarvashtakavarga sarvashtakavarga={sarvashtakavarga} pageNumber={32} lang={docLang} /> },
      { id: 33, title: 'Chaldean Numerology', comp: <DossierNumerology client={client} numerology={numerology} pageNumber={33} lang={docLang} /> },
    ];
  } else {
    // 51 Pages - The Grand Vedic Encyclopedia Master Edition (Authentic Thirukanitha 51-Page Order)
    pageItems = [
      { id: 1, title: 'Cover Page', comp: <DossierCover client={client} pageNumber={1} totalPages={51} lang={docLang} /> },
      { id: 2, title: 'Vinayakar Stuti & Navagraha Stotram', comp: <DossierCombinedStutis pageNumber={2} lang={docLang} /> },
      { id: 3, title: 'Janana Vivaram (Part 1)', comp: <DossierJananaVivaramPart1 client={client} astrologicalDetails={astrologicalDetails} pageNumber={3} lang={docLang} /> },
      { id: 4, title: 'Janana Vivaram (Part 2 - Panchangam)', comp: <DossierJananaVivaramPart2 astrologicalDetails={astrologicalDetails} pageNumber={4} lang={docLang} /> },
      { id: 5, title: 'Rashi & Navamsha Charts', comp: <DossierCharts client={client} astrologicalDetails={astrologicalDetails} southIndianRashiGrid={southIndianRashiGrid} southIndianNavamshaGrid={southIndianNavamshaGrid} pageNumber={5} lang={docLang} /> },
      { id: 6, title: 'Nirayana Planetary Positions', comp: <DossierNirayana nirayanaTable={nirayanaTable} pageNumber={6} lang={docLang} /> },
      // Page 7: Sripati Bhava Sphutam, 4 Mini Charts (Rashi, Navamsha, Drekkana, Bhava Chalit) & Bhava Shifts
      {
        id: 7,
        title: 'Bhava Sphutam & Bhavaka Matram',
        comp: (
          <DossierBhavaSphutam
            client={client}
            planets={horoscope.planets || []}
            bhavaSphutam={bhavaSphutam}
            southIndianRashiGrid={southIndianRashiGrid}
            southIndianNavamshaGrid={southIndianNavamshaGrid}
            southIndianDrekkanaGrid={southIndianDrekkanaGrid}
            southIndianBhavaChalitGrid={horoscope.southIndianBhavaChalitGrid || {}}
            bhavaShiftsTa={horoscope.bhavaShiftsTa || astrologicalDetails?.bhavaShifts}
            bhavaShiftsEn={horoscope.bhavaShiftsEn || astrologicalDetails?.bhavaShiftsEn}
            pageNumber={7}
            lang={docLang}
          />
        )
      },
      // Pages 8-12: 5 Divisional Charts Pairs
      { id: 8, title: 'Divisional Charts (D3 Drekkana & D7 Saptamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[0], dCharts[1]]} pageNumber={8} lang={docLang} /> },
      { id: 9, title: 'Divisional Charts (D60 Shashtiamsha & D30 Trimshamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[2], dCharts[3]]} pageNumber={9} lang={docLang} /> },
      { id: 10, title: 'Divisional Charts (D10 Dashamsha & D16 Shodashamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[4], dCharts[5]]} pageNumber={10} lang={docLang} /> },
      { id: 11, title: 'Divisional Charts (D4 Chaturthamsha & D12 Dwadashamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[6], dCharts[7]]} pageNumber={11} lang={docLang} /> },
      { id: 12, title: 'Divisional Charts (D2 Hora & D20 Vimshamsha)', comp: <DossierDivisionalCharts chartPair={[dCharts[8], dCharts[9]]} pageNumber={12} lang={docLang} /> },
      { id: 13, title: 'Shadbala Strengths & Bhava Bala', comp: <DossierShadbala shadbalaPlanets={shadbalaPlanets} bhavaBalas={bhavaBalas} pageNumber={13} lang={docLang} /> },
      { id: 14, title: 'Upagrahas (Mandhyadhi & Dhumyadhi)', comp: <DossierUpagrahas upagrahasData={upagrahasData} pageNumber={14} lang={docLang} /> },
      { id: 15, title: 'Special Lagnas & Significant Sphutams', comp: <DossierSpecialLagnas upagrahasData={upagrahasData} pageNumber={15} lang={docLang} /> },
      { id: 16, title: 'Naisargika & Tatkalika Friendships', comp: <DossierFriendships friendshipData={friendshipData} showPanchadha={false} pageNumber={16} lang={docLang} /> },
      { id: 17, title: 'Panchadha Maitri & Planetary Avasthe', comp: <DossierFriendships friendshipData={friendshipData} showPanchadha={true} pageNumber={17} lang={docLang} /> },
      { id: 18, title: 'Planetary Aspect Angles (0°-300°)', comp: <DossierAspectAngles aspectAnglesData={aspectAnglesData} isBhava={false} pageNumber={18} lang={docLang} /> },
      { id: 19, title: 'Bhava-Graha Aspect Angles Matrix', comp: <DossierAspectAngles aspectAnglesData={aspectAnglesData} isBhava={true} pageNumber={19} lang={docLang} /> },
      { id: 20, title: 'Dasha Varga System & Strengths', comp: <DossierDashaVarga dashaVargas={dashaVargas} vargaSubhaTotals={vargaSubhaTotals} pageNumber={20} lang={docLang} /> },
      { id: 21, title: 'Pancha Pakshi Sastra Analysis', comp: <DossierPanchaPakshi panchaPakshiData={panchaPakshiData} pageNumber={21} lang={docLang} /> },
      // Pages 22-30: 9 Mahadasha Sacred Shrines & Remedies
      ...allMahadashas.map((d, i) => ({
        id: 22 + i,
        title: `${translatePlanet(d.tamilLord || d.name, docLang)} Mahadasha & Pilgrimage Shrine`,
        comp: <DossierMahadashaRemedies dasha={d} pageNumber={22 + i} lang={docLang} />
      })),
      { id: 31, title: 'Pachaka, Bodhaka, Karaka, Vedhaka & Tara Bala', comp: <DossierPachakaBodhaka pachakaBodhakaData={pachakaBodhakaData} pageNumber={31} lang={docLang} /> },
      { id: 32, title: 'Planetary States & Kendram/Trikonam', comp: <DossierPlanetaryStates sarvashtakavarga={sarvashtakavarga} pageNumber={32} lang={docLang} /> },
      { id: 33, title: 'Chevvai Dosha (Manglik) Comprehensive Analysis', comp: <DossierChevvaiDosha chevvaiDoshaAnalysis={chevvaiDoshaAnalysis} pageNumber={33} lang={docLang} /> },
      // Pages 34-42: 9 Mahadasha Bhukti-Antara Schedules
      ...allMahadashas.map((d, i) => ({
        id: 34 + i,
        title: `${translatePlanet(d.tamilLord || d.name, docLang)} Bhukti & Antara Schedule (365.25 Days)`,
        comp: <DossierBhuktiAntara clientName={client.name} dashaTitle={d.name || d.tamilLord || 'Rahu'} antaras={bhuktiAntaraData[i]?.antaras || []} pageNumber={34 + i} lang={docLang} />
      })),
      // Pages 43-49: 7 Planets Ashtakavarga Shodhana
      ...ashtakavargaShodhanaData.map((pl, i) => ({
        id: 43 + i,
        title: `${translatePlanet(pl.tamil || pl.name, docLang)} Ashtakavarga Shodhana`,
        comp: <DossierAshtakavargaShodhana planetShodhana={pl} pageNumber={43 + i} lang={docLang} />
      })),
      { id: 50, title: 'Sarvashtakavarga 337-Point System', comp: <DossierSarvashtakavarga sarvashtakavarga={sarvashtakavarga} pageNumber={50} lang={docLang} /> },
      { id: 51, title: 'Chaldean Numerology & Sacred Factors', comp: <DossierNumerology client={client} numerology={numerology} pageNumber={51} lang={docLang} /> },
    ];
  }

  // Filter pages for view
  const visiblePages = activePageIdx === 'all'
    ? pageItems
    : pageItems.filter(p => p.id === activePageIdx);

  return (
    <div className="space-y-4 print:space-y-0">
      {/* Top Controls Toolbar (Hidden in print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs print:hidden space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-800 rounded-xl">
              <BookOpen className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>Vedic Janma Patrika Dossier</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {dossierPages} Pages Edition
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Native: <strong className="text-slate-900">{client.name || 'Sample'}</strong> • Certified Thirukanitha Standard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Pure Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { code: 'en', label: 'English' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'te', label: 'తెలుగు' },
              ].map((l) => (
                <button
                  key={l.code}
                  data-dossier-lang={l.code}
                  onClick={() => setDocLang(l.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    docLang === l.code ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save {dossierPages}-Page PDF</span>
            </button>
          </div>
        </div>

        {/* Page Jump Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-2">
          <button
            onClick={() => setActivePageIdx('all')}
            className={`px-3 py-1 rounded-lg font-bold shrink-0 cursor-pointer transition-all ${
              activePageIdx === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All {dossierPages} Pages
          </button>
          {pageItems.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePageIdx(p.id)}
              className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer transition-all ${
                activePageIdx === p.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              P{p.id}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER PAGES */}
      <div id="printable-full-horoscope-dossier" className="space-y-8 print:space-y-0 max-w-4xl mx-auto">
        {visiblePages.map((page) => (
          <div key={page.id} className="print-page">
            {page.comp}
          </div>
        ))}
      </div>

      {/* Astrologer Consultation Notes Section (Visible on screen, hidden in print) */}
      {isAstrologer && onAddNote && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs print:hidden space-y-4 max-w-4xl mx-auto">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Astrologer Confidential Consultation Diary & Prescribed Remedies</span>
          </h4>

          {clientNotes && clientNotes.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {clientNotes.map((note) => (
                <div key={note.id} className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] mb-1">
                    <span className="font-semibold text-slate-700">{note.astrologerName || 'Astrologer'}</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800">{note.noteText}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record confidential observation, birth time rectification note, or gemstone prescription..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => {
                if (newNote.trim()) {
                  onAddNote(newNote.trim());
                  setNewNote('');
                }
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 cursor-pointer"
            >
              Add Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
