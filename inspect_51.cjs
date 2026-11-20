const fs = require('fs');
const content = fs.readFileSync('frontend/src/components/HoroscopeBooklet51PageView.jsx', 'utf-8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<CoverPage') || l.includes('Page ') || l.includes('PAGE_DEFS =') || l.includes('pageNumber={')) {
    console.log((i+1) + ': ' + l.trim().substring(0, 100));
  }
});
