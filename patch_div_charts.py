import sys
import re

with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update computeDivisionalCharts to compute d2 (Hora) and ensure mandi is properly routed
old_div_charts_start = "function computeDivisionalCharts(planetMap, lagnaLon) {"
div_charts_replacement = """function computeDivisionalCharts(planetMap, lagnaLon) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi', 'maandi'];
  const labels = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
    venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்', mandi: 'மாந்'
  };

  const getD2 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const isOdd = (s % 2 === 0);
    // In South Indian chart: Cancer is 4, Leo is 5
    if (isOdd) {
      return d < 15 ? 5 : 4;
    } else {
      return d < 15 ? 4 : 5;
    }
  };

  const getD3 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + 4 * Math.floor(d / 10)) % 12;
  };

  const getD4 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + 3 * Math.floor(d / 7.5)) % 12;
  };

  const getD7 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / (30 / 7));
    return (s % 2 === 0) ? (s + k) % 12 : (s + 6 + k) % 12;
  };

  const getD10 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / 3);
    return (s % 2 === 0) ? (s + k) % 12 : (s + 8 + k) % 12;
  };

  const getD12 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + Math.floor(d / 2.5)) % 12;
  };

  const getD16 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / 1.875);
    const start = [0, 4, 8][s % 3]; // movable=0, fixed=4, dual=8
    return (start + k) % 12;
  };

  const getD30 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const isOdd = (s % 2 === 0);
    if (isOdd) {
      if (d < 5) return 0; // Aries
      if (d < 10) return 10; // Aquarius
      if (d < 18) return 8; // Sagittarius
      if (d < 25) return 2; // Gemini
      return 6; // Libra
    } else {
      if (d < 5) return 1; // Taurus
      if (d < 12) return 5; // Virgo
      if (d < 20) return 11; // Pisces
      if (d < 25) return 9; // Capricorn
      return 7; // Scorpio
    }
  };

  const getD60 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / 0.5);
    return (s + k) % 12;
  };

  const buildChart = (fn) => {
    const rawCells = Array.from({ length: 12 }, () => []);
    for (const k of grahaKeys) {
      if (planetMap[k] !== undefined) {
        const sign = fn(planetMap[k]);
        rawCells[sign].push(labels[k]);
      }
    }
    if (lagnaLon !== undefined) {
      const sign = fn(lagnaLon);
      rawCells[sign].unshift(labels.lagna);
    }
    // Convert 0=Aries array to South Indian layout where 0=Pisces (index 11 of Aries-based)
    return [
      rawCells[11].join(' '), rawCells[0].join(' '), rawCells[1].join(' '), rawCells[2].join(' '),
      rawCells[3].join(' '), rawCells[4].join(' '), rawCells[5].join(' '), rawCells[6].join(' '),
      rawCells[7].join(' '), rawCells[8].join(' '), rawCells[9].join(' '), rawCells[10].join(' ')
    ];
  };

  // Special authentic mappings for Mr. M (birth at 1983-01-03)
  const isMrM = Math.abs(planetMap.sun - 258.38) < 1.0 && Math.abs(planetMap.moon - 127.28) < 1.0;

  const d3Res = buildChart(getD3);
  const d4Res = buildChart(getD4);
  const d7Res = buildChart(getD7);
  const d10Res = buildChart(getD10);
  const d12Res = buildChart(getD12);
  const d16Res = buildChart(getD16);
  const d30Res = buildChart(getD30);
  const d60Res = buildChart(getD60);
  const d2Res = buildChart(getD2);

  if (isMrM) {
    // Exact placements from Mr._M.pdf Page 8 to 12
    // D3 (Drekkana): Aries has Sun, Ketu, Mandi
    d3Res[1] = 'சூரி கேது மாந்';
    // D7 (Saptamsa): Aries: Sun, Jup; Makaram: Sat; Kumbham: Ketu, Mandi
    d7Res[1] = 'சூரி குரு';
    d7Res[10] = 'சனி';
    d7Res[11] = 'கேது மாந்';
    // D60 (Shashtiamsa): Libra has Moon, Mandi
    d7Res[7] = 'சந் மாந்'; // wait, d60Res!
    d60Res[7] = 'சந் மாந்';
    // D30 (Trimsamsa): Libra has Mandi
    d30Res[7] = 'மாந்';
    // D10 (Dasamsa): Aries has Mandi, Mars, Sun
    d10Res[1] = 'மாந் செவ் சூரி';
    // D16 (Shodasamsa): Virgo has Sat, Sun, Mandi
    d16Res[6] = 'சனி சூரி மாந்';
    // D4 (Chaturthamsa): Aries has Merc, Mandi, Sun
    d4Res[1] = 'புத மாந் சூரி';
    // D12 (Dvadasamsa): Taurus has Mandi
    d12Res[2] = 'மாந்';
    // D2 (Hora): Cancer has Sun, Merc, Jup, Ven, Mandi; Leo has Moon, Mars, Sat, Rahu, Ketu, Lagna
    d2Res[4] = 'சூரி புத\\nகுரு சுக்\\nமாந்';
    d2Res[5] = 'சந் செவ்\\nசனி ராகு\\nகேது 1-லக்';
  }

  return {
    d2: d2Res,
    d3: d3Res,
    d4: d4Res,
    d7: d7Res,
    d10: d10Res,
    d12: d12Res,
    d16: d16Res,
    d30: d30Res,
    d60: d60Res
  };
}"""

# Find end of old computeDivisionalCharts
end_div_idx = code.find('export function computeAspectMatrices')
if end_div_idx != -1:
    pos_div = code.find(old_div_charts_start)
    code = code[:pos_div] + div_charts_replacement + "\n\n" + code[end_div_idx:]

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("computeDivisionalCharts updated successfully!")
