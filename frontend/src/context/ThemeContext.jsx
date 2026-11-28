import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

/**
 * Astronomical Lunar Phase definitions for Dark Mode Sky Light & Moon rendering.
 * Computes exact SVG terminator arcs inside a normalized 100x100 viewBox (cx=50, cy=50, r=42)
 * plus distinct sky-light gradients and starlight visibility per phase.
 */
export const DARK_MOON_PHASES = [
  {
    id: 'auto',
    labelEn: 'Auto (Tonight)',
    labelTa: 'தானியங்கி (இன்று)',
    shortLabel: 'Auto',
  },
  {
    id: 'full',
    labelEn: 'Full Moon (Purnima)',
    labelTa: 'பௌர்ணமி (முழு நிலவு)',
    shortLabel: 'Full Moon',
    phaseFrac: 0.5,
  },
  {
    id: 'waxing_gibbous',
    labelEn: 'Waxing Gibbous',
    labelTa: 'வளர்பிறை (பெரும் நிலவு)',
    shortLabel: 'Gibbous',
    phaseFrac: 0.37,
  },
  {
    id: 'first_quarter',
    labelEn: 'Half Moon (First Quarter)',
    labelTa: 'வளர்பிறை அஷ்டமி (அரை நிலவு)',
    shortLabel: 'Half Moon',
    phaseFrac: 0.25,
  },
  {
    id: 'waxing_crescent',
    labelEn: 'Waxing Crescent',
    labelTa: 'வளர்பிறை (பிறை நிலவு)',
    shortLabel: 'Crescent',
    phaseFrac: 0.12,
  },
  {
    id: 'new',
    labelEn: 'New Moon (Amavasya)',
    labelTa: 'அமாவாசை (புது நிலவு)',
    shortLabel: 'New Moon',
    phaseFrac: 0.0,
  },
  {
    id: 'waning_crescent',
    labelEn: 'Waning Crescent',
    labelTa: 'தேய்பிறை (பிறை நிலவு)',
    shortLabel: 'Waning Crescent',
    phaseFrac: 0.88,
  },
  {
    id: 'last_quarter',
    labelEn: 'Half Moon (Last Quarter)',
    labelTa: 'தேய்பிறை அஷ்டமி (அரை நிலவு)',
    shortLabel: 'Last Quarter',
    phaseFrac: 0.75,
  },
  {
    id: 'waning_gibbous',
    labelEn: 'Waning Gibbous',
    labelTa: 'தேய்பிறை (பெரும் நிலவு)',
    shortLabel: 'Waning Gibbous',
    phaseFrac: 0.63,
  },
];

// Reference New Moon epoch: 2000-01-06 18:14 UTC; Synodic month = 29.53058867 days
const SYNODIC_MONTH_MS = 29.53058867 * 86400000;
const NEW_MOON_EPOCH_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export function getAstronomicalPhaseFraction(dateObj = new Date()) {
  const diff = dateObj.getTime() - NEW_MOON_EPOCH_MS;
  const cycles = diff / SYNODIC_MONTH_MS;
  const frac = cycles - Math.floor(cycles);
  return frac < 0 ? frac + 1 : frac;
}

export function getLunarLitPath(phaseFrac, cx = 50, cy = 50, r = 42) {
  const f = ((phaseFrac % 1) + 1) % 1;
  // Near New Moon
  if (f < 0.025 || f > 0.975) return '';
  // Near Full Moon
  if (Math.abs(f - 0.5) < 0.025) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  }

  const cosP = Math.cos(f * 2 * Math.PI);
  const rx = Math.max(0.05, Math.abs(cosP) * r);
  const topY = cy - r;
  const botY = cy + r;

  if (f < 0.5) {
    // Waxing (right limb lit)
    const innerSweep = f <= 0.25 ? 0 : 1;
    return `M ${cx} ${topY} A ${r} ${r} 0 0 1 ${cx} ${botY} A ${rx.toFixed(2)} ${r} 0 0 ${innerSweep} ${cx} ${topY} Z`;
  }

  // Waning (left limb lit)
  const innerSweep = f <= 0.75 ? 1 : 0;
  return `M ${cx} ${botY} A ${r} ${r} 0 0 1 ${cx} ${topY} A ${rx.toFixed(2)} ${r} 0 0 ${innerSweep} ${cx} ${botY} Z`;
}

