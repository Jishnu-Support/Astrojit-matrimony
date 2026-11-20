const fs = require('fs');

const files = [
  'frontend/public/horoscope_pager.html',
  'horoscope_pager.html',
  'frontend/public/horoscope_booklet_7page.html',
  'horoscope_booklet_7page.html',
  'frontend/public/horoscope_booklet_18page.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');

  // Input value attributes
  c = c.split('value="ஆரவ் குமார் (Aarav Kumar)"').join('value="" placeholder="பெயர் உள்ளிடவும்"');
  c = c.split('value="2026-11-05"').join('value=""');
  c = c.split('value="09:04:00 PM"').join('value="" placeholder="12:00:00 AM"');
  c = c.split('value="ரமேஷ் குமார்"').join('value="" placeholder="தந்தை பெயர்"');
  c = c.split('value="பிரியா"').join('value="" placeholder="தாய் பெயர்"');
  c = c.split('value="சேலம் (Salem)"').join('value="" placeholder="சொந்த ஊர்"');

  // JS variables
  c = c.split("name = document.getElementById('inp-name').value || 'ஆரவ் குமார்'").join("name = document.getElementById('inp-name').value || ''");
  c = c.split("dob = document.getElementById('inp-dob').value || '2026-11-05'").join("dob = document.getElementById('inp-dob').value || ''");
  c = c.split("time12 = document.getElementById('inp-time12').value || '09:04:00 PM'").join("time12 = document.getElementById('inp-time12').value || ''");
  c = c.split("father = document.getElementById('inp-father').value || 'ரமேஷ் குமார்'").join("father = document.getElementById('inp-father').value || ''");
  c = c.split("mother = document.getElementById('inp-mother').value || 'பிரியா'").join("mother = document.getElementById('inp-mother').value || ''");

  // Object fields
  c = c.split("name: 'ஆரவ் குமார் (Aarav Kumar)'").join("name: ''");
  c = c.split("father: 'ரமேஷ் குமார்'").join("father: ''");
  c = c.split("mother: 'பிரியா'").join("mother: ''");

  fs.writeFileSync(f, c, 'utf8');
  console.log('Successfully cleaned ' + f);
});
