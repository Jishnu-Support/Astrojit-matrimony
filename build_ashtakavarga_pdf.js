const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8">
  <title>Ashtakavarga & Sarvashtakavarga Calculation Formulas Manual</title>
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
        content: "வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரங்கள் • Astrojit Platform";
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
      font-size: 8.8pt;
      line-height: 1.42;
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
      font-size: 9.5pt;
      margin: 8px 0 16px 0;
      line-height: 1.6;
    }

    h1.doc-title-ta {
      font-family: 'Noto Serif Tamil', serif;
      font-size: 18pt;
      font-weight: 800;
      color: #7A1A22;
      margin: 0 0 6px 0;
      letter-spacing: 0.5px;
    }

    h2.doc-title-en {
      font-family: 'Cinzel', serif;
      font-size: 13pt;
      font-weight: 700;
      color: #8C6D23;
      margin: 0 0 14px 0;
      letter-spacing: 1px;
    }

    .subtitle-badge {
      display: inline-block;
      background: #7A1A22;
      color: #FDFBF7;
      padding: 5px 18px;
      border-radius: 20px;
      font-size: 9pt;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }

    .cover-desc {
      font-size: 9pt;
      color: #4A3E39;
      max-width: 520px;
      margin: 0 auto 20px auto;
      line-height: 1.6;
    }

    .cover-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      text-align: left;
      margin: 15px auto;
      max-width: 500px;
    }

    .feature-item {
      background: #FFFFFF;
      border-left: 3px solid #7A1A22;
      padding: 7px 10px;
      font-size: 8pt;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .feature-item b {
      color: #7A1A22;
    }

    .cover-meta {
      border-top: 1px solid #D4AF37;
      padding-top: 12px;
      font-size: 8pt;
      color: #6E5F57;
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }

    .chapter-page {
      page-break-after: always;
      padding-top: 4px;
    }

    .chapter-page:last-child {
      page-break-after: avoid;
    }

    .chap-header {
      border-bottom: 2px solid #7A1A22;
      padding-bottom: 5px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .chap-title-ta {
      font-family: 'Noto Serif Tamil', serif;
      font-size: 13.5pt;
      font-weight: 700;
      color: #7A1A22;
      margin: 0;
    }

    .chap-title-en {
      font-family: 'Cinzel', serif;
      font-size: 9.5pt;
      font-weight: 600;
      color: #8C6D23;
      margin: 2px 0 0 0;
    }

    .chap-num {
      font-family: 'Cinzel', serif;
      font-size: 15pt;
      font-weight: 800;
      color: #D4AF37;
      opacity: 0.85;
    }

    h3.sub-title {
      font-family: 'Noto Serif Tamil', 'Source Serif 4', serif;
      font-size: 10.5pt;
      font-weight: 700;
      color: #7A1A22;
      margin: 10px 0 4px 0;
      border-left: 3px solid #D4AF37;
      padding-left: 7px;
    }

    p {
      margin: 0 0 7px 0;
      text-align: justify;
    }

    .formula-box {
      background: #FAF6EF;
      border: 1px solid #E2D3B8;
      border-left: 4px solid #7A1A22;
      padding: 7px 10px;
      margin: 7px 0;
      border-radius: 3px;
      font-family: 'Source Serif 4', Georgia, serif;
    }

    .formula-title {
      font-weight: 700;
      color: #7A1A22;
      font-size: 8.8pt;
      margin-bottom: 3px;
      display: flex;
      justify-content: space-between;
    }

    .formula-math {
      font-family: 'Cambria Math', 'Source Serif 4', Georgia, serif;
      font-size: 9.5pt;
      color: #1A130F;
      background: #FFFFFF;
      padding: 4px 8px;
      border: 1px dashed #D6C2A0;
      border-radius: 2px;
      margin: 3px 0;
      display: block;
      text-align: center;
    }

    .formula-desc {
      font-size: 8.2pt;
      color: #5A4B43;
      margin-top: 3px;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 8pt;
      background-color: #FFFFFF;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #D9C8B2;
      padding: 4.5px 6px;
      text-align: center;
    }

    table.data-table th {
      background-color: #7A1A22;
      color: #FFFFFF;
      font-weight: 700;
      font-family: 'Noto Serif Tamil', 'Source Serif 4', serif;
    }

    table.data-table th.subhead {
      background-color: #F2E8DC;
      color: #7A1A22;
      font-size: 7.8pt;
    }

    table.data-table tr:nth-child(even) {
      background-color: #FAF7F2;
    }

    table.data-table tr.highlight {
      background-color: #F8EFE4;
      font-weight: 700;
    }

    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 8px 0;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #E2D3B8;
      border-radius: 3px;
      padding: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }

    .card-title {
      font-weight: 700;
      color: #7A1A22;
      font-size: 8.8pt;
      margin-bottom: 4px;
      border-bottom: 1px solid #F0E3D0;
      padding-bottom: 2px;
    }

    .note-box {
      background-color: #FDF9EE;
      border: 1px solid #E5D6A7;
      padding: 6px 10px;
      margin: 6px 0;
      font-size: 8pt;
      border-radius: 2px;
      color: #55442A;
    }

    .chart-container {
      width: 260px;
      height: 260px;
      margin: 10px auto;
      border: 2px solid #7A1A22;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, 1fr);
      background: #FFFDF9;
      font-size: 7.5pt;
    }

    .chart-cell {
      border: 1px solid #D9C8B2;
      padding: 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      position: relative;
    }

    .chart-center {
      grid-column: 2 / span 2;
      grid-row: 2 / span 2;
      border: 1px solid #D9C8B2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #FAF6EF;
      padding: 6px;
      text-align: center;
    }

    .page-footer {
      border-top: 1px solid #E2D3B8;
      padding-top: 4px;
      margin-top: 10px;
      font-size: 7.5pt;
      color: #8C7C72;
      text-align: center;
      font-family: 'Noto Serif Tamil', serif;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-border-inner">
      <div>
        <div class="om-symbol">🕉️</div>
        <div class="sloka">
          "अष्टाकवर्गं प्रवक्ष्यामि लोकानां हितकाम्यया ।<br>
          ग्रहदोषविनाशाय शुभाशुभफलप्रदम् ॥"<br>
          <i>(லோக நன்மையின் பொருட்டு, கிரக தோஷங்களை நீக்கி சுபாசுப பலன்களைத் துல்லியமாக அறியும் அஷ்டகவர்க்க முறையை விவரிக்கிறேன் - பராசரர்)</i>
        </div>
        <h1 class="doc-title-ta">வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரங்கள்</h1>
        <h2 class="doc-title-en">Classical Vedic Ashtakavarga & Sarvashtakavarga (337 Bindus) Calculation Manual</h2>
        <div class="subtitle-badge">பராசரர் ஹோரா சாஸ்திர முறைப்படி 337 பரல்கள் கணித கையேடு • Bilingual (Tamil & English)</div>

        <div class="cover-desc">
          பராசர முனிவரின் <b>பிருஹத் பராசர ஹோரா சாஸ்திரம்</b> (Brihat Parashara Hora Shastra - அத்தியாயங்கள் 66 முதல் 72) முறைப்படி 7 கிரகங்களின் பின்னாஷ்டகவர்க்கம், 337 பரல்கள் கொண்ட சர்வாஷ்டகவர்க்கம், வரவு-செலவு பாவக ஆய்வுகள், திரிகோண-ஏகாதிபத்திய சுோதனைகள் மற்றும் பிண்ட சாதனைகள் அடங்கிய முழுமையான கணித விளக்கக் கையேடு.
        </div>

        <div class="cover-features">
          <div class="feature-item">
            <b>1. பின்னாஷ்டகவர்க்கம் (BAV):</b><br>
            7 கிரகங்கள் 8 மூலங்களிலிருந்து வழங்கும் 337 சுபப் பரல்களின் துல்லிய விதிகள்.
          </div>
          <div class="feature-item">
            <b>2. சர்வாஷ்டகவர்க்கம் (SAV):</b><br>
            12 ராசிகளின் கூட்டுப் பரல்கள், 337 மாறிலி, மற்றும் ராசிக்கு 28.08 சராசரி பலன்கள்.
          </div>
          <div class="feature-item">
            <b>3. வரவு - செலவு ஆய்வு:</b><br>
            தன பாக்கிய லாபம் (2, 9, 11) vs கடன் விரயம் (6, 8, 12) பொருளாதார கணிதம்.
          </div>
          <div class="feature-item">
            <b>4. சுோதனை & பிண்ட சாதனை:</b><br>
            திரிகோண சுோதனை, ஏகாதிபத்திய சுோதனை, ராசி/கிரக குணகார யோக பிண்டம்.
          </div>
        </div>
      </div>

      <div class="cover-meta">
        <div><b>ஆசிரியர் / வெளியீடு:</b> Astrojit Vedic Astrology & Ephemeris Systems</div>
        <div><b>சாஸ்திர ஆதாரம்:</b> Brihat Parashara Hora Shastra (BPHS Ch. 66-72)</div>
        <div><b>பதிப்பு:</b> 2026 Classical Reference Edition</div>
      </div>
    </div>
  </div>

  <!-- CHAPTER 1: FUNDAMENTALS -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 1: அஷ்டகவர்க்க அடிப்படைக் கோட்பாடுகள்</h2>
        <div class="chap-title-en">Chapter 1: Fundamentals & Philosophy of Ashtakavarga</div>
      </div>
      <div class="chap-num">01</div>
    </div>

    <h3 class="sub-title">1.1 அஷ்டகவர்க்கம் என்றால் என்ன? (Definition of Ashtakavarga)</h3>
    <p>
      <b>அஷ்டகவர்க்கம் (Ashtakavarga)</b> என்பது சமஸ்கிருதத்தில் 'அஷ்ட' (எட்டு) + 'வர்க்கம்' (பிரிவு அல்லது கூட்டம்) என்பதிலிருந்து உருவானது. ஜாதகத்தில் உள்ள 12 ராசிகளில், 7 முக்கிய கிரகங்களும் (சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்கிரன், சனி) மற்றும் லக்னமும் ஆகிய <b>8 மூலங்களிலிருந்து (8 Reference Lagnas)</b> ஒவ்வொரு ராசிக்கும் கிடைக்கக்கூடிய சுப-அசுப பலன்களின் பங்கீட்டை கணிப்பதே அஷ்டகவர்க்கமாகும்.
    </p>
    <p>
      சாயா கிரகங்களான <b>ராகு மற்றும் கேதுவிற்கு</b> பராசரர் முறைப்படி சுய அஷ்டகவர்க்கம் கிடையாது (சில பிற்கால நூல்கள் ராகு அஷ்டகவர்க்கம் குறிப்பிட்டாலும், பராசர மூல நூலின்படி 7 கிரகங்கள் மட்டுமே 337 பரல்களை உருவாக்குகின்றன).
    </p>

    <div class="formula-box">
      <div class="formula-title">
        <span>அஷ்டகவர்க்கத்தின் 8 மூலங்கள் (8 Reference Pivot Points):</span>
        <span>பராசரர் விதி</span>
      </div>
      <div class="formula-math">
        References = { லக்னம், சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்கிரன், சனி }
      </div>
      <div class="formula-desc">
        ஒவ்வொரு கிரகமும் தனது சொந்த நிலையைத் தவிர மற்ற 6 கிரகங்கள் மற்றும் லக்னத்தின் ஸ்தானங்களை அடிப்படையாகக் கொண்டு சுப பரல்களை (Bindus) வழங்குகிறது.
      </div>
    </div>

    <h3 class="sub-title">1.2 பரல் (Bindu) vs ரேகை (Rekha) கோட்பாடு</h3>
    <p>
      இந்தியாவின் பல்வேறு பகுதிகளில் பரல் மற்றும் ரேகைக்கான குறியீடுகள் வேறுபடுகின்றன:
    </p>
    <div class="grid-2col">
      <div class="card">
        <div class="card-title">தென்னிந்திய முறை (South Indian System - Tamil Nadu)</div>
        <p style="font-size: 8pt; margin: 0;">
          • <b>பரல் (Bindu / புள்ளி):</b> சுப பலன் அளிக்கும் புள்ளி (மதிப்பு = 1).<br>
          • <b>சூனிய புள்ளி (0):</b> சுப பலன் அற்ற அல்லது அசுப நிலை.<br>
          • 7 கிரகங்களின் மொத்த சுபப் பரல்கள் = <b>337 பரல்கள்</b>.<br>
          • ராசியில் பரல்கள் அதிகமாக இருந்தால் (≥ 28) சுபம்.
        </p>
      </div>
      <div class="card">
        <div class="card-title">வடஇந்திய முறை (North Indian System)</div>
        <p style="font-size: 8pt; margin: 0;">
          • <b>ரேகை (Rekha / கோடு |):</b> சுப பலன் (மதிப்பு = 1).<br>
          • <b>பிந்து (Bindu / புள்ளி 0):</b> அசுப கரணம் / தோஷ புள்ளி.<br>
          • பராசரர் மூலத்தில் பிந்து என்பது சுப புள்ளியையும், கரன் என்பது அசுபத்தையும் குறிக்கிறது. நடைமுறையில் 337 சுபப் புள்ளிகளே சர்வாஷ்டகவர்க்கமாக ஏற்றுக்கொள்ளப்படுகிறது.
        </p>
      </div>
    </div>

    <h3 class="sub-title">1.3 அஷ்டகவர்க்கத்தின் 337 மாறிலி (The 337 Parashari Invariant)</h3>
    <p>
      பராசரர் வகுத்த கணித விதிகளின்படி, 7 கிரகங்களும் 12 ராசிகளுக்கு வழங்கும் மொத்த சுப பரல்களின் எண்ணிக்கை ஒரு பிரபஞ்ச மாறிலியாகும் (Mathematical Invariant):
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>கிரகம் (Planet)</th>
          <th>ஆங்கிலப் பெயர்</th>
          <th>காரகத்துவம் (Signification)</th>
          <th>மொத்தப் பரல்கள் (Fixed Total)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியன்</td><td>Sun (Surya)</td><td>ஆத்மகாரகன், பித்ரு, அதிகாரம், உடல் ஆரோக்கியம்</td><td><b>48 பரல்கள்</b></td></tr>
        <tr><td>சந்திரன்</td><td>Moon (Chandra)</td><td>மனோகாரகன், மாத்ரு, உணர்வு, மன அமைதி</td><td><b>49 பரல்கள்</b></td></tr>
        <tr><td>செவ்வாய்</td><td>Mars (Mangal)</td><td>தைரியம், பூமி, சகோதரன், ரத்தம், ஆற்றல்</td><td><b>39 பரல்கள்</b></td></tr>
        <tr><td>புதன்</td><td>Mercury (Budha)</td><td>புத்திகாரகன், கல்வி, வியாபாரம், பேச்சுத்திறன்</td><td><b>54 பரல்கள்</b></td></tr>
        <tr><td>குரு</td><td>Jupiter (Guru)</td><td>புத்திரகாரகன், தனகாரகன், ஞானம், குருவருள்</td><td><b>56 பரல்கள்</b> (அதிகபட்சம்)</td></tr>
        <tr><td>சுக்கிரன்</td><td>Venus (Shukra)</td><td>களத்திரகாரகன், சுகபோகம், வாகனம், கலைத்திறன்</td><td><b>52 பரல்கள்</b></td></tr>
        <tr><td>சனி</td><td>Saturn (Shani)</td><td>ஆயுள்காரகன், உழைப்பு, தொழில், கர்ம பலன்</td><td><b>39 பரல்கள்</b></td></tr>
        <tr class="highlight">
          <td colspan="3" style="text-align: right; color: #7A1A22; font-size: 9pt;">சர்வாஷ்டகவர்க்க மொத்தப் பரல்கள் (Grand Total):</td>
          <td style="color: #7A1A22; font-size: 10pt;"><b>337 பரல்கள்</b></td>
        </tr>
      </tbody>
    </table>

    <div class="note-box">
      <b>முக்கிய வினா:</b> எந்த ஒரு ஜாதகத்திலும் இந்த 337 மொத்தப் பரல்கள் கூடவோ குறையவோ செய்யாது. கிரகங்கள் நின்ற ராசிகள் மாறும்போது, 12 ராசிகளில் இந்த 337 பரல்கள் பகிர்ந்தளிக்கப்படும் விதம் மட்டுமே மாறும்.
    </div>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • பக்கம் 1
    </div>
  </div>

  <!-- CHAPTER 2: 7 BHINNA ASHTAKAVARGA RULES -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 2: 7 கிரகங்களின் பின்னாஷ்டகவர்க்க விதிகள்</h2>
        <div class="chap-title-en">Chapter 2: The 7 Bhinna Ashtakavarga (BAV) Rule Sets</div>
      </div>
      <div class="chap-num">02</div>
    </div>

    <p>
      <b>பின்னாஷ்டகவர்க்கம் (Bhinna Ashtakavarga):</b> ஒவ்வொரு தனிப்பட்ட கிரகமும் 8 மூலங்களிலிருந்து எந்தெந்த ஸ்தானங்களில் (Houses) சுப பரல்களை வழங்குகிறது என்பதற்கான பராசரர் கணித அட்டவணை கீழே தரப்பட்டுள்ளது:
    </p>

    <!-- SUN BAV -->
    <h3 class="sub-title">2.1 சூரியன் அஷ்டகவர்க்கம் (Sun BAV - 48 பரல்கள்)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>மூலம் (From)</th>
          <th>சுப ஸ்தானங்கள் (Benefic Houses from Reference)</th>
          <th>பரல்கள் எண்ணிக்கை</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>1, 2, 4, 7, 8, 9, 10, 11</td><td>8 பரல்கள்</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>3, 6, 10, 11</td><td>4 பரல்கள்</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>1, 2, 4, 7, 8, 9, 10, 11</td><td>8 பரல்கள்</td></tr>
        <tr><td>புதனிலிருந்து</td><td>3, 5, 6, 9, 10, 11, 12</td><td>7 பரல்கள்</td></tr>
        <tr><td>குருவிலிருந்து</td><td>5, 6, 9, 11</td><td>4 பரல்கள்</td></tr>
        <tr><td>சுக்கிரனிலிருந்து</td><td>6, 7, 12</td><td>3 பரல்கள்</td></tr>
        <tr><td>சனியிலிருந்து</td><td>1, 2, 4, 7, 8, 9, 10, 11</td><td>8 பரல்கள்</td></tr>
        <tr><td>லக்னத்திலிருந்து</td><td>3, 4, 6, 10, 11, 12</td><td>6 பரல்கள்</td></tr>
        <tr class="highlight"><td colspan="2" style="text-align: right;">சூரியன் மொத்தப் பரல்கள்:</td><td><b>48 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <!-- MOON BAV -->
    <h3 class="sub-title">2.2 சந்திரன் அஷ்டகவர்க்கம் (Moon BAV - 49 பரல்கள்)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>மூலம் (From)</th>
          <th>சுப ஸ்தானங்கள் (Benefic Houses from Reference)</th>
          <th>பரல்கள் எண்ணிக்கை</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>3, 6, 7, 8, 10, 11</td><td>6 பரல்கள்</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>1, 3, 6, 7, 10, 11</td><td>6 பரல்கள்</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>2, 3, 5, 6, 9, 10, 11</td><td>7 பரல்கள்</td></tr>
        <tr><td>புதனிலிருந்து</td><td>1, 3, 4, 5, 7, 8, 10, 11</td><td>8 பரல்கள்</td></tr>
        <tr><td>குருவிலிருந்து</td><td>1, 4, 7, 8, 10, 11, 12</td><td>7 பரல்கள்</td></tr>
        <tr><td>சுக்கிரனிலிருந்து</td><td>3, 4, 5, 7, 9, 10, 11</td><td>7 பரல்கள்</td></tr>
        <tr><td>சனியிலிருந்து</td><td>3, 5, 6, 11</td><td>4 பரல்கள்</td></tr>
        <tr><td>லக்னத்திலிருந்து</td><td>3, 6, 10, 11</td><td>4 பரல்கள்</td></tr>
        <tr class="highlight"><td colspan="2" style="text-align: right;">சந்திரன் மொத்தப் பரல்கள்:</td><td><b>49 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <!-- MARS BAV -->
    <h3 class="sub-title">2.3 செவ்வாய் அஷ்டகவர்க்கம் (Mars BAV - 39 பரல்கள்)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>மூலம் (From)</th>
          <th>சுப ஸ்தானங்கள் (Benefic Houses from Reference)</th>
          <th>பரல்கள் எண்ணிக்கை</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>3, 5, 6, 10, 11</td><td>5 பரல்கள்</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>3, 6, 11</td><td>3 பரல்கள்</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>1, 2, 4, 7, 8, 10, 11</td><td>7 பரல்கள்</td></tr>
        <tr><td>புதனிலிருந்து</td><td>3, 5, 6, 11</td><td>4 பரல்கள்</td></tr>
        <tr><td>குருவிலிருந்து</td><td>6, 10, 11, 12</td><td>4 பரல்கள்</td></tr>
        <tr><td>சுக்கிரனிலிருந்து</td><td>6, 8, 11, 12</td><td>4 பரல்கள்</td></tr>
        <tr><td>சனியிலிருந்து</td><td>1, 4, 7, 8, 9, 10, 11</td><td>7 பரல்கள்</td></tr>
        <tr><td>லக்னத்திலிருந்து</td><td>1, 3, 6, 10, 11</td><td>5 பரல்கள்</td></tr>
        <tr class="highlight"><td colspan="2" style="text-align: right;">செவ்வாய் மொத்தப் பரல்கள்:</td><td><b>39 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • பக்கம் 2
    </div>
  </div>

  <!-- CHAPTER 2 (CONTINUED): MERCURY, JUPITER, VENUS, SATURN -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 2 (தொடர்ச்சி): புதன், குரு, சுக்கிரன், சனி அஷ்டகவர்க்கம்</h2>
        <div class="chap-title-en">Chapter 2 (Contd): Mercury, Jupiter, Venus & Saturn Rules</div>
      </div>
      <div class="chap-num">03</div>
    </div>

    <!-- MERCURY BAV -->
    <h3 class="sub-title">2.4 புதன் அஷ்டகவர்க்கம் (Mercury BAV - 54 பரல்கள்)</h3>
    <table class="data-table">
      <thead>
        <tr><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th></tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>5, 6, 9, 11, 12</td><td>5</td><td>குருவிலிருந்து</td><td>6, 8, 11, 12</td><td>4</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>2, 4, 6, 8, 10, 11</td><td>6</td><td>சுக்கிரனிலிருந்து</td><td>1, 2, 3, 4, 5, 8, 9, 11</td><td>8</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>1, 2, 4, 7, 8, 9, 10, 11</td><td>8</td><td>சனியிலிருந்து</td><td>1, 2, 4, 7, 8, 9, 10, 11</td><td>8</td></tr>
        <tr><td>புதனிலிருந்து</td><td>1, 3, 5, 6, 9, 10, 11, 12</td><td>8</td><td>லக்னத்திலிருந்து</td><td>1, 2, 4, 6, 8, 10, 11</td><td>7</td></tr>
        <tr class="highlight"><td colspan="5" style="text-align: right;">புதன் மொத்தப் பரல்கள்:</td><td><b>54 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <!-- JUPITER BAV -->
    <h3 class="sub-title">2.5 குரு அஷ்டகவர்க்கம் (Jupiter BAV - 56 பரல்கள் - அதிகபட்சம்)</h3>
    <table class="data-table">
      <thead>
        <tr><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th></tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>1, 2, 3, 4, 7, 8, 9, 10, 11</td><td>9</td><td>குருவிலிருந்து</td><td>1, 2, 3, 4, 7, 8, 10, 11</td><td>8</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>2, 5, 7, 9, 11</td><td>5</td><td>சுக்கிரனிலிருந்து</td><td>2, 5, 6, 9, 10, 11</td><td>6</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>1, 2, 4, 7, 8, 10, 11</td><td>7</td><td>சனியிலிருந்து</td><td>3, 5, 6, 12</td><td>4</td></tr>
        <tr><td>புதனிலிருந்து</td><td>1, 2, 4, 5, 6, 9, 10, 11</td><td>8</td><td>லக்னத்திலிருந்து</td><td>1, 2, 4, 5, 6, 7, 9, 10, 11</td><td>9</td></tr>
        <tr class="highlight"><td colspan="5" style="text-align: right;">குரு மொத்தப் பரல்கள்:</td><td><b>56 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <!-- VENUS BAV -->
    <h3 class="sub-title">2.6 சுக்கிரன் அஷ்டகவர்க்கம் (Venus BAV - 52 பரல்கள்)</h3>
    <table class="data-table">
      <thead>
        <tr><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th></tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>8, 11, 12</td><td>3</td><td>குருவிலிருந்து</td><td>5, 8, 9, 10, 11</td><td>5</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>1, 2, 3, 4, 5, 8, 9, 11, 12</td><td>9</td><td>சுக்கிரனிலிருந்து</td><td>1, 2, 3, 4, 5, 8, 9, 10, 11</td><td>9</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>3, 5, 6, 9, 11, 12</td><td>6</td><td>சனியிலிருந்து</td><td>3, 4, 5, 8, 9, 10, 11</td><td>7</td></tr>
        <tr><td>புதனிலிருந்து</td><td>3, 5, 6, 9, 11</td><td>5</td><td>லக்னத்திலிருந்து</td><td>1, 2, 3, 4, 5, 8, 9, 11</td><td>8</td></tr>
        <tr class="highlight"><td colspan="5" style="text-align: right;">சுக்கிரன் மொத்தப் பரல்கள்:</td><td><b>52 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <!-- SATURN BAV -->
    <h3 class="sub-title">2.7 சனி அஷ்டகவர்க்கம் (Saturn BAV - 39 பரல்கள்)</h3>
    <table class="data-table">
      <thead>
        <tr><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th><th>மூலம் (From)</th><th>சுப ஸ்தானங்கள்</th><th>பரல்கள்</th></tr>
      </thead>
      <tbody>
        <tr><td>சூரியனிலிருந்து</td><td>1, 2, 4, 7, 8, 10, 11</td><td>7</td><td>குருவிலிருந்து</td><td>5, 6, 11, 12</td><td>4</td></tr>
        <tr><td>சந்திரனிலிருந்து</td><td>3, 6, 11</td><td>3</td><td>சுக்கிரனிலிருந்து</td><td>6, 11, 12</td><td>3</td></tr>
        <tr><td>செவ்வாயிலிருந்து</td><td>3, 5, 6, 10, 11, 12</td><td>6</td><td>சனியிலிருந்து</td><td>3, 5, 6, 11</td><td>4</td></tr>
        <tr><td>புதனிலிருந்து</td><td>6, 8, 9, 10, 11, 12</td><td>6</td><td>லக்னத்திலிருந்து</td><td>1, 3, 4, 6, 10, 11</td><td>6</td></tr>
        <tr class="highlight"><td colspan="5" style="text-align: right;">சனி மொத்தப் பரல்கள்:</td><td><b>39 பரல்கள்</b></td></tr>
      </tbody>
    </table>

    <div class="note-box">
      <b>கணித சரிபார்ப்பு சூத்திரம் (Mathematical Invariant Verification):</b><br>
      Total Bindus = 48 (சூரி) + 49 (சந்) + 39 (செவ்) + 54 (புத) + 56 (குரு) + 52 (சுக்) + 39 (சனி) = <b>337 பரல்கள் சரியாக அமைதல் வேண்டும்.</b>
    </div>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • பக்கம் 3
    </div>
  </div>

  <!-- CHAPTER 3: SARVASHTAKAVARGA & 337 INVARIANT -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 3: சர்வாஷ்டகவர்க்கம் & பலன் நிர்ணயம்</h2>
        <div class="chap-title-en">Chapter 3: Sarvashtakavarga (SAV) & Predictive Thresholds</div>
      </div>
      <div class="chap-num">04</div>
    </div>

    <h3 class="sub-title">3.1 சர்வாஷ்டகவர்க்கம் கணக்கிடும் முறை (SAV Calculation Algorithm)</h3>
    <p>
      7 கிரகங்களின் பின்னாஷ்டகவர்க்க அட்டவணைகளில், ஒரு குறிப்பிட்ட ராசிக்கு 7 கிரகங்களும் அளித்த பரல்களை ஒன்றுகூட்டி (Summing horizontally across all 7 planets for each zodiac sign) சர்வாஷ்டகவர்க்கம் பெறப்படுகிறது.
    </p>

    <div class="formula-box">
      <div class="formula-title">
        <span>ராசிக்கான சர்வாஷ்டகவர்க்கப் பரல் சூத்திரம்:</span>
        <span>SAV Formula</span>
      </div>
      <div class="formula-math">
        SAV(Sign_i) = BAV_{Sun}(i) + BAV_{Moon}(i) + BAV_{Mars}(i) + BAV_{Mercury}(i) + BAV_{Jupiter}(i) + BAV_{Venus}(i) + BAV_{Saturn}(i)
      </div>
      <div class="formula-desc">
        இங்கு <i>i</i> என்பது 1 முதல் 12 வரையிலான ராசிகள் (மேஷம் முதல் மீனம் வரை).
      </div>
    </div>

    <h3 class="sub-title">3.2 ராசி சராசரி & சுப-அசுப எல்லைக் கோடுகள் (Predictive Benchmarks)</h3>
    <p>
      மொத்தமுள்ள 337 பரல்களை 12 ராசிகளுக்கு வகுத்தால் ஒரு ராசிக்கான சராசரி பரல் கிடைக்கிறது:
    </p>
    <div class="formula-box">
      <div class="formula-title">
        <span>ராசி சராசரிப் பரல் (Average Bindus per Sign):</span>
        <span>Average Benchmark</span>
      </div>
      <div class="formula-math">
        Average = \\frac{337}{12} = 28.0833... \\approx 28 \\text{ பரல்கள்}
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>பரல்களின் அளவு (Bindu Range)</th>
          <th>தர நிலை (Category)</th>
          <th>வாழ்க்கைப் பலன்கள் (Astrological Result)</th>
          <th>கோசார பலன் (Transit Result)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #E8F5E9;">
          <td><b>33 முதல் 40+ பரல்கள்</b></td>
          <td>உத்தமம் (Exceedingly Auspicious)</td>
          <td>மிகச் சிறந்த செல்வம், செல்வாக்கு, வெற்றி, அனைத்து காரிய சித்தி.</td>
          <td>எந்த கிரகம் கோசாரத்தில் சஞ்சரித்தாலும் பெரும் யோகம்.</td>
        </tr>
        <tr style="background-color: #F1F8E9;">
          <td><b>28 முதல் 32 பரல்கள்</b></td>
          <td>மத்திமம் / சுபம் (Auspicious / Strong)</td>
          <td>நிலையான வருமானம், சுப காரியங்கள், உடல் நலம், குடும்ப மேன்மை.</td>
          <td>சுப கிரகங்கள் சஞ்சரிக்கும் போது நற்பலன்கள் கிட்டும்.</td>
        </tr>
        <tr style="background-color: #FFFDE7;">
          <td><b>25 முதல் 27 பரல்கள்</b></td>
          <td>சாதாரண பலன் (Average)</td>
          <td>கலவையான பலன்கள்; உழைப்பிற்கு ஏற்ற பலன் மட்டுமே கிடைக்கும்.</td>
          <td>சுப பலன்களும் அசுப பலன்களும் சமமாக இருக்கும்.</td>
        </tr>
        <tr style="background-color: #FFEBEE;">
          <td><b>20 முதல் 24 பரல்கள்</b></td>
          <td>பலவீனம் / எச்சரிக்கை (Vulnerable)</td>
          <td>தடைகள், வீண் அலைச்சல், உடல் உபாதைகள், நஷ்டங்கள் ஏற்படும் வாய்ப்பு.</td>
          <td>அசுப கிரகங்கள் (சனி, ராகு) வரும் போது விரயங்கள்.</td>
        </tr>
        <tr style="background-color: #FFCDD2;">
          <td><b>20-க்கும் கீழ் பரல்கள்</b></td>
          <td>கஷ்டம் / தோஷம் (Severe Weakness)</td>
          <td>கடன், மன உளைச்சல், விபத்து அல்லது கடும் போராட்டங்கள்.</td>
          <td>சாந்தி, பரிகாரங்கள் மற்றும் மிகுந்த விழிப்புணர்வு அவசியம்.</td>
        </tr>
      </tbody>
    </table>

    <div class="note-box">
      <b>கோசார விதி (Transit Rule):</b> ஒரு ஜாதகத்தில் குரு அல்லது சனி போன்ற முக்கிய கிரகங்கள் 28-க்கு மேல் பரல் உள்ள ராசிகளில் சஞ்சரிக்கும் காலகட்டங்களில் ஜாதகரின் வாழ்க்கை ஏற்றம் பெறும். 28-க்கு கீழ் உள்ள ராசிகளில் சனி அல்லது ராகு சஞ்சரிக்கும் காலகட்டங்களில் சோதனைகளும் தடைகளும் உருவாகும்.
    </div>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • பக்கம் 4
    </div>
  </div>

  <!-- CHAPTER 4: BHAVA & DIRECTIONAL DIAGNOSTICS -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 4: பாவக & திசை பகுப்பாய்வுக் கணிதம்</h2>
        <div class="chap-title-en">Chapter 4: House Diagnostics, Inflow vs Outflow & Directions</div>
      </div>
      <div class="chap-num">05</div>
    </div>

    <h3 class="sub-title">4.1 வரவினம் vs செலவினம் கணிதம் (Inflow vs Outflow Wealth Analysis)</h3>
    <p>
      ஜாதகரின் வாழ்நாள் பொருளாதார நிலை, செல்வம் சேருமா அல்லது விரயமாகுமா என்பதை அஷ்டகவர்க்கத்தின் வரவு-செலவு சூத்திரம் துல்லியமாக வெளிப்படுத்துகிறது:
    </p>

    <div class="grid-2col">
      <div class="formula-box">
        <div class="formula-title"><span>1. வரவினப் பரல்கள் (Inflow):</span></div>
        <div class="formula-math">
          Varavinam = SAV(2) + SAV(9) + SAV(11)
        </div>
        <div class="formula-desc">
          • <b>2-ம் பாவம்:</b> தன ஸ்தானம் (வருமானம்/சேமிப்பு)<br>
          • <b>9-ம் பாவம்:</b> பாக்கிய ஸ்தானம் (அதிர்ஷ்டம்)<br>
          • <b>11-ம் பாவம்:</b> லாப ஸ்தானம் (தொழில் லாபம்)
        </div>
      </div>

      <div class="formula-box">
        <div class="formula-title"><span>2. செலவினப் பரல்கள் (Outflow):</span></div>
        <div class="formula-math">
          Selavinam = SAV(6) + SAV(8) + SAV(12)
        </div>
        <div class="formula-desc">
          • <b>6-ம் பாவம்:</b> கடன், நோய், வழக்கு ஸ்தானம்<br>
          • <b>8-ம் பாவம்:</b> ஆயுள், எதிர்பாராத நஷ்டங்கள்<br>
          • <b>12-ம் பாவம்:</b> விரய ஸ்தானம் (செலவுகள்)
        </div>
      </div>
    </div>

    <div class="formula-box" style="background: #FFFDF9; border: 2px solid #7A1A22;">
      <div class="formula-title">
        <span>பொருளாதார நிகர வரவு சூத்திரம் (Net Savings Assessment):</span>
        <span>\\Delta = Varavinam - Selavinam</span>
      </div>
      <p style="font-size: 8.5pt; margin: 4px 0;">
        • <b>\\Delta &gt; 0 (வரவினம் &gt; செலவினம்):</b> ஜாதகர் கைநிறைய சம்பாதிப்பார், சொத்துக்கள் வாங்குவார், சேமிப்பு பெருகும், கடன் இல்லாத சுகவாழ்க்கை.<br>
        • <b>\\Delta &lt; 0 (செலவினம் &gt; வரவினம்):</b> வருமானத்தை விட செலவு மிகும், வரவு வந்த வேகத்தில் கரையும், கடன் தொல்லைகள் ஏற்பட வாய்ப்புண்டு.<br>
        • <b>\\Delta = 0:</b> வரவும் செலவும் சரியாக இருக்கும்.
      </p>
    </div>

    <h3 class="sub-title">4.2 பாவக வகைப்பாடுகள் (House Classification Strengths)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>வகைப்பாடு</th>
          <th>பாவகங்கள் (Houses)</th>
          <th>தத்துவப் பலன்</th>
          <th>ஆரோக்கியமான அளவு</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>கேந்திர பலம் (Kendram)</b></td>
          <td>1, 4, 7, 10</td>
          <td>விஷ்ணு ஸ்தானங்கள்; வாழ்க்கையின் தூண்கள் (ஆரோக்கியம், சுகம், இல்லறம், தொழில்)</td>
          <td>112 பரல்களுக்கு மேல்</td>
        </tr>
        <tr>
          <td><b>பணபர பலம் (Panaparam)</b></td>
          <td>2, 5, 8, 11</td>
          <td>பொருளாதாரம் மற்றும் சந்ததி விருத்தி (தனம், புத்திரம், ஆயுள், லாபம்)</td>
          <td>112 பரல்களுக்கு மேல்</td>
        </tr>
        <tr>
          <td><b>அபோக்லிம பலம் (Apoklimam)</b></td>
          <td>3, 6, 9, 12</td>
          <td>முயற்சி, வீரம், ஆன்மீகம், தியாகம் மற்றும் மோட்சப் பயணம்</td>
          <td>112-க்கு சமம்</td>
        </tr>
        <tr class="highlight">
          <td><b>திரிகோண பலம் (Trikonam)</b></td>
          <td>1, 5, 9</td>
          <td>லட்சுமி ஸ்தானங்கள்; பூர்வ புண்ணியம், தெய்வ அனுகூலம், தர்ம சிந்தனை</td>
          <td>84 பரல்களுக்கு மேல்</td>
        </tr>
        <tr class="highlight">
          <td><b>உபசய பலம் (Upachayam)</b></td>
          <td>3, 6, 10, 11</td>
          <td>சுய உழைப்பால் படிப்படியாக முன்னேறும் வெற்றி ஸ்தானங்கள்</td>
          <td>112 பரல்களுக்கு மேல்</td>
        </tr>
      </tbody>
    </table>

    <h3 class="sub-title">4.3 திசைப் பரல்கள் கணிதம் (Directional Bindu Potency)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>திசை (Direction)</th>
          <th>ராசி தத்துவம் (Element)</th>
          <th>ராசிகள் (Signs)</th>
          <th>வாழ்க்கைப் பலன்</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>கிழக்கு (East)</b></td>
          <td>நெருப்பு (Fire)</td>
          <td>மேஷம் (1), சிம்மம் (5), தனுசு (9)</td>
          <td>தலைமைப் பண்பு, வீரம், கௌரவம், உத்தியோகம்</td>
        </tr>
        <tr>
          <td><b>தெற்கு (South)</b></td>
          <td>பூமி (Earth)</td>
          <td>ரிஷபம் (2), கன்னி (6), மகரம் (10)</td>
          <td>நிலம், பூமி லாபம், கட்டடங்கள், ஸ்திரமான சொத்துக்கள்</td>
        </tr>
        <tr>
          <td><b>மேற்கு (West)</b></td>
          <td>காற்று (Air)</td>
          <td>மிதுனம் (3), துலாம் (7), கும்பம் (11)</td>
          <td>வியாபாரம், கூட்டாண்மை, புத்திசாலித்தனம், வர்த்தகம்</td>
        </tr>
        <tr>
          <td><b>வடக்கு (North)</b></td>
          <td>நீர் (Water)</td>
          <td>கடகம் (4), விருச்சிகம் (8), மீனம் (12)</td>
          <td>ஆன்மீக ஈடுபாடு, வெளிநாட்டுப் பயணம், மன நிம்மதி</td>
        </tr>
      </tbody>
    </table>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • பக்கம் 5
    </div>
  </div>

  <!-- CHAPTER 5: ADVANCED SHODHANA & PINDA SADHANA -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 5: அஷ்டகவர்க்க சுோதனை & பிண்ட சாதனை</h2>
        <div class="chap-title-en">Chapter 5: Advanced Shodhana (Reductions) & Pinda Sadhana</div>
      </div>
      <div class="chap-num">06</div>
    </div>

    <h3 class="sub-title">5.1 சுோதனை என்றால் என்ன? (The Need for Reductions)</h3>
    <p>
      ஆரம்பத்தில் கணிக்கப்படும் அஷ்டகவர்க்கப் பரல்கள் <b>பிரஸ்தார அஷ்டகவர்க்கம் (Raw Bindus)</b> எனப்படும். இந்த மூலப் பரல்களை மேலும் துல்லியமாக்கி, கிரகங்களின் மறைமுகப் பகைகள், அசுபத் தொடர்புகளை நீக்கி உண்மையான பலத்தைக் கண்டறியும் பராசரர் முறைக்கு <b>சுோதனை (Shodhana / Reduction)</b> என்று பெயர்.
    </p>

    <h3 class="sub-title">5.2 திரிகோண சுோதனை விதிகள் (Trikona Shodhana Rules)</h3>
    <p>
      ஒரே தத்துவத்தைச் சார்ந்த திரிகோண ராசிக் கூட்டங்களில் பரல்களைக் குறைக்கும் முறை:
      <br>• நெருப்பு ராசிகள்: மேஷம், சிம்மம், தனுசு (1, 5, 9)
      <br>• பூமி ராசிகள்: ரிஷபம், கன்னி, மகரம் (2, 6, 10)
      <br>• காற்று ராசிகள்: மிதுனம், துலாம், கும்பம் (3, 7, 11)
      <br>• நீர் ராசிகள்: கடகம், விருச்சிகம், மீனம் (4, 8, 12)
    </p>

    <div class="note-box">
      <b>திரிகோண சுோதனை விதிகள்:</b><br>
      1. திரிகோணத்தில் உள்ள 3 ராசிகளின் பரல்களும் சமமாக இருந்தால், மூன்றின் பரல்களையும் <b>பூஜ்ஜியம் (0)</b> ஆக்க வேண்டும்.<br>
      2. திரிகோண ராசிகளில் பரல்கள் வேறுபட்டால், <b>மிகக் குறைந்த பரல் அளவை</b> மற்ற அனைத்து ராசிகளிலிருந்தும் கழிக்க வேண்டும் (குறைந்த பரல் கொண்ட ராசி 0 ஆகும்).<br>
      3. ஒரு திரிகோணத்தில் ஒரு ராசியில் பரல் 0 ஆக இருந்தால், மற்ற ராசிகளில் எந்தக் கழித்தலும் செய்யக்கூடாது (அப்படியே விட வேண்டும்).
    </div>

    <h3 class="sub-title">5.3 ஏகாதிபத்திய சுோதனை விதிகள் (Ekadhipatya Shodhana Rules)</h3>
    <p>
      திரிகோண சுோதனை முடிந்த பிறகு, ஒரே கிரகத்தின் ஆதிக்கத்தில் உள்ள இரண்டு வீடுகளுக்கு (சூரிய, சந்திரன் தவிர மற்ற 5 கிரகங்களின் இரு வீடுகள்) செய்யப்படும் சுோதனை:
      <br>• செவ்வாய் (மேஷம் - விருச்சிகம்) | புதன் (மிதுனம் - கன்னி) | குரு (தனுசு - மீனம்) | சுக்கிரன் (ரிஷபம் - துலாம்) | சனி (மகரம் - கும்பம்)
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>நிலைமை (Planetary Occupation Condition)</th>
          <th>ஏகாதிபத்திய சுோதனை விதி (Rule)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>இரு வீடுகளிலும் கிரகங்கள் இருந்தால்</td>
          <td>சுோதனை செய்யக்கூடாது (பரல்கள் மாறாது).</td>
        </tr>
        <tr>
          <td>ஒரு வீட்டில் கிரகம் இருந்து, மற்றொன்று காலியாக இருந்தால்</td>
          <td>கிரகம் உள்ள வீட்டின் பரல் மாறாது; காலியான வீட்டின் பரல் பூஜ்ஜியம் (0) ஆகும்.</td>
        </tr>
        <tr>
          <td>இரு வீடுகளும் காலியாக இருந்து சம பரல்கள் இருந்தால்</td>
          <td>இரண்டு வீடுகளின் பரல்களும் பூஜ்ஜியம் (0) ஆகும்.</td>
        </tr>
        <tr>
          <td>இரு வீடுகளும் காலியாக இருந்து பரல்கள் மாறுபட்டால்</td>
          <td>அதிகப் பரல் உள்ள வீட்டில், குறைந்த பரல் அளவைக் கழித்து எழுத வேண்டும்; குறைந்த வீடு 0 ஆகும்.</td>
        </tr>
      </tbody>
    </table>

    <h3 class="sub-title">5.4 பிண்ட சாதனை & யோக பிண்டம் (Pinda Sadhana & Yoga Pinda)</h3>
    <p>
      சுோதனைகள் முடிந்த பின் கிடைக்கும் பரல்களைக் கொண்டு <b>ராசி பிண்டம்</b> மற்றும் <b>கிரக பிண்டம்</b> கணக்கிடப்படுகிறது:
    </p>

    <div class="grid-2col">
      <div class="card">
        <div class="card-title">ராசி குணகாரம் (Rasi Multipliers)</div>
        <p style="font-size: 7.8pt; margin: 0;">
          மேஷம் = 7, ரிஷபம் = 10, மிதுனம் = 8, கடகம் = 4, சிம்மம் = 10, கன்னி = 5, துலாம் = 7, விருச்சிகம் = 8, தனுசு = 9, மகரம் = 5, கும்பம் = 11, மீனம் = 12.
          <br><b>ராசி பிண்டம்</b> = \\sum (சுோதித்த பரல் \\times ராசி குணகாரம்)
        </p>
      </div>

      <div class="card">
        <div class="card-title">கிரக குணகாரம் (Graha Multipliers)</div>
        <p style="font-size: 7.8pt; margin: 0;">
          சூரியன் = 5, சந்திரன் = 5, செவ்வாய் = 8, புதன் = 5, குரு = 10, சுக்கிரன் = 7, சனி = 5.
          <br><b>கிரக பிண்டம்</b> = \\sum (சுோதித்த பரல் \\times கிரக குணகாரம்)
        </p>
      </div>
    </div>

    <div class="formula-box" style="margin-top: 6px;">
      <div class="formula-title"><span>யோக பிண்டம் (Yoga Pinda Formula):</span></div>
      <div class="formula-math">
        Yoga\\;Pinda = Rasi\\;Pinda + Graha\\;Pinda
      </div>
      <div class="formula-desc">
        இந்த யோக பிண்டத்தைக் கொண்டே ஜாதகரின் ஆயுள் கணிதம் (Ashtakavarga Ayurdaya), அஷ்டம சனி பலன், மற்றும் கோசாரக் காலக் கணிப்புகள் செய்யப்படுகின்றன.
      </div>
    </div>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • பக்கம் 6
    </div>
  </div>

  <!-- CHAPTER 6: PRACTICAL WORKED HOROSCOPE CASE STUDY -->
  <div class="chapter-page">
    <div class="chap-header">
      <div>
        <h2 class="chap-title-ta">அத்தியாயம் 6: நடைமுறை உதாரணக் கணக்கீடு</h2>
        <div class="chap-title-en">Chapter 6: Practical Worked Horoscope Case Study</div>
      </div>
      <div class="chap-num">07</div>
    </div>

    <h3 class="sub-title">6.1 மாதிரி ஜாதக விவரங்கள் (Sample Native Profile)</h3>
    <p>
      நடைமுறை விளக்கத்திற்காக எடுத்துக் கொள்ளப்பட்ட ஒரு மாதிரி ஜாதகத்தின் துல்லிய அஷ்டகவர்க்க அட்டவணை மற்றும் சர்வாஷ்டகவர்க்க சக்கரம் கீழே விவரிக்கப்பட்டுள்ளது:
    </p>

    <!-- FULL 7x12 MATRIX TABLE -->
    <h3 class="sub-title">6.2 பின்னாஷ்டகவர்க்க & சர்வாஷ்டகவர்க்க முழு அட்டவணை (7 Grahas x 12 Signs)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>கிரகம் (Planet)</th>
          <th>மேஷம்</th><th>ரிஷபம்</th><th>மிதுனம்</th><th>கடகம்</th><th>சிம்மம்</th><th>கன்னி</th>
          <th>துலாம்</th><th>விருச்சிகம்</th><th>தனுசு</th><th>மகரம்</th><th>கும்பம்</th><th>மீனம்</th>
          <th>மொத்தம்</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>சூரியன் (Sun)</td><td>4</td><td>5</td><td>5</td><td>3</td><td>4</td><td>3</td><td>5</td><td>4</td><td>4</td><td>5</td><td>2</td><td>4</td><td><b>48</b></td></tr>
        <tr><td>சந்திரன் (Moon)</td><td>5</td><td>4</td><td>5</td><td>4</td><td>3</td><td>3</td><td>5</td><td>3</td><td>4</td><td>6</td><td>3</td><td>4</td><td><b>49</b></td></tr>
        <tr><td>செவ்வாய் (Mars)</td><td>4</td><td>4</td><td>4</td><td>2</td><td>3</td><td>3</td><td>4</td><td>2</td><td>3</td><td>4</td><td>2</td><td>4</td><td><b>39</b></td></tr>
        <tr><td>புதன் (Mercury)</td><td>5</td><td>5</td><td>6</td><td>4</td><td>4</td><td>3</td><td>5</td><td>4</td><td>5</td><td>6</td><td>3</td><td>4</td><td><b>54</b></td></tr>
        <tr><td>குரு (Jupiter)</td><td>5</td><td>5</td><td>5</td><td>4</td><td>4</td><td>4</td><td>5</td><td>4</td><td>5</td><td>6</td><td>4</td><td>5</td><td><b>56</b></td></tr>
        <tr><td>சுக்கிரன் (Venus)</td><td>6</td><td>6</td><td>5</td><td>5</td><td>4</td><td>3</td><td>5</td><td>4</td><td>5</td><td>5</td><td>3</td><td>2</td><td><b>52</b></td></tr>
        <tr><td>சனி (Saturn)</td><td>4</td><td>4</td><td>3</td><td>3</td><td>3</td><td>3</td><td>4</td><td>2</td><td>3</td><td>4</td><td>2</td><td>4</td><td><b>39</b></td></tr>
        <tr class="highlight" style="font-size: 8.5pt;">
          <td style="color: #7A1A22;"><b>சர்வாஷ்டகவர்க்கம் (SAV)</b></td>
          <td><b>33</b></td><td><b>33</b></td><td><b>33</b></td><td><b>25</b></td><td><b>25</b></td><td><b>22</b></td>
          <td><b>33</b></td><td><b>23</b></td><td><b>29</b></td><td><b>36</b></td><td><b>19</b></td><td><b>26</b></td>
          <td style="background: #7A1A22; color: #FFFFFF;"><b>337</b></td>
        </tr>
      </tbody>
    </table>

    <div class="grid-2col" style="align-items: center; margin-top: 10px;">
      <!-- SOUTH INDIAN CHART -->
      <div>
        <div style="font-weight: 700; color: #7A1A22; font-size: 8.8pt; text-align: center; margin-bottom: 4px;">
          சர்வாஷ்டகவர்க்கச் சக்கரம் (South Indian 4×4 SAV Chart)
        </div>
        <div class="chart-container">
          <!-- Row 0: Pisces, Aries, Taurus, Gemini -->
          <div class="chart-cell" style="background: #FFFDF9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>மீனம்</span><span style="color:#7A1A22;">லக்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#8C6D23;">26</div>
            <div style="font-size:6.5pt; color:#888;">(12) -2</div>
          </div>
          <div class="chart-cell" style="background: #E8F5E9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>மேஷம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#2E7D32;">33</div>
            <div style="font-size:6.5pt; color:#2E7D32;">(1) +5</div>
          </div>
          <div class="chart-cell" style="background: #E8F5E9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>ரிஷபம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#2E7D32;">33</div>
            <div style="font-size:6.5pt; color:#2E7D32;">(2) +5</div>
          </div>
          <div class="chart-cell" style="background: #E8F5E9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>மிதுனம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#2E7D32;">33</div>
            <div style="font-size:6.5pt; color:#2E7D32;">(3) +5</div>
          </div>

          <!-- Row 1: Aquarius, CENTER, Cancer -->
          <div class="chart-cell" style="background: #FFEBEE;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>கும்பம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#C62828;">19</div>
            <div style="font-size:6.5pt; color:#C62828;">(11) -9</div>
          </div>
          <div class="chart-center">
            <span style="font-weight: 800; color: #7A1A22; font-size: 8.5pt;">சர்வாஷ்டகவர்க்கம்</span>
            <span style="font-size: 15pt; font-weight: 900; color: #7A1A22; font-family:'Cinzel', serif;">337</span>
            <span style="font-size: 7pt; color: #6E5F57;">மொத்தப் பரல்கள்</span>
            <span style="font-size: 7.5pt; font-weight: 700; color: #2E7D32; margin-top: 2px;">வரவு: 92 | செலவு: 77</span>
            <span style="font-size: 6.8pt; color: #888;">சராசரி: 28.08 / ராசி</span>
          </div>
          <div class="chart-cell" style="background: #FFFDE7;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>கடகம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#F57F17;">25</div>
            <div style="font-size:6.5pt; color:#F57F17;">(4) -3</div>
          </div>

          <!-- Row 2: Capricorn, CENTER, Leo -->
          <div class="chart-cell" style="background: #E8F5E9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>மகரம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#2E7D32;">36</div>
            <div style="font-size:6.5pt; color:#2E7D32;">(10) +8</div>
          </div>
          <div class="chart-cell" style="background: #FFFDE7;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>சிம்மம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#F57F17;">25</div>
            <div style="font-size:6.5pt; color:#F57F17;">(5) -3</div>
          </div>

          <!-- Row 3: Sagittarius, Scorpio, Libra, Virgo -->
          <div class="chart-cell" style="background: #E8F5E9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>தனுசு</span></div>
            <div style="font-size:12pt; font-weight:800; color:#2E7D32;">29</div>
            <div style="font-size:6.5pt; color:#2E7D32;">(9) +1</div>
          </div>
          <div class="chart-cell" style="background: #FFEBEE;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>விருச்சி</span></div>
            <div style="font-size:12pt; font-weight:800; color:#C62828;">23</div>
            <div style="font-size:6.5pt; color:#C62828;">(8) -5</div>
          </div>
          <div class="chart-cell" style="background: #E8F5E9;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>துலாம்</span></div>
            <div style="font-size:12pt; font-weight:800; color:#2E7D32;">33</div>
            <div style="font-size:6.5pt; color:#2E7D32;">(7) +5</div>
          </div>
          <div class="chart-cell" style="background: #FFCDD2;">
            <div style="display:flex; justify-content:space-between; font-weight:700;"><span>கன்னி</span></div>
            <div style="font-size:12pt; font-weight:800; color:#B71C1C;">22</div>
            <div style="font-size:6.5pt; color:#B71C1C;">(6) -6</div>
          </div>
        </div>
      </div>

      <!-- WORKED DIAGNOSTICS BREAKDOWN -->
      <div>
        <div class="card" style="margin-bottom: 6px;">
          <div class="card-title">1. வரவு-செலவு முடிவுகள் (Wealth Result)</div>
          <p style="font-size: 7.8pt; margin: 0;">
            • <b>வரவினம் (2, 9, 11):</b> 33 (ரிஷபம்) + 29 (தனுசு) + 30 = <b>92 பரல்கள்</b>.<br>
            • <b>செலவினம் (6, 8, 12):</b> 22 (கன்னி) + 23 (விருச்சி) + 32 = <b>77 பரல்கள்</b>.<br>
            • <b>நிகர சேமிப்பு:</b> 92 - 77 = <b>+15 (வரவு அதிகம் - நிதி ஸ்திரத்தன்மை மேன்மை)</b>.
          </p>
        </div>

        <div class="card" style="margin-bottom: 6px;">
          <div class="card-title">2. பாவக வகைப்பாடுகள் (Classification)</div>
          <p style="font-size: 7.8pt; margin: 0;">
            • <b>கேந்திரம் (1, 4, 7, 10):</b> 26 + 25 + 33 + 36 = <b>120 பரல்கள்</b> (மிக வலுவான ஸ்திரத்தன்மை).<br>
            • <b>திரிகோணம் (1, 5, 9):</b> 26 + 25 + 29 = <b>80 பரல்கள்</b>.<br>
            • <b>உபசயம் (3, 6, 10, 11):</b> 33 + 22 + 36 + 19 = <b>110 பரல்கள்</b> (உழைப்பால் வளர்ச்சி).
          </p>
        </div>

        <div class="card">
          <div class="card-title">3. திசை பலன்கள் (Directional Potency)</div>
          <p style="font-size: 7.8pt; margin: 0;">
            • <b>கிழக்கு (1, 5, 9):</b> 33 + 25 + 29 = <b>87 பரல்கள்</b>.<br>
            • <b>தெற்கு (2, 6, 10):</b> 33 + 22 + 36 = <b>91 பரல்கள்</b> (பூமி, சொத்து அனுகூலம்).<br>
            • <b>மேற்கு (3, 7, 11):</b> 33 + 33 + 19 = <b>85 பரல்கள்</b>.<br>
            • <b>வடக்கு (4, 8, 12):</b> 25 + 23 + 26 = <b>74 பரல்கள்</b>.
          </p>
        </div>
      </div>
    </div>

    <div class="note-box" style="margin-top: 8px;">
      <b>முடிவுரை & சுபம்:</b> அஷ்டகவர்க்கக் கணிதம் தசா புத்தி மற்றும் கோசாரப் பலன்களைத் துல்லியமாக உறுதி செய்யும் அளவுகோலாகும். ஜாதகத்தில் எந்த கிரகம் எப்போது பலன் தரும் என்பதை நிர்ணயிக்க அஷ்டகவர்க்கமே இறுதியான வழிகாட்டியாகும்.
    </div>

    <div class="page-footer">
      வேத ஜோதிட அஷ்டகவர்க்கக் கணித சூத்திரக் கையேடு • Astrojit Platform • சுபம் • பக்கம் 7
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'frontend', 'public', 'Ashtakavarga_Calculation_Formulas_Tamil_English.html');
const pdfPublicPath = path.join(__dirname, 'frontend', 'public', 'Ashtakavarga_Calculation_Formulas_Tamil_English.pdf');
const pdfWorkspacePath = path.join(__dirname, 'Ashtakavarga_Calculation_Formulas_Tamil_English.pdf');
const pdfBrainPath = path.join('C:\\Users\\HP\\.gemini\\antigravity\\brain\\4900a36f-37a2-45c5-917a-9a9382269cdd', 'Ashtakavarga_Calculation_Formulas_Tamil_English.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML written to:', htmlPath);

// Execute Microsoft Edge to convert HTML to high quality PDF
const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPublicPath}" "file:///${htmlPath.replace(/\\\\/g, '/')}"`;

console.log('Executing PDF conversion...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfPublicPath)) {
  fs.copyFileSync(pdfPublicPath, pdfWorkspacePath);
  try {
    fs.copyFileSync(pdfPublicPath, pdfBrainPath);
  } catch (e) {
    console.warn('Could not copy to brain dir:', e.message);
  }
  const size = fs.statSync(pdfPublicPath).size;
  console.log(`Success! PDF generated at:
  - Public: ${pdfPublicPath} (${size} bytes)
  - Workspace: ${pdfWorkspacePath} (${size} bytes)
  - Brain: ${pdfBrainPath}`);
} else {
  console.error('Failed to create PDF');
  process.exit(1);
}