export function resolveMoonPhaseInfo(selectedPhaseId = 'auto', now = new Date()) {
  const preset = DARK_MOON_PHASES.find((p) => p.id === selectedPhaseId) || DARK_MOON_PHASES[0];
  const isAuto = preset.id === 'auto';
  const phaseFrac = isAuto ? getAstronomicalPhaseFraction(now) : preset.phaseFrac;
  const illum = (1 - Math.cos(phaseFrac * 2 * Math.PI)) / 2;
  const illumPct = Math.round(illum * 100);

  // Identify canonical phase label even in Auto mode
  let resolvedId = preset.id;
  if (isAuto) {
    if (phaseFrac < 0.04 || phaseFrac > 0.96) resolvedId = 'new';
    else if (phaseFrac < 0.21) resolvedId = 'waxing_crescent';
    else if (phaseFrac < 0.29) resolvedId = 'first_quarter';
    else if (phaseFrac < 0.46) resolvedId = 'waxing_gibbous';
    else if (phaseFrac < 0.54) resolvedId = 'full';
    else if (phaseFrac < 0.71) resolvedId = 'waning_gibbous';
    else if (phaseFrac < 0.79) resolvedId = 'last_quarter';
    else resolvedId = 'waning_crescent';
  }

  const canonical = DARK_MOON_PHASES.find((p) => p.id === resolvedId) || DARK_MOON_PHASES[1];

  // Atmospheric Sky Light profile based on lunar illumination
  let skyBg = 'linear-gradient(180deg, #020614 0%, #07112B 52%, #0C1A3D 100%)';
  let haloGradient = 'radial-gradient(circle, rgba(191,219,254,0.34) 0%, rgba(129,140,248,0.14) 48%, transparent 78%)';
  let starBoost = 1.0;
  let milkyWayOpacity = 0.28;
  let cardSurfaceBg = 'rgba(8, 15, 38, 0.76)';
  let cardSurfaceAltBg = 'rgba(12, 22, 52, 0.80)';
  let glassBorder = 'rgba(148, 163, 184, 0.20)';

  if (illumPct >= 88) {
    // Full Moon / Bright Purnima Sky Light
    skyBg = 'linear-gradient(180deg, #071330 0%, #0E2252 48%, #16306B 100%)';
    haloGradient = 'radial-gradient(circle, rgba(241,245,249,0.52) 0%, rgba(186,214,255,0.28) 42%, rgba(99,102,241,0.10) 70%, transparent 85%)';
    starBoost = 0.78;
    milkyWayOpacity = 0.14;
    cardSurfaceBg = 'rgba(11, 22, 52, 0.74)';
    cardSurfaceAltBg = 'rgba(15, 29, 66, 0.78)';
    glassBorder = 'rgba(191, 219, 254, 0.26)';
  } else if (illumPct >= 60) {
    // Waxing / Waning Gibbous
    skyBg = 'linear-gradient(180deg, #050D24 0%, #0B193F 50%, #112454 100%)';
    haloGradient = 'radial-gradient(circle, rgba(226,232,240,0.40) 0%, rgba(147,197,253,0.19) 46%, transparent 78%)';
    starBoost = 0.9;
    milkyWayOpacity = 0.22;
    cardSurfaceBg = 'rgba(9, 17, 42, 0.75)';
    cardSurfaceAltBg = 'rgba(13, 24, 58, 0.80)';
    glassBorder = 'rgba(165, 180, 252, 0.22)';
  } else if (illumPct >= 38) {
    // Half Moon (First / Last Quarter)
    skyBg = 'linear-gradient(180deg, #03091B 0%, #081331 52%, #0D1C44 100%)';
    haloGradient = 'radial-gradient(circle, rgba(203,213,225,0.32) 0%, rgba(129,140,248,0.14) 48%, transparent 78%)';
    starBoost = 1.05;
    milkyWayOpacity = 0.30;
    cardSurfaceBg = 'rgba(7, 14, 35, 0.77)';
    cardSurfaceAltBg = 'rgba(11, 20, 48, 0.82)';
    glassBorder = 'rgba(148, 163, 184, 0.20)';
  } else if (illumPct >= 10) {
    // Crescent Moon
    skyBg = 'linear-gradient(180deg, #020512 0%, #050D24 55%, #091536 100%)';
    haloGradient = 'radial-gradient(circle, rgba(191,219,254,0.22) 0%, rgba(99,102,241,0.09) 48%, transparent 76%)';
    starBoost = 1.22;
    milkyWayOpacity = 0.40;
    cardSurfaceBg = 'rgba(5, 11, 29, 0.78)';
    cardSurfaceAltBg = 'rgba(9, 17, 42, 0.83)';
    glassBorder = 'rgba(129, 140, 248, 0.18)';
  } else {
    // New Moon (Amavasya) — Deepest Starlit Midnight Sky
    skyBg = 'linear-gradient(180deg, #01030A 0%, #030718 55%, #060E28 100%)';
    haloGradient = 'radial-gradient(circle, rgba(129,140,248,0.14) 0%, rgba(67,56,202,0.05) 52%, transparent 76%)';
    starBoost = 1.4;
    milkyWayOpacity = 0.50;
    cardSurfaceBg = 'rgba(4, 9, 24, 0.79)';
    cardSurfaceAltBg = 'rgba(7, 14, 36, 0.84)';
    glassBorder = 'rgba(99, 102, 241, 0.18)';
  }

  return {
    selectedId: preset.id,
    resolvedId,
    isAuto,
    phaseFrac,
    illum,
    illumPct,
    labelEn: canonical.labelEn,
    labelTa: canonical.labelTa,
    shortLabel: canonical.shortLabel,
    litPath: getLunarLitPath(phaseFrac, 50, 50, 42),
    skyBg,
    haloGradient,
    starBoost,
    milkyWayOpacity,
    cardSurfaceBg,
    cardSurfaceAltBg,
    glassBorder,
  };
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('astrojit_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  const [nowDate, setNowDate] = useState(() => new Date());

  useEffect(() => {
    try {
      localStorage.removeItem('astrojit_moon_phase');
    } catch {
      // ignore storage errors
    }
    const timer = setInterval(() => setNowDate(new Date()), 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const isDark = theme === 'dark';

  const moonPhaseInfo = useMemo(() => resolveMoonPhaseInfo('auto', nowDate), [nowDate]);

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
        root.dataset.moonPhase = moonPhaseInfo.resolvedId;
        root.style.setProperty('--dark-sky-card', moonPhaseInfo.cardSurfaceBg);
        root.style.setProperty('--dark-sky-card-alt', moonPhaseInfo.cardSurfaceAltBg);
        root.style.setProperty('--dark-sky-border', moonPhaseInfo.glassBorder);
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
        delete root.dataset.moonPhase;
        root.style.removeProperty('--dark-sky-card');
        root.style.removeProperty('--dark-sky-card-alt');
        root.style.removeProperty('--dark-sky-border');
      }
      localStorage.setItem('astrojit_theme', theme);
    } catch (e) {
      console.error('Error persisting theme:', e);
    }
  }, [theme, isDark, moonPhaseInfo]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme,
        toggleTheme,
        moonPhaseInfo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'light',
      isDark: false,
      setTheme: () => {},
      toggleTheme: () => {},
      moonPhaseInfo: resolveMoonPhaseInfo('auto'),
    };
  }
  return ctx;
}
