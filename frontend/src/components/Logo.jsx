import React from 'react';

/**
 * Astrojit Official Brand Logo Component
 * Incorporates the authentic Astrojit golden zodiac medallion, 
 * signature flourish typography, and astrological consultation tagline.
 * Seamlessly adapts across light & dark themes, horizontal headers, 
 * collapsed navigation sidebars, and grand stacked splash/auth screens.
 */
export default function Logo({
  size = 'md',
  showTagline = true,
  light = false,
  iconOnly = false,
  variant = 'auto', // 'auto' | 'horizontal' | 'stacked' | 'icon'
  className = ''
}) {
  // If icon-only is requested
  const isIcon = iconOnly || variant === 'icon';

  // Stacked mode preferred for large login / splash cards unless forced horizontal
  const isStacked = variant === 'stacked' || (variant === 'auto' && (size === 'lg' || size === 'xl'));

  // Icon dimensions
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  // Stacked logo dimensions
  const stackedSizes = {
    xs: 'h-12 max-w-[140px]',
    sm: 'h-16 max-w-[180px]',
    md: 'h-24 max-w-[240px]',
    lg: 'h-32 sm:h-36 max-w-[320px]',
    xl: 'h-44 sm:h-52 max-w-[420px]'
  };

  // Horizontal logo dimensions
  const horizontalSizes = {
    xs: 'h-6 sm:h-7 max-w-[170px]',
    sm: 'h-8 sm:h-9 max-w-[210px]',
    md: 'h-10 sm:h-11 max-w-[260px]',
    lg: 'h-14 sm:h-16 max-w-[340px]',
    xl: 'h-20 sm:h-22 max-w-[440px]'
  };

  // 1. Icon-Only Mode (Zodiac Wheel Medallion)
  if (isIcon) {
    const iconClass = iconSizes[size] || iconSizes.md;
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/astrojit-emblem.webp"
          alt="Astrojit Emblem"
          className={`${iconClass} object-contain shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105`}
          loading="eager"
        />
      </div>
    );
  }

  // 2. Stacked Logo Mode (Full Emblem on top + Astrojit wordmark + Tagline)
  if (isStacked) {
    const stackClass = stackedSizes[size] || stackedSizes.lg;
    return (
      <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
        {/* Light theme version */}
        <img
          src="/astrojit-logo-transparent.webp"
          alt="Astrojit Logo"
          className={`${stackClass} object-contain drop-shadow-sm ${light ? 'hidden' : 'dark:hidden'} transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
        />
        {/* Dark theme version (or forced light text) */}
        <img
          src="/astrojit-logo-dark.webp"
          alt="Astrojit Logo"
          className={`${stackClass} object-contain drop-shadow-sm ${light ? 'block' : 'hidden dark:block'} transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
    );
  }

  // 3. Horizontal Lockup (Emblem on left + Astrojit wordmark & Tagline on right)
  const horizClass = horizontalSizes[size] || horizontalSizes.md;
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Light theme version */}
      <img
        src="/astrojit-horizontal.webp"
        alt="Astrojit Logo"
        className={`${horizClass} object-contain drop-shadow-xs ${light ? 'hidden' : 'dark:hidden'} transition-transform duration-200 hover:scale-[1.02]`}
        loading="eager"
      />
      {/* Dark theme version */}
      <img
        src="/astrojit-horizontal-dark.webp"
        alt="Astrojit Logo"
        className={`${horizClass} object-contain drop-shadow-xs ${light ? 'block' : 'hidden dark:block'} transition-transform duration-200 hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
}
