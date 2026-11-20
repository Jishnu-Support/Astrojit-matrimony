const fs = require('fs');
const content = fs.readFileSync('frontend/src/components/HoroscopeBookletPages.jsx', 'utf-8');

const comps = [
  'Divisional2ChartPage',
  'HoraChartPage',
  'ShadbalaPage',
  'UpagrahasTablePage14',
  'SpecialLagnasPage15',
  'RelationshipsPage16',
  'PanchadhaAvasthasPage17',
  'AspectAnglesMatrixPage18',
  'BhavaAspectAnglesMatrixPage19',
  'DasavargaPage',
  'PanchaPakshiPage21',
  'MahadashaPage',
  'PasakarTaraPage31',
  'PlanetaryDignitiesAspectsPage',
  'SevvaiDoshaPage33',
  'FullDashaAntaraPage',
  'BavSingleFullPage',
  'SarvashtavargaPage',
  'NumerologyPage'
];

comps.forEach(comp => {
  const idx = content.indexOf(`export const ${comp}`);
  if (idx !== -1) {
    console.log(`\n=================== ${comp} ===================`);
    console.log(content.substring(idx, idx + 600));
  }
});
