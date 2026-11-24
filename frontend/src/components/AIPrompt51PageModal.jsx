import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, X, FileText, CheckCircle2 } from 'lucide-react';
import { useLang } from '../i18n';

export default function AIPrompt51PageModal({
  isOpen,
  onClose,
  birthData,
  horoscopeData
}) {
  const { lang } = useLang();
  const isTa = lang === 'ta';
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('formatted'); // 'formatted' | 'raw'

  if (!isOpen) return null;

  const nativeName = birthData?.name || (isTa ? 'ஜாதகர்' : 'Native');
  const dob = birthData?.dob || 'YYYY-MM-DD';
  const dobTime = birthData?.dobTime12 || birthData?.dobTime || 'HH:MM AM';
  const place = birthData?.placeName || birthData?.city || 'Place of Birth';
  const lat = birthData?.lat ? `${birthData.lat}° N` : '';
  const lon = birthData?.lon ? `${birthData.lon}° E` : '';
  const coords = lat && lon ? `${lat}, ${lon}` : '';

  // Generate the customized 51-Page Analysis Prompt
  const generatePromptText = () => {
    return `# Complete Vedic Astrology Jathagam Analysis – 51-Page PDF

Act as an experienced Vedic astrologer specializing in traditional South Indian Parashari astrology, Tamil Jothidam, planetary calculations, Dasa–Bhukti analysis, and horoscope interpretation.

I have uploaded a 51-page Tamil Jathagam PDF from Jishnu Astro & Vasthu Research Centre.
${nativeName ? `Native / Jathagar: ${nativeName} | Date of Birth: ${dob} | Time: ${dobTime} | Place: ${place} ${coords ? `(${coords})` : ''}` : ''}

Your task is to carefully examine **all 51 pages**, including written content, planetary tables, Rasi charts, Navamsam charts, Bhava charts, calculations, and visual diagrams.

Do not skip any page.

## 1. Extract Birth Details
Identify and verify:
- Name, gender, date of birth and time of birth.
- Birthplace and geographical coordinates.
- Lagna (Ascendant).
- Rasi (Moon sign).
- Nakshatra and Pada.
- Tamil calendar details.
- Ayanamsa used.
- Planetary positions and retrograde status.

Create a structured birth-details table.

## 2. Complete Horoscope Analysis
Analyse the following:
- Rasi chart (D1).
- Navamsam chart (D9).
- Drekkana chart (D3).
- Other divisional charts included in the PDF.
- Twelve houses and their lords.
- Planetary placements and aspects.
- Exalted, debilitated, own-sign and retrograde planets.
- Benefic and malefic planetary influences.
- Planetary strengths and weaknesses.

Explain each finding in simple language.

## 3. Personality and Life Characteristics
Analyse:
- Personality and character.
- Mental strength and decision-making.
- Intelligence and communication.
- Leadership qualities.
- Spiritual inclination.
- Strengths and weaknesses.
- Natural talents and potential.

## 4. Education and Career
Provide detailed predictions concerning:
- Education and higher studies.
- Technical and professional education.
- Government or private employment.
- Business and entrepreneurship.
- Foreign employment opportunities.
- Career growth and professional recognition.
- Suitable career fields.
- Favourable career periods.

## 5. Financial Status and Wealth
Analyse:
- Income potential.
- Wealth accumulation.
- Savings and investments.
- Property and land ownership.
- Financial stability.
- Business income.
- Financial challenges and favourable periods.

## 6. Marriage and Family Life
Analyse:
- Marriage prospects.
- Possible marriage period.
- 7th-house and 7th-lord analysis.
- Venus and Jupiter influences.
- Navamsam interpretation.
- Spouse characteristics.
- Compatibility considerations.
- Family life and marital stability.
- Children and progeny indications.

Do not invent an exact marriage date or spouse details if the chart cannot establish them.

## 7. Health and Longevity
Analyse traditional astrological health indicators, including:
- 1st, 6th, 8th and 12th houses.
- Planetary afflictions.
- General vitality.
- Traditional astrological health tendencies.

Do not diagnose medical conditions or predict death.

## 8. Dasa–Bhukti Analysis
Carefully examine all Mahadasha and Antardasha tables in the PDF.

For each period, explain:
- Starting and ending dates.
- Planetary influences.
- Career opportunities.
- Financial developments.
- Marriage and family prospects.
- Education and personal growth.
- Challenges and favourable opportunities.

Pay particular attention to the current and upcoming Dasa–Bhukti periods.

Verify all dates against the original PDF.

## 9. Yogas, Doshas and Planetary Strength
Identify and explain:
- Raja Yogas.
- Dhana Yogas.
- Gaja Kesari Yoga, if applicable.
- Other relevant planetary combinations.
- Doshas explicitly supported by the chart.
- Rahu–Ketu influences.
- Saturn influences.
- Planetary friendships and enmities.
- Shadbala and other strength calculations, where available.

Do not claim a yoga or dosha without verifying its required conditions.

## 10. Important Life Periods
Prepare a chronological life analysis covering:
- Childhood.
- School and college education.
- Early career.
- Career development.
- Marriage.
- Financial development.
- Property and assets.
- Family responsibilities.
- Later life.

Identify favourable and challenging periods based on the supplied Dasa–Bhukti calculations.

## 11. Remedies and Spiritual Guidance
Based on the chart and traditional astrology:
- Identify relevant planetary remedies.
- Suggest appropriate mantras.
- Suggest traditional temple worship.
- Explain fasting or charitable practices where relevant.
- Recommend remedies only when supported by the horoscope.

Distinguish traditional beliefs from scientifically established facts.

## 12. Final Horoscope Summary
Provide:
1. Overall horoscope strength.
2. Strongest planets.
3. Weakest or afflicted planets.
4. Most favourable houses.
5. Major life opportunities.
6. Important challenges.
7. Career prospects.
8. Marriage prospects.
9. Financial prospects.
10. Spiritual development.
11. Important upcoming Dasa–Bhukti periods.

## Important Instructions
- Analyse the entire 51-page PDF, not just the first few pages.
- Inspect chart images and tables instead of depending exclusively on extracted text.
- The source is in Tamil; interpret the original Tamil terminology accurately.
- Present the explanation in clear, understandable English.
- Preserve the original planetary positions, calculations and dates.
- Never fabricate missing birth details, planetary placements or predictions.
- If any information is unclear, identify the exact page and ask for clarification.
- Distinguish information extracted from the PDF from your own astrological interpretation.
- Explain the reasoning behind every major prediction.
- Do not present astrological predictions as guaranteed events.

**Final objective:** Deliver a complete, detailed, professionally structured Vedic astrology report based exclusively on the uploaded 51-page Jathagam, with particular attention to accuracy, traditional astrological principles and practical explanations.`;
  };

  const promptText = generatePromptText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy prompt:', e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `51-Page-Vedic-Astrology-Analysis-Prompt-${birthData?.name || 'Native'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sectionsList = [
    { num: '1', title: 'Extract Birth Details', desc: 'Name, DOB, TOB, coordinates, Lagna, Rasi, Nakshatra, Pada, Ayanamsa, and retrogrades.' },
    { num: '2', title: 'Complete Horoscope Analysis', desc: 'D1, D9, D3, divisional charts, 12 houses, aspects, exalted/debilitated dignities.' },
    { num: '3', title: 'Personality & Life Characteristics', desc: 'Mental strength, intelligence, leadership, spirituality, natural talents.' },
    { num: '4', title: 'Education and Career', desc: 'Higher studies, technical/professional fields, govt/private job, business, foreign opportunities.' },
    { num: '5', title: 'Financial Status & Wealth', desc: 'Income potential, property, savings, investments, stability, and growth periods.' },
    { num: '6', title: 'Marriage & Family Life', desc: 'Marriage timing, 7th house & lord, Venus/Jupiter, spouse nature, progeny indications.' },
    { num: '7', title: 'Health and Longevity', desc: '1st, 6th, 8th, 12th houses, vitality, planetary afflictions, traditional tendencies.' },
    { num: '8', title: 'Dasa–Bhukti Analysis', desc: 'Complete Mahadasha & Antardasha timeline with date-verified opportunities and challenges.' },
    { num: '9', title: 'Yogas, Doshas & Strength', desc: 'Raja Yogas, Dhana Yogas, Gaja Kesari, Sevvai/Rahu-Ketu doshas, Shadbala points.' },
    { num: '10', title: 'Important Life Periods', desc: 'Chronological life analysis from childhood, education, career, marriage, to later life.' },
    { num: '11', title: 'Remedies & Spiritual Guidance', desc: 'Authentic mantras, temple worship, fasting, and astrologically supported pariharams.' },
    { num: '12', title: 'Final Horoscope Summary', desc: 'Overall strength, strongest/weakest planets, key opportunities, and upcoming periods.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E1815] w-full max-w-3xl rounded-2xl shadow-2xl border border-amber-900/20 dark:border-amber-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#7A1A22] via-[#99222C] to-[#7A1A22] text-amber-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-xl shadow-inner">
              ✨
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>{isTa ? '51-பக்க ஜாதக AI ஆய்வு Prompt' : '51-Page Horoscope AI Analysis Prompt'}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-bold border border-amber-400/40">
                  51 Pages
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium">
                {isTa
                  ? '51-பக்க PDF-ஐ ChatGPT, Claude அல்லது Gemini-ல் பதிவேற்றி முழுமையான ஜோதிட பலனைப் பெற உதவும் Prompt'
                  : 'Master prompt to feed alongside your 51-Page PDF into ChatGPT, Claude, or Gemini for a full 51-page reading'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-amber-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* How to Use Instruction Banner */}
        <div className="bg-[#FAF6EE] dark:bg-[#251E1A] p-3 sm:p-4 border-b border-amber-900/10 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
            <Sparkles className="w-4 h-4 text-[#7A1A22] dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#7A1A22] dark:text-amber-300">
                {isTa ? 'பயன்படுத்தும் முறை:' : 'How to Use:'}
              </span>{' '}
              <span className="font-medium">
                {isTa
                  ? '1) 51-பக்க PDF பதிவிறக்குக ➔ 2) இந்த Prompt-ஐ நகலெடுக்கவும் ➔ 3) ChatGPT / Claude / Gemini-ல் PDF உடன் சேர்த்து சமர்ப்பிக்கவும்.'
                  : '1) Save 51-page PDF ➔ 2) Copy this prompt ➔ 3) Upload PDF + paste prompt into ChatGPT / Claude / Gemini for deep reading.'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-stone-300 dark:border-stone-700"
              title={isTa ? 'Markdown கோப்பாக பதிவிறக்குக' : 'Download as .md file'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isTa ? 'பதிவிறக்கு' : 'Download .md'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#7A1A22] hover:bg-[#5C1017] text-amber-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (isTa ? 'Prompt நகலெடு' : 'Copy Prompt')}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-4 pt-3 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('formatted')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formatted'
                ? 'border-[#7A1A22] text-[#7A1A22] dark:border-amber-400 dark:text-amber-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isTa ? '12 ஆய்வுப் பகுதிகள் (கட்டமைப்பு)' : '12 Analysis Sections (Structured)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'raw'
                ? 'border-[#7A1A22] text-[#7A1A22] dark:border-amber-400 dark:text-amber-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTa ? 'முழு Markdown Text' : 'Full Raw Prompt'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {activeTab === 'formatted' ? (
            <div className="space-y-3">
              {/* Native Brief Badge */}
              {birthData?.name && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-[#7A1A22] dark:text-amber-300">
                    👤 {nativeName} • {dob} ({dobTime}) • {place}
                  </span>
                  <span className="text-stone-500 font-mono">
                    Jishnu Astro & Vasthu Research Centre
                  </span>
                </div>
              )}

              {/* 12 Sections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sectionsList.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#1A1513] space-y-1 hover:border-amber-700/30 transition-all"
                  >
                    <div className="flex items-center gap-2 font-black text-stone-900 dark:text-amber-200">
                      <span className="w-5 h-5 rounded-md bg-[#7A1A22] text-amber-100 flex items-center justify-center text-[10px] shrink-0">
                        {sec.num}
                      </span>
                      <span>{sec.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug pl-7">
                      {sec.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Strict Guidelines Box */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-[11px] space-y-1 text-stone-600 dark:text-stone-300">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <span>📌</span>
                  <span>{isTa ? 'முக்கிய விதிகள் & வழிகாட்டுதல்கள்:' : 'Important Instructions Enforced in Prompt:'}</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-[10.5px]">
                  <li>Examines all 51 pages without skipping any chart or table.</li>
                  <li>Accurately interprets traditional South Indian & Tamil astrological terminology into clear English.</li>
                  <li>Does not fabricate missing birth details or guess arbitrary dates.</li>
                  <li>Verifies all Mahadasha & Antardasha dates directly against the 51-page booklet.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="p-3 sm:p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                {promptText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 dark:bg-[#1A1412] border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 font-medium">
            {isTa ? 'ஆய்வுத் தரம்: பாரம்பரிய பராசர முறை (Parashari)' : 'Framework: Traditional South Indian Parashari System'}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7A1A22] hover:bg-[#5C1017] text-amber-100'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (isTa ? 'முழு Prompt நகலெடு' : 'Copy Full Prompt')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
