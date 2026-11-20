const fs = require('fs');
const content = fs.readFileSync('frontend/src/components/HoroscopeBookletPages.jsx', 'utf-8');

const components = [
  'Divisional2ChartPage',
  'HoraChartPage',
  'ShadbalaPage',
  'UpagrahasTablePage14',
  'SpecialLagnasPage15',
  'RelationshipsPage16',
  'PanchadhaAvasthasPage17',
  'AspectAnglesMatrixPage18',
  'BhavaAspectAnglesMatrixPage19',
  'MahadashaPage',
  'PasakarTaraPage31',
  'PlanetaryDignitiesAspectsPage',
  'SevvaiDoshaPage33',
  'FullDashaAntaraPage',
  'BavSingleFullPage',
  'SarvashtavargaPage',
  'NumerologyPage'
];

components.forEach(comp => {
  const idx = content.indexOf(`export function ${comp}`);
  if (idx !== -1) {
    console.log(`=== ${comp} ===`);
    console.log(content.substring(idx, idx + 400));
  } else {
    console.log(`MISSING: ${comp}`);
  }
});
