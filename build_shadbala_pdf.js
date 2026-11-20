const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8">
  <title>Shadbala & Bhava Bala Calculation Formulas Manual</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Serif+Tamil:wght@400;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm 12mm 15mm 12mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Cinzel', serif;
        font-size: 9pt;
        color: #7A1A22;
      }
      @bottom-left {
        content: "வேத ஜோதிட ஷட்பலம் & பாவக பலம் கணித சூத்திரங்கள் • Astrojit Platform";
        font-family: 'Noto Serif Tamil', serif;
        font-size: 8pt;
        color: #786C64;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Source Serif 4', 'Noto Serif Tamil', Georgia, serif;
      font-size: 9pt;
      line-height: 1.45;
      color: #231C18;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }

    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 94vh;
      border: 3px double #7A1A22;
      padding: 35px 25px;
      background: radial-gradient(circle, #FCFBF8 0%, #F5EFEB 100%);
      position: relative;
    }

    .cover-border-inner {
      border: 1px solid #D4AF37;
      padding: 30px 20px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .om-symbol {
      font-size: 34pt;
      color: #7A1A22;
      margin-bottom: 5px;
    }

    .sloka {
      font-style: italic;
      color: #7A1A22;
      font-size: 10pt;
      margin: 10px 0 20px 0;
      line-height: 1.6;
    }

    h1.doc-title-ta {
      font-family: 'Noto Serif Tamil', serif;
      font-size: 19pt;
      font-weight: 800;
      color: #7A1A22;
      margin: 0 0 8px 0;
      letter-spacing: 0.5px;
    }

    h2.doc-title-en {
      font-family: 'Cinzel', serif;
      font-size: 14pt;
      font-weight: 700;
      color: #8C6D23;
      margin: 0 0 15px 0;
      letter-spacing: 1px;
    }

    .doc-subtitle {
      font-size: 10.5pt;
      color: #4A3E38;
      max-width: 550px;
      margin: 0 auto 25px auto;
      line-height: 1.5;
    }

    .badge-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 25px;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border: 1px solid #7A1A22;
      background-color: #FAF4EF;
      color: #7A1A22;
      font-size: 8.5pt;
      font-weight: 600;
      border-radius: 4px;
    }

    .page-break {
      page-break-after: always;
    }

    .section-container {
      margin-bottom: 18px;
    }

    .sec-header {
      background: linear-gradient(90deg, #7A1A22 0%, #9B2C35 100%);
      color: #FFFFFF;
      padding: 6px 12px;
      font-family: 'Noto Serif Tamil', serif;
      font-size: 11.5pt;
      font-weight: 700;
      border-radius: 4px;
      margin-top: 15px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sec-header span.en-title {
      font-family: 'Cinzel', serif;
      font-size: 9.5pt;
      font-weight: 600;
      color: #F8E5B8;
    }

    .sub-header {
      color: #7A1A22;
      font-size: 10pt;
      font-weight: 700;
      border-bottom: 1.5px solid #D4AF37;
      padding-bottom: 3px;
      margin: 12px 0 6px 0;
    }

    .formula-box {
      background-color: #FAF6F0;
      border-left: 4px solid #7A1A22;
      border-right: 1px solid #E5D8C8;
      border-top: 1px solid #E5D8C8;
      border-bottom: 1px solid #E5D8C8;
      padding: 8px 12px;
      margin: 8px 0;
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      color: #382418;
      border-radius: 0 4px 4px 0;
    }

    .formula-box .math {
      font-weight: 700;
      color: #7A1A22;
      font-size: 9.5pt;
      display: block;
      margin-bottom: 3px;
    }

    .formula-box .desc {
      font-family: 'Source Serif 4', 'Noto Serif Tamil', Georgia, serif;
      font-size: 8pt;
      color: #5C4A3E;
    }

    .bilingual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 8px 0;
    }

    .bi-card {
      background: #FFFFFF;
      border: 1px solid #E6DCD2;
      border-radius: 4px;
      padding: 8px 10px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }

    .bi-card-title-ta {
      font-weight: 700;
      color: #7A1A22;
      font-size: 9pt;
      margin-bottom: 4px;
      border-bottom: 1px dashed #D4AF37;
      padding-bottom: 2px;
    }

    .bi-card-title-en {
      font-weight: 600;
      color: #8C6D23;
      font-size: 8.5pt;
      margin-bottom: 4px;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin: 8px 0 12px 0;
      text-align: center;
    }

    table.data-table th {
      background-color: #F4EBE1;
      color: #7A1A22;
      font-weight: 700;
      border: 1px solid #B89E88;
      padding: 4px 6px;
    }

    table.data-table td {
      border: 1px solid #D8C8B8;
      padding: 3.5px 5px;
    }

    table.data-table tr:nth-child(even) {
      background-color: #FAF7F2;
    }

    table.data-table td.highlight {
      font-weight: 700;
      color: #7A1A22;
      background-color: #FDF1E2;
    }

    .note-box {
      background-color: #FFFDF8;
      border: 1px dashed #D4AF37;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 8pt;
      color: #614D38;
      margin: 8px 0;
    }

    .unit-pill {
      display: inline-block;
      padding: 1px 6px;
      background: #7A1A22;
      color: #FFF;
      font-size: 7.5pt;
      border-radius: 3px;
      margin-left: 5px;
    }

    .page-footer {
      font-size: 7.5pt;
      color: #8A7B70;
      text-align: center;
      border-top: 1px solid #E5D8C8;
      padding-top: 4px;
      margin-top: 15px;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-border-inner">
      <div>
        <div class="om-symbol">ॐ</div>
        <div class="sloka">
          "கிரஹாணாம் பலமறிந்து பலன் சொல்ல வேண்டும்..."<br>
          <i>Grahāṇāṁ balam vijñāya phalam brūyād vicakṣaṇaḥ |<br>
          Balāhīnā grahā sarve niṣphalāḥ syur na saṁśayaḥ ||</i>
        </div>
      </div>

      <div>
        <h1 class="doc-title-ta">வேத ஜோதிட ஷட்பலம் & பாவக பலம் கணித சூத்திரங்கள்</h1>
        <h2 class="doc-title-en">MATHEMATICAL FORMULAS & COMPUTATION MANUAL FOR SHADBALA & BHAVA BALA</h2>
        <div class="doc-subtitle">
          பராசர ஹோரா சாஸ்திர முறைப்படியான கிரகங்களின் அறுவகை பலங்கள் மற்றும் 12 பாவக பலங்களின் துல்லியமான கணித விளக்கக் கையேடு (தமிழ் மற்றும் ஆங்கில வடிவில்).
          <br><br>
          <i>An Authoritative Mathematical & Classical Guide as per Brihat Parashara Hora Shastra in Tamil & English.</i>
        </div>

        <div class="badge-bar">
          <span class="badge">பராசரர் முறை / Parashari</span>
          <span class="badge">ரூபங்கள் & விருபங்கள் / Rupas & Virupas</span>
          <span class="badge">துல்லிய தசாமிசம் / 3-Decimal Precision</span>
        </div>
      </div>

      <div>
        <div style="font-size: 9pt; color: #5C4A3E; font-weight: 600;">
          வெளியீடு: அஸ்ட்ரோஜித் ஜோதிட தளம் • ASTROJIT VEDIC PLATFORM
        </div>
        <div style="font-size: 8pt; color: #8A7B70; margin-top: 4px;">
          பதிப்பு: 2026-2027 • Standard Research Edition
        </div>
      </div>
    </div>
  </div>

  <!-- PAGE 1: INTRODUCTION & STHANA BALA -->
  <div class="section-container">
    <div class="sec-header">
      <span>1. முன்னுரை & அடிப்படை அளவீடு</span>
      <span class="en-title">1. Introduction & Units of Measurement</span>
    </div>

    <div class="bilingual-grid">
      <div class="bi-card">
        <div class="bi-card-title-ta">ஷட்பலம் என்றால் என்ன?</div>
        <p>
          வேத ஜோதிடத்தில் ஒரு கிரகம் ஜாதகருக்கு சுப பலன்களையோ அல்லது அசுப பலன்களையோ வழங்கும் திறனை அளவிடும் முறையே <b>ஷட்பலம் (Shadbala)</b> ஆகும். 'ஷட்' என்றால் ஆறு; ஆறு வெவ்வேறு கோணங்களில் கிரகத்திற்கு கிடைக்கும் பலங்களை கணக்கிட்டு மொத்த பலன் அறியப்படுகிறது.
        </p>
        <p>
          <b>அடிப்படை அளவு:</b> பலங்கள் <b>விருபங்கள் (Virupas)</b> மற்றும் <b>ரூபங்களில் (Rupas)</b> அளவிடப்படுகின்றன.<br>
          <b>1 ரூபம் = 60 விருபங்கள் (1 Rupa = 60 Virupas).</b>
        </p>
      </div>

      <div class="bi-card">
        <div class="bi-card-title-en">What is Shadbala?</div>
        <p>
          In Vedic astrology, <b>Shadbala</b> refers to the six-fold source of planetary strength propounded by Maharishi Parashara in <i>Brihat Parashara Hora Shastra (BPHS)</i>. It accurately gauges a planet's actual power to deliver its promised results.
        </p>
        <p>
          <b>Fundamental Units:</b> Strength is originally quantified in <b>Virupas</b>, and represented in <b>Rupas</b>.<br>
          <b>1 Rupa = 60 Virupas.</b> (1 Virupa = 1/60 Rupa &approx; 0.01667 Rupa).
        </p>
      </div>
    </div>

    <div class="sec-header">
      <span>2. ஸ்தான பலம் (Positional Strength)</span>
      <span class="en-title">2. Sthana Bala (5 Sub-Components)</span>
    </div>

    <p style="margin-bottom: 6px;">
      ஸ்தான பலம் என்பது ஒரு கிரகம் ராசி மண்டலத்தில் நிற்கும் ராசி, பாகை, கேந்திர நிலை மற்றும் வர்க்க நிலைகளால் பெறும் பலமாகும். இதில் 5 உட்பிரிவுகள் உள்ளன:
    </p>

    <div class="sub-header">2.1 உச்ச பலம் (Uchcha Bala - Exaltation Strength)</div>
    <div class="formula-box">
      <span class="math">உச்ச பலம் (Virupas) = | கிரகம் நின்ற பாகை - பரம நீச பாகை | &divide; 3</span>
      <span class="desc">
        If (|&lambda; - &lambda;<sub>Debilitation</sub>| > 180&deg;), then use (360&deg; - difference) &divide; 3.<br>
        பரமோச்ச பாகையில் 60 விருபங்கள் (1.000 ரூபம்); பரம நீச பாகையில் 0 விருபங்கள்.
      </span>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>கிரகம் (Planet)</th>
          <th>பரமோச்ச ராசி & பாகை (Deep Exaltation)</th>
          <th>நீச ராசி & பாகை (Deep Debilitation)</th>
          <th>உச்ச பாகை (&lambda;<sub>Exalt</sub>)</th>
          <th>நீச பாகை (&lambda;<sub>Debil</sub>)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியன் (Sun)</td><td>மேஷம் 10&deg; (Aries)</td><td>துலாம் 10&deg; (Libra)</td><td>10&deg;</td><td>190&deg;</td></tr>
        <tr><td>சந்திரன் (Moon)</td><td>ரிஷபம் 3&deg; (Taurus)</td><td>விருச்சிகம் 3&deg; (Scorpio)</td><td>33&deg;</td><td>213&deg;</td></tr>
        <tr><td>செவ்வாய் (Mars)</td><td>மகரம் 28&deg; (Capricorn)</td><td>கடகம் 28&deg; (Cancer)</td><td>298&deg;</td><td>118&deg;</td></tr>
        <tr><td>புதன் (Mercury)</td><td>கன்னி 15&deg; (Virgo)</td><td>மீனம் 15&deg; (Pisces)</td><td>165&deg;</td><td>345&deg;</td></tr>
        <tr><td>குரு (Jupiter)</td><td>கடகம் 5&deg; (Cancer)</td><td>மகரம் 5&deg; (Capricorn)</td><td>95&deg;</td><td>275&deg;</td></tr>
        <tr><td>சுக்கிரன் (Venus)</td><td>மீனம் 27&deg; (Pisces)</td><td>கன்னி 27&deg; (Virgo)</td><td>357&deg;</td><td>177&deg;</td></tr>
        <tr><td>சனி (Saturn)</td><td>துலாம் 20&deg; (Libra)</td><td>மேஷம் 20&deg; (Aries)</td><td>200&deg;</td><td>20&deg;</td></tr>
      </tbody>
    </table>

    <div class="sub-header">2.2 சப்தவர்க்கஜ பலம் (Saptavargaja Bala - Seven Varga Strength)</div>
    <p style="font-size: 8.5pt;">
      கிரகங்கள் 7 முக்கிய வர்க்க சக்கரங்களில் (D1 ராசி, D2 ஹோரா, D3 திரேக்காணம், D7 சப்தாம்சம், D9 நவாம்சம், D12 துவாதசாம்சம், D30 திரிம்சாம்சம்) பஞ்சதா மைத்ரி அடிப்படையில் பெறும் பலம்:
    </p>
    <div class="formula-box">
      <span class="math">சப்தவர்க்கஜ பலம் = &sum; (7 வர்க்கங்களில் கிடைக்கும் மதிப்புகள்)</span>
      <span class="desc">
        • மூலத்திரிகோணம் (Moolatrikona): <b>45.0 Virupas</b> (0.750 Rupa)<br>
        • ஆட்சி / சுவக்ஷேத்திரம் (Own Sign): <b>30.0 Virupas</b> (0.500 Rupa)<br>
        • அதிமித்ரு வீடு (Great Friend): <b>20.0 Virupas</b> (0.333 Rupa)<br>
        • மித்ரு வீடு (Friend Sign): <b>15.0 Virupas</b> (0.250 Rupa)<br>
        • சம வீடு (Neutral Sign): <b>10.0 Virupas</b> (0.167 Rupa)<br>
        • சத்ரு வீடு (Enemy Sign): <b>3.75 Virupas</b> (0.063 Rupa)<br>
        • அதிசத்ரு வீடு (Great Enemy): <b>1.875 Virupas</b> (0.031 Rupa)
      </span>
    </div>

    <div class="sub-header">2.3 ஓஜ-யுக்ம ராசியாம்ச பலம் (Ojhayugma Bala - Odd/Even Sign & Navamsa)</div>
    <div class="formula-box">
      <span class="math">ஓஜ-யுக்ம பலம் = ராசி பலம் + நவாம்ச பலம் (அதிகபட்சம் 30 விருபங்கள்)</span>
      <span class="desc">
        • பெண் கிரகங்கள் (சந்திரன், சுக்கிரன்): இரட்டை ராசி (யுக்ம) மற்றும் நவாம்சத்தில் நின்றால் தலா 15 விருபங்கள்.<br>
        • ஆண் & அலி கிரகங்கள் (சூரியன், செவ்வாய், குரு, புதன், சனி): ஒற்றை ராசி (ஓஜ) மற்றும் நவாம்சத்தில் நின்றால் தலா 15 விருபங்கள்.
      </span>
    </div>

    <div class="sub-header">2.4 கேந்திராதி பலம் (Kendradi Bala) & 2.5 திரேக்காண பலம் (Drekkana Bala)</div>
    <div class="formula-box">
      <span class="math">கேந்திராதி பலம்: கேந்திரம் (1, 4, 7, 10) = 60 விருபங்கள் | பணபரம் (2, 5, 8, 11) = 30 விருபங்கள் | அபோக்லிமம் (3, 6, 9, 12) = 15 விருபங்கள்</span>
      <span class="desc">
        <b>திரேக்காண பலம் (Drekkana Bala - 15 Virupas):</b><br>
        • ஆண் கிரகங்கள் (சூரியன், செவ்வாய், குரு): முதல் திரேக்காணத்தில் (0&deg; - 10&deg;) இருந்தால் 15 விருபங்கள்.<br>
        • அலி கிரகங்கள் (புதன், சனி): இரண்டாம் திரேக்காணத்தில் (10&deg; - 20&deg;) இருந்தால் 15 விருபங்கள்.<br>
        • பெண் கிரகங்கள் (சந்திரன், சுக்கிரன்): மூன்றாம் திரேக்காணத்தில் (20&deg; - 30&deg;) இருந்தால் 15 விருபங்கள்.
      </span>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 2: DIG BALA & KALA BALA -->
  <div class="section-container">
    <div class="sec-header">
      <span>3. திக் பலம் (Directional Strength - Dig Bala)</span>
      <span class="en-title">3. Dig Bala Mathematics</span>
    </div>

    <p>
      திக் பலம் என்பது லக்னம் மற்றும் நான்கு திசைக் கேந்திரங்களில் (கிழக்கு, தெற்கு, மேற்கு, வடக்கு) கிரகங்களுக்கு இயற்கையாகக் கிடைக்கும் திசை ஆற்றலாகும்.
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>கிரகம் (Planet)</th>
          <th>முழு பலம் பெறும் திசை (Powerful Cusp)</th>
          <th>பூஜ்ஜிய பலம் புள்ளி (Zero Point)</th>
          <th>அதிகபட்ச பலம் (Max Dig Bala)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>குரு, புதன் (Jupiter, Mercury)</td><td>கிழக்கு - 1-ம் பாவம் / லக்னம் (East / Lagna)</td><td>மேற்கு - 7-ம் பாவம் (Descendant)</td><td>60 விருபங்கள் (1.000 Rupa)</td></tr>
        <tr><td>சூரியன், செவ்வாய் (Sun, Mars)</td><td>தெற்கு - 10-ம் பாவம் (South / Midheaven MC)</td><td>வடக்கு - 4-ம் பாவம் (Nadir IC)</td><td>60 விருபங்கள் (1.000 Rupa)</td></tr>
        <tr><td>சனி (Saturn)</td><td>மேற்கு - 7-ம் பாவம் (West / 7th Cusp)</td><td>கிழக்கு - 1-ம் பாவம் / லக்னம் (Lagna)</td><td>60 விருபங்கள் (1.000 Rupa)</td></tr>
        <tr><td>சந்திரன், சுக்கிரன் (Moon, Venus)</td><td>வடக்கு - 4-ம் பாவம் (North / 4th Cusp)</td><td>தெற்கு - 10-ம் பாவம் (10th Cusp)</td><td>60 விருபங்கள் (1.000 Rupa)</td></tr>
      </tbody>
    </table>

    <div class="formula-box">
      <span class="math">திக் பலம் (Virupas) = ( 180&deg; - | கிரகம் நின்ற ஸ்புடம் - அதிகபட்ச பல புள்ளி | ) &divide; 3</span>
      <span class="desc">
        ரூபங்களில் மாற்ற: <b>Dig Bala (Rupas) = Dig Bala (Virupas) &divide; 60</b>.<br>
        <i>Formula: If ArcDiff = |Planet - PowerCusp| > 180&deg;, use (360&deg; - ArcDiff). Dig Bala = (180&deg; - ArcDiff) / 3. Range: 0.000 to 1.000 Rupa.</i>
      </span>
    </div>

    <div class="sec-header">
      <span>4. கால பலம் (Temporal Strength - Kala Bala)</span>
      <span class="en-title">4. Kala Bala (6 Sub-Components)</span>
    </div>

    <p>
      கால பலம் என்பது ஜனன காலம் (பகல் / இரவு, வளர்பிறை / தேய்பிறை, அயனம், ஹோரை, வாரம், மாதம்) சார்ந்து கணக்கிடப்படும் பலமாகும்:
    </p>

    <div class="sub-header">4.1 நதோன்னத பலம் (Natonnata Bala - Diurnal / Nocturnal Strength)</div>
    <div class="formula-box">
      <span class="math">பகல் பலம் (Unnata Bala) & இரவு பலம் (Nata Bala)</span>
      <span class="desc">
        • சூரியன், குரு, சுக்கிரன்: உச்சி வெயில் நண்பகலில் (Local Noon) அதிகபட்சமாக <b>60 விருபங்கள்</b> பெறுகின்றன.<br>
        • சந்திரன், செவ்வாய், சனி: நடுநிசி நள்ளிரவில் (Local Midnight) அதிகபட்சமாக <b>60 விருபங்கள்</b> பெறுகின்றன.<br>
        • புதன்: பகல் மற்றும் இரவு எப்போது பிறந்தாலும் எப்போதும் முழுமையாக <b>60 விருபங்கள்</b> பெறுகிறார்.
      </span>
    </div>

    <div class="sub-header">4.2 பக்ஷ பலம் (Paksha Bala - Lunar Phase Strength)</div>
    <div class="formula-box">
      <span class="math">சுப கிரக பக்ஷ பலம் = | சந்திரன் பாகை - சூரியன் பாகை | &divide; 3 (அதிகபட்சம் 60 விருபங்கள்)</span>
      <span class="desc">
        <b>அசுப கிரக பக்ஷ பலம் = 60 - சுப கிரக பக்ஷ பலம்.</b><br>
        சுப கிரகங்கள் (குரு, சுக்கிரன், சுப புதன், வளர்பிறை சந்திரன்) சுக்ல பக்ஷ பௌர்ணமியில் உச்ச பலம் (60 விருபங்கள்) பெறுகின்றன.<br>
        அசுப கிரகங்கள் (சூரியன், செவ்வாய், சனி, தேய்பிறை சந்திரன்) கிருஷ்ண பக்ஷ அமாவாசையில் உச்ச பலம் (60 விருபங்கள்) பெறுகின்றன.
      </span>
    </div>

    <div class="sub-header">4.3 திரிபாக பலம் (Tribhaga Bala) & 4.4 கால அதிபதி பலங்கள் (Temporal Lord Strengths)</div>
    <div class="formula-box">
      <span class="math">பகல் / இரவு மூன்று பிரிவுகளின் அதிபதிகளுக்கு தலா 60 விருபங்கள்:</span>
      <span class="desc">
        • பகல் 1-ம் பகுதி: <b>புதன்</b> | பகல் 2-ம் பகுதி: <b>சூரியன்</b> | பகல் 3-ம் பகுதி: <b>சனி</b> (தலா 60 விருபங்கள்).<br>
        • இரவு 1-ம் பகுதி: <b>சந்திரன்</b> | இரவு 2-ம் பகுதி: <b>சுக்கிரன்</b> | இரவு 3-ம் பகுதி: <b>செவ்வாய்</b> (தலா 60 விருபங்கள்).<br>
        • <b>குரு</b>: பகல், இரவு எந்நேரத்திலும் எப்போதும் முழுமையாக 60 விருபங்கள் பெறுகிறார்.<br>
        • <b>அப்தாதிபதி (Year Lord)</b> = 15 விருபங்கள் | <b>மாசாதிபதி (Month Lord)</b> = 30 விருபங்கள்<br>
        • <b>வாராதிபதி (Weekday Lord)</b> = 45 விருபங்கள் | <b>ஹோராதிபதி (Hora Lord)</b> = 60 விருபங்கள்
      </span>
    </div>

    <div class="sub-header">4.5 அயன பலம் (Ayana Bala - Solstitial / Declination Strength)</div>
    <div class="formula-box">
      <span class="math">அயன பலம் = கிராந்தி (Declination &delta;) கோணத்தின் அடிப்படையில் கணக்கிடப்படுகிறது</span>
      <span class="desc">
        • சூரியன், செவ்வாய், குரு, சுக்கிரன்: உத்தராயணத்தில் (வடக்கு கிராந்தி) அதிக பலம் பெறுகின்றன.<br>
        • சந்திரன், சனி: தட்சிணாயனத்தில் (தெற்கு கிராந்தி) அதிக பலம் பெறுகின்றன. புதன் இரண்டிலும் மிதமான பலம் பெறுகிறார்.
      </span>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 3: CHESTA, NAISARGIKA, DRIK & BHAVA BALA -->
  <div class="section-container">
    <div class="sec-header">
      <span>5. சேஷ்டா பலம் (Motional Strength - Chesta Bala)</span>
      <span class="en-title">5. Chesta Bala & Motion States</span>
    </div>

    <p>
      சேஷ்டா பலம் என்பது கிரகங்களின் நகர்வு வேகம், சூரியனுடன் உள்ள தூரம் மற்றும் வக்ர நிலையை அடிப்படையாகக் கொண்டது:
    </p>
    <div class="formula-box">
      <span class="math">சூரியன் மற்றும் சந்திரனுக்கு சேஷ்டா பலம் = 0.000 ரூபங்கள் (0 விருபங்கள்)</span>
      <span class="desc">
        (சூரியன் மற்றும் சந்திரனின் நகர்வு பலன் அயன பலம் மற்றும் பக்ஷ பலத்தில் ஏற்கனவே சேர்க்கப்பட்டு விடுகிறது).
      </span>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>நகர்வு நிலை (Motional State)</th>
          <th>விளக்கம் (Astrological Significance)</th>
          <th>விருபங்கள் (Virupas)</th>
          <th>ரூபங்கள் (Rupas)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>வக்ரம் (Vakra)</td><td>முழு வக்ர நிலை (Retrograde Motion)</td><td class="highlight">60.0</td><td class="highlight">1.000</td></tr>
        <tr><td>அனுவக்ரம் (Anuvakra)</td><td>வக்ர ஆரம்ப நிலை (Entering Retrograde)</td><td>30.0</td><td>0.500</td></tr>
        <tr><td>விகலம் (Vikala)</td><td>நிலையான நிலை (Stationary / Turning Direct)</td><td>15.0</td><td>0.250</td></tr>
        <tr><td>மந்தம் (Manda)</td><td>மந்த நடை / மெதுவான வேகம் (Slow Motion)</td><td>30.0</td><td>0.500</td></tr>
        <tr><td>மந்ததரம் (Mandatara)</td><td>மிக மந்த வேகம் (Very Slow Motion)</td><td>15.0</td><td>0.250</td></tr>
        <tr><td>சமம் (Sama)</td><td>சராசரி வேகம் (Mean Motion)</td><td>7.5</td><td>0.125</td></tr>
        <tr><td>சரம் (Chara)</td><td>நேர்முக வேக நடை (Direct Fast Motion)</td><td>45.0</td><td>0.750</td></tr>
        <tr><td>அதிசரம் (Atichara)</td><td>அதிவேக நடை (Accelerated Fast Motion)</td><td>30.0</td><td>0.500</td></tr>
      </tbody>
    </table>

    <div class="sec-header">
      <span>6. நைசர்கிக பலம் (Natural Strength - Naisargika Bala)</span>
      <span class="en-title">6. Fixed Parashari Constants</span>
    </div>

    <p>
      நைசர்கிக பலம் என்பது பிரபஞ்சத்தில் கிரகங்களின் இயற்கையான ஒளி வீசும் தன்மையால் (Luminosity & Natural Power) பராசர மகரிஷியால் நிர்ணயிக்கப்பட்ட நிலையான மதிப்புகளாகும். இது அனைத்து ஜாதகங்களுக்கும் எப்போதும் மாறாதது:
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>வரிசை (Rank)</th>
          <th>கிரகம் (Graha)</th>
          <th>இயற்கை ஒளி விகிதம் (Ratio)</th>
          <th>விருபங்கள் (Virupas)</th>
          <th>ரூபங்கள் (Rupas - 3 Decimals)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>சூரியன் (Sun)</td><td>60/60</td><td>60.00</td><td class="highlight">1.000</td></tr>
        <tr><td>2</td><td>சந்திரன் (Moon)</td><td>51.43/60</td><td>51.43</td><td class="highlight">0.857</td></tr>
        <tr><td>3</td><td>சுக்கிரன் (Venus)</td><td>42.86/60</td><td>42.86</td><td class="highlight">0.714</td></tr>
        <tr><td>4</td><td>குரு (Jupiter)</td><td>34.29/60</td><td>34.29</td><td class="highlight">0.571</td></tr>
        <tr><td>5</td><td>புதன் (Mercury)</td><td>25.71/60</td><td>25.71</td><td class="highlight">0.428 (0.429)</td></tr>
        <tr><td>6</td><td>செவ்வாய் (Mars)</td><td>17.14/60</td><td>17.14</td><td class="highlight">0.286</td></tr>
        <tr><td>7</td><td>சனி (Saturn)</td><td>8.57/60</td><td>8.57</td><td class="highlight">0.143</td></tr>
      </tbody>
    </table>

    <div class="sec-header">
      <span>7. திருஷ்டி பலம் (Aspectual Strength - Drik Bala)</span>
      <span class="en-title">7. Drik Bala / Drishti Pinda</span>
    </div>

    <div class="formula-box">
      <span class="math">திருஷ்டி பலம் (Drik Bala) = &sum; (சுப கிரக பார்வை விருபங்கள்) - &sum; (அசுப கிரக பார்வை விருபங்கள்)</span>
      <span class="desc">
        • குரு, சுக்கிரன், சுப சந்திரன், சுப புதன் பார்வை: <b>நேர்மறை மதிப்பு (+) பலம் சேர்க்கும்.</b><br>
        • சூரியன், செவ்வாய், சனி, தேய்பிறை சந்திரன் பார்வை: <b>எதிர்மறை மதிப்பு (-) பலத்தைக் குறைக்கும்.</b><br>
        • விசேஷ திருஷ்டிகள்: செவ்வாய் (4, 8-ம் பார்வை 100%), குரு (5, 9-ம் பார்வை 100%), சனி (3, 10-ம் பார்வை 100%).<br>
        • 7-ம் பார்வை அனைத்து கிரகங்களுக்கும் 100% முழுப்பார்வை ஆகும்.<br>
        <i>குறிப்பு: திருஷ்டி பலம் நேர்மறையாகவோ (+) அல்லது எதிர்மறையாகவோ (-) அமையலாம் (எ.கா: +0.037 அல்லது -0.398).</i>
      </span>
    </div>

    <div class="sec-header">
      <span>8. மொத்த ஷட்பலம் & இஷ்ட - கஷ்ட பலன்கள் (Total Shadbala & Ishta/Kashta)</span>
      <span class="en-title">8. Total Shadbala & Parashari Minimums</span>
    </div>

    <div class="formula-box">
      <span class="math">மொத்த ஷட்பலம் (Total Rupas) = ஸ்தான பலம் + திக் பலம் + கால பலம் + சேஷ்டா பலம் + நைசர்கிக பலம் + திருஷ்டி பலம்</span>
      <span class="desc">
        <b>இஷ்ட பலன் (Ishta Phala):</b> சுப பலன்களை வழங்கும் திறன் = &radic;(உச்ச பலம் &times; சேஷ்டா பலம்)<br>
        <b>கஷ்ட பலன் (Kashta Phala):</b> அசுப பலன்களை வழங்கும் அளவு = &radic;((60 - உச்ச பலம்) &times; (60 - சேஷ்டா பலம்))
      </span>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>கிரகம் (Planet)</th>
          <th>பராசர குறைந்தபட்ச தகுதி (Required Virupas)</th>
          <th>குறைந்தபட்ச ரூபங்கள் (Required Rupas)</th>
          <th>முடிவு / நிலை (Condition for Strength)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியன் (Sun)</td><td>390 விருபங்கள்</td><td><b>6.500 Rupas</b></td><td>மொத்த பலம் &ge; 6.5 எனில் சூரியன் மிக பலவான்</td></tr>
        <tr><td>சந்திரன் (Moon)</td><td>360 விருபங்கள்</td><td><b>6.000 Rupas</b></td><td>மொத்த பலம் &ge; 6.0 எனில் சந்திரன் மனோபலம் தருவார்</td></tr>
        <tr><td>செவ்வாய் (Mars)</td><td>300 விருபங்கள்</td><td><b>5.000 Rupas</b></td><td>மொத்த பலம் &ge; 5.0 எனில் தைரியம், வெற்றி தருவார்</td></tr>
        <tr><td>புதன் (Mercury)</td><td>420 விருபங்கள்</td><td><b>7.000 Rupas</b></td><td>மொத்த பலம் &ge; 7.0 எனில் புத்தி கூர்மை, கல்வி தருவார்</td></tr>
        <tr><td>குரு (Jupiter)</td><td>390 விருபங்கள்</td><td><b>6.500 Rupas</b></td><td>மொத்த பலம் &ge; 6.5 எனில் ஞானம், தன யோகம் தருவார்</td></tr>
        <tr><td>சுக்கிரன் (Venus)</td><td>330 விருபங்கள்</td><td><b>5.500 Rupas</b></td><td>மொத்த பலம் &ge; 5.5 எனில் களத்திர சுபம், சொத்து தருவார்</td></tr>
        <tr><td>சனி (Saturn)</td><td>300 விருபங்கள்</td><td><b>5.000 Rupas</b></td><td>மொத்த பலம் &ge; 5.0 எனில் ஆயுள் பலம், தொழில் நிலை தருவார்</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 4: BHAVA BALA & BENCHMARK REFERENCE TABLES -->
  <div class="section-container">
    <div class="sec-header">
      <span>9. பாவக கணிதம் (Bhava Bala - 12 House Strengths)</span>
      <span class="en-title">9. Bhava Bala (3 Pillars of House Power)</span>
    </div>

    <p>
      பாவக கணிதம் என்பது ஒரு ஜாதகத்தின் 12 பாவகங்களும் (லக்னம் முதல் விரய பாவகம் வரை) பெறும் பலத்தை நிர்ணயிக்கும் முறையாகும். இதில் 3 முக்கிய பலங்கள் உள்ளன:
    </p>

    <div class="formula-box">
      <span class="math">மொத்த பாவக பலம் (Total Bhava Bala) = திருஷ்டி பலம் + திக் பலம் + அதிபதி பலம்</span>
      <span class="desc">
        <b>1. திருஷ்டி பலம் (Bhava Drishti Bala):</b> 12 பாவக மத்திமங்களின் மீது அனைத்து கிரகங்களும் செலுத்தும் பார்வைகளின் நிகர பலம்.<br>
        <b>2. திக் பலம் (Bhava Dig Bala):</b> பாவக ராசியின் தன்மைக்கேற்ப கிடைக்கும் பலம் (நர ராசி லக்னத்திலும், ஜல ராசி 4-லும், கீட ராசி 7-லும், சதுஷ்பாத ராசி 10-லும் பலம் பெறும்).<br>
        <b>3. அதிபதி பலம் (Bhava Adhipati Bala):</b> <b>மிக முக்கியமான சூத்திரம்!</b> அந்தந்த பாவகத்திற்கு உரிய அதிபதி கிரகத்தின் <u>மொத்த ஷட்பல அளவே</u> பாவகத்தின் அதிபதி பலமாகும்!
      </span>
    </div>

    <div class="sec-header">
      <span>10. மாதிரி ஜாதக கணக்கீட்டு அட்டவணை (Benchmark Calculations)</span>
      <span class="en-title">10. Verified Benchmark Tables (in Rupas)</span>
    </div>

    <p style="font-size: 8.5pt;">
      கீழ்க்கண்ட அட்டவணை மாதிரி ஜாதகத்தில் (Sample: 2026-10-30, Bangalore, லக்னம்: விருச்சிகம்) பெறப்பட்ட துல்லியமான ஷட்பல மற்றும் பாவக பல முடிவுகளாகும்:
    </p>

    <div class="sub-header">கிரக கணிதம் (Planetary Shadbala in Rupas)</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>பலம் (Strength Component)</th>
          <th>சூரியன்</th>
          <th>சந்திரன்</th>
          <th>செவ்வாய்</th>
          <th>புதன்</th>
          <th>குரு</th>
          <th>சுக்கிரன்</th>
          <th>சனி</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="text-align: left; font-weight: 600;">ஸ்தான பலம் (Sthana)</td><td>3.360</td><td>2.632</td><td>2.624</td><td>2.187</td><td>2.648</td><td>2.073</td><td>2.236</td></tr>
        <tr><td style="text-align: left; font-weight: 600;">திக் பலம் (Dig)</td><td>0.654</td><td>0.559</td><td>0.369</td><td>0.502</td><td>0.427</td><td>0.800</td><td>0.667</td></tr>
        <tr><td style="text-align: left; font-weight: 600;">கால பலம் (Kala)</td><td>2.250</td><td>1.800</td><td>2.250</td><td>3.600</td><td>4.500</td><td>3.150</td><td>3.150</td></tr>
        <tr><td style="text-align: left; font-weight: 600;">சேஷ்டா பலம் (Chesta)</td><td>0.000</td><td>0.000</td><td>0.710</td><td>0.350</td><td>0.530</td><td>0.710</td><td>0.350</td></tr>
        <tr><td style="text-align: left; font-weight: 600;">நைசர்கிக பலம் (Naisargika)</td><td>1.000</td><td>0.857</td><td>0.286</td><td>0.428</td><td>0.571</td><td>0.714</td><td>0.143</td></tr>
        <tr><td style="text-align: left; font-weight: 600;">திருஷ்டி பலம் (Drik)</td><td>0.037</td><td>-0.398</td><td>0.099</td><td>0.081</td><td>-0.116</td><td>0.073</td><td>-0.238</td></tr>
        <tr class="highlight" style="font-weight: 800; font-size: 8.5pt;">
          <td style="text-align: left; color: #7A1A22;">மொத்தம் (Total Shadbala)</td>
          <td>7.301</td><td>5.450</td><td>6.338</td><td>7.148</td><td>8.560</td><td>7.520</td><td>6.308</td>
        </tr>
        <tr><td style="text-align: left; font-weight: 600;">இஷ்ட பலம் (Ishta Phala)</td><td>0.430</td><td>0.563</td><td>0.384</td><td>0.418</td><td>0.582</td><td>0.439</td><td>0.500</td></tr>
        <tr><td style="text-align: left; font-weight: 600;">கஷ்ட பலம் (Kashta Phala)</td><td>0.550</td><td>0.377</td><td>0.658</td><td>0.595</td><td>0.339</td><td>0.566</td><td>0.402</td></tr>
      </tbody>
    </table>

    <div class="sub-header">பாவக கணிதம் (Bhava Bala in Rupas - 12 Bhavas)</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>பாவகம் (House)</th>
          <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th>
          <th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: left; font-weight: 600;">திருஷ்டி பலம்</td>
          <td>0.600</td><td>0.893</td><td>1.000</td><td>0.893</td><td>1.300</td><td>0.200</td>
          <td>0.200</td><td>0.493</td><td>0.600</td><td>0.493</td><td>0.200</td><td>0.200</td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: 600;">திக் பலம்</td>
          <td>0.750</td><td>0.499</td><td>0.665</td><td>0.750</td><td>0.333</td><td>0.499</td>
          <td>0.750</td><td>0.167</td><td>0.333</td><td>0.750</td><td>0.665</td><td>0.167</td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: 600;">அதிபதி பலம்</td>
          <td>6.338</td><td>8.560</td><td>6.308</td><td>6.308</td><td>8.560</td><td>6.338</td>
          <td>7.520</td><td>7.148</td><td>5.450</td><td>7.301</td><td>7.148</td><td>7.520</td>
        </tr>
        <tr class="highlight" style="font-weight: 800; font-size: 8.5pt;">
          <td style="text-align: left; color: #7A1A22;">மொத்தம் (Total)</td>
          <td>7.688</td><td>9.952</td><td>7.973</td><td>7.951</td><td>10.193</td><td>7.037</td>
          <td>8.470</td><td>7.808</td><td>6.383</td><td>8.544</td><td>8.013</td><td>7.887</td>
        </tr>
      </tbody>
    </table>

    <div class="note-box">
      <b>கணித சரிபார்ப்பு குறிப்பு (Mathematical Verification):</b><br>
      • 1-ம் பாவகம் (விருச்சிகம்) அதிபதி செவ்வாய்: அதிபதி பலம் = செவ்வாயின் மொத்த ஷட்பலம் <b>6.338</b>.<br>
      • 1-ம் பாவக மொத்தம் = திருஷ்டி பலம் (0.600) + திக் பலம் (0.750) + அதிபதி பலம் (6.338) = <b>7.688</b>.<br>
      • 2-ம் பாவகம் (தனுசு) அதிபதி குரு: அதிபதி பலம் = குருவின் மொத்த ஷட்பலம் <b>8.560</b>.<br>
      • 2-ம் பாவக மொத்தம் = 0.893 + 0.499 + 8.560 = <b>9.952</b>. அனைத்து பாவகங்களும் இதே முறையில் கணிக்கப்படுகின்றன.
    </div>

    <div class="page-footer">
      வேத ஜோதிட ஷட்பலம் & பாவக பலம் கணித சூத்திரக் கையேடு • வெளியிடப்பட்டது: அஸ்ட்ரோஜித் (Astrojit Vedic Platform) • சுபம்
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'frontend', 'public', 'Shadbala_Calculation_Formulas_Tamil_English.html');
const pdfPublicPath = path.join(__dirname, 'frontend', 'public', 'Shadbala_Calculation_Formulas_Tamil_English.pdf');
const pdfWorkspacePath = path.join(__dirname, 'Shadbala_Calculation_Formulas_Tamil_English.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML written to:', htmlPath);

// Execute Microsoft Edge to convert HTML to high quality PDF
const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPublicPath}" "file:///${htmlPath.replace(/\\\\/g, '/')}"`;

console.log('Executing PDF conversion...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfPublicPath)) {
  fs.copyFileSync(pdfPublicPath, pdfWorkspacePath);
  const size = fs.statSync(pdfPublicPath).size;
  console.log(`Success! PDF generated at:
  - Public: ${pdfPublicPath} (${size} bytes)
  - Workspace: ${pdfWorkspacePath} (${size} bytes)`);
} else {
  console.error('Failed to create PDF');
  process.exit(1);
}
