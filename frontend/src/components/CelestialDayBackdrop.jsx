import React from 'react';

/**
 * Panoramic traditional Indian temple sanctuary & lotus pond daylight backdrop
 * tailored specifically for the Today Panchangam horizontal banner proportions.
 * Keeps the upper-left calm for crisp typography while showcasing twin Dravidian
 * temple gopurams, misty hills, palms, Pushkarini lotus pond, sacred cow & peacock.
 */
export default function CelestialDayBackdrop({ sunLeftPct = 65 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {/* Warm Golden-Dawn & Sunlit Saffron Sky Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #FCE7BA 0%, #FAD598 42%, #F5BC7A 72%, #E59F65 100%)',
        }}
      />

      {/* Subtle Soft Left Reading Glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 85% at 18% 45%, rgba(255, 250, 238, 0.72) 0%, rgba(255, 247, 228, 0.25) 60%, transparent 100%)',
        }}
      />

      {/* Solar Halo Behind Live Sun Position */}
      <div
        className="absolute -bottom-4 w-72 h-40 rounded-full blur-2xl opacity-70"
        style={{
          left: `${sunLeftPct}%`,
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(255,251,214,0.92) 0%, rgba(253,224,71,0.35) 55%, transparent 80%)',
        }}
      />

      {/* Panoramic Multi-Layered Temple, Nature, Pond & Peacock Vector Illustration */}
      <svg
        viewBox="65 -14 870 264"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="pondWaterGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7DA59C" />
            <stop offset="50%" stopColor="#93B7AE" />
            <stop offset="100%" stopColor="#6D978F" />
          </linearGradient>
          <linearGradient id="templeStoneMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A07D" />
            <stop offset="100%" stopColor="#8D694D" />
          </linearGradient>
          <linearGradient id="templeStoneDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A68265" />
            <stop offset="100%" stopColor="#72523B" />
          </linearGradient>
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93AA96" />
            <stop offset="100%" stopColor="#6E8C75" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#678D5E" />
            <stop offset="100%" stopColor="#486E43" />
          </linearGradient>
        </defs>

        {/* Faint Sacred Surya Mandala Ornament in Upper Sky */}
        <g transform="translate(395, 78)" opacity="0.08" stroke="#9A3412" fill="none">
          <circle cx="0" cy="0" r="64" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="0" cy="0" r="48" strokeWidth="0.9" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={deg}
              d="M0,-48 Q8,-34 0,-20 Q-8,-34 0,-48"
              transform={`rotate(${deg})`}
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* Soft Sunlit Peach-Cream Clouds */}
        <g fill="#FFF5DF" fillOpacity="0.62">
          <path d="M355 44 Q375 26 402 36 Q424 22 444 37 Q462 36 466 49 L346 49 Q344 45 355 44 Z" />
          <path d="M530 28 Q548 14 570 23 Q588 12 606 24 Q620 24 622 34 L524 34 Q521 30 530 28 Z" fillOpacity="0.48" />
          <path d="M875 42 Q894 28 916 36 Q934 26 950 38 Q963 38 965 48 L868 48 Q866 44 875 42 Z" fillOpacity="0.52" />
        </g>

        {/* Soaring Temple Birds Across Upper-Center Sky */}
        <g fill="none" stroke="#6B3D20" strokeOpacity="0.55" strokeWidth="1.35" strokeLinecap="round">
          <path d="M518 46 Q523 41 528 46 Q533 41 538 46" />
          <path d="M542 36 Q546 32 550 36 Q554 32 558 36" />
          <path d="M563 51 Q567 47 571 51 Q575 47 579 51" />
          <path d="M500 58 Q503 55 506 58 Q509 55 512 58" />
          <path d="M842 54 Q846 50 850 54 Q854 50 858 54" />
        </g>

        {/* Distant Misty Hills */}
        <path
          d="M0 184 Q95 142 195 170 Q285 130 390 166 Q495 146 585 172 L1000 170 L1000 250 L0 250 Z"
          fill="url(#hillFar)"
          fillOpacity="0.72"
        />
        <path
          d="M0 194 Q130 166 260 190 Q395 162 530 188 L1000 185 L1000 250 L0 250 Z"
          fill="url(#hillMid)"
          fillOpacity="0.78"
        />

        {/* Temple Courtyard Perimeter Wall Behind Pond */}
        <rect x="200" y="172" width="445" height="22" fill="#C49E7C" stroke="#704D34" strokeWidth="0.8" />
        <line x1="200" y1="176" x2="645" y2="176" stroke="#8E6749" strokeWidth="1.1" />
        {[245, 290, 335, 380, 425, 470, 515, 560].map((wx) => (
          <rect key={wx} x={wx} y="182" width="6" height="8" rx="1" fill="#593B26" fillOpacity="0.65" />
        ))}

        {/* Dense Emerald Foliage Framing Temple */}
        <g fill="#45733D">
          <circle cx="628" cy="168" r="19" />
          <circle cx="818" cy="166" r="22" fill="#3B6535" />
          <circle cx="945" cy="176" r="26" />
          <circle cx="976" cy="172" r="24" fill="#33592E" />
          <circle cx="32" cy="192" r="22" fill="#4B7B42" />
          <circle cx="68" cy="186" r="20" fill="#3D6936" />
        </g>

        {/* Secondary Background Gopuram (Right-Far) */}
        <g transform="translate(808, 42)" stroke="#583823" strokeWidth="0.75">
          <rect x="8" y="106" width="92" height="36" fill="url(#templeStoneDark)" />
          {/* Sanctum Door */}
          <rect x="44" y="114" width="20" height="28" fill="#3B2316" />
          {/* 5 Sculpted Tiers */}
          <polygon points="14,106 94,106 89,90 19,90" fill="#8C735B" />
          <polygon points="19,90 89,90 84,75 24,75" fill="#7D8C82" />
          <polygon points="24,75 84,75 79,61 29,61" fill="#A68265" />
          <polygon points="29,61 79,61 73,47 35,47" fill="#7C8D84" />
          <polygon points="35,47 73,47 68,35 40,35" fill="#B58E6D" />
          {/* Barrel Roof & 5 Golden Kalasams */}
          <path d="M36 35 Q54 14 72 35 Z" fill="#8C684C" />
          <ellipse cx="54" cy="24" rx="14" ry="7" fill="#6F867D" />
          {[42, 48, 54, 60, 66].map((kx) => (
            <g key={kx}>
              <line x1={kx} y1="18" x2={kx} y2="10" stroke="#D97706" strokeWidth="1.3" />
              <circle cx={kx} cy="9.5" r="1.5" fill="#FBBF24" stroke="none" />
            </g>
          ))}
        </g>

        {/* Primary Main Dravidian Gopuram (Hero Temple Center-Right) */}
        <g transform="translate(625, 22)" stroke="#4E301D" strokeWidth="0.85">
          {/* Stone Base & Entrance Mandapam */}
          <rect x="4" y="122" width="144" height="44" fill="url(#templeStoneMain)" />
          <rect x="-4" y="119" width="160" height="6" fill="#A67D5B" />
          {/* Pillared Entrance Portico */}
          {[14, 34, 52, 100, 118, 136].map((px) => (
            <rect key={px} x={px} y="125" width="5" height="41" fill="#9E7454" />
          ))}
          <rect x="61" y="130" width="30" height="36" fill="#2E1B11" />
          {/* Warm Sanctum Oil-Lamp Glow Inside Gateway */}
          <ellipse cx="76" cy="152" rx="7" ry="11" fill="#F59E0B" fillOpacity="0.28" stroke="none" />

          {/* 6 Carved Gopuram Tiers with Teal-Ochre Temple Art Tint */}
          <polygon points="10,119 142,119 135,101 17,101" fill="#A67E5E" />
          <polygon points="17,101 135,101 128,84 24,84" fill="#779189" />
          <polygon points="24,84 128,84 121,68 31,68" fill="#B88E6C" />
          <polygon points="31,68 121,68 113,53 39,53" fill="#7B938A" />
          <polygon points="39,53 113,53 105,39 47,39" fill="#C49975" />
          <polygon points="47,39 105,39 98,27 54,27" fill="#829990" />

          {/* Miniature Kudu Arch Details Along Tiers */}
          {[32, 54, 76, 98, 120].map((ax) => (
            <rect key={ax} x={ax - 3} y="106" width="6" height="10" rx="3" fill="#5D3A24" fillOpacity="0.55" stroke="none" />
          ))}
          {[42, 60, 76, 92, 110].map((ax) => (
            <rect key={ax} x={ax - 2.5} y="73" width="5" height="8" rx="2.5" fill="#5D3A24" fillOpacity="0.55" stroke="none" />
          ))}

          {/* Sala Crown Dome & 7 Golden Kalasams */}
          <path d="M51 27 Q76 4 101 27 Z" fill="#9A7254" />
          <ellipse cx="76" cy="16" rx="18" ry="8" fill="#7B968C" />
          {[56, 62.5, 69, 76, 83, 89.5, 96].map((kx) => (
            <g key={kx}>
              <line x1={kx} y1="9" x2={kx} y2="0" stroke="#D97706" strokeWidth="1.4" />
              <circle cx={kx} cy="-0.5" r="1.7" fill="#FDE047" stroke="#B45309" strokeWidth="0.4" />
            </g>
          ))}

          {/* Stone Steps Leading Down From Main Gate */}
          <polygon points="56,166 96,166 105,179 47,179" fill="#B59173" />
          <line x1="53" y1="170" x2="99" y2="170" stroke="#6B4730" strokeWidth="0.7" />
          <line x1="50" y1="175" x2="102" y2="175" stroke="#6B4730" strokeWidth="0.7" />
        </g>

        {/* Side Mandapam Connecting Temple Right Wing */}
        <g transform="translate(772, 146)" stroke="#583823" strokeWidth="0.75">
          <rect x="0" y="14" width="110" height="28" fill="url(#templeStoneDark)" />
          <path d="M8 14 Q28 3 48 14 Z" fill="#9A7254" />
          <rect x="20" y="21" width="14" height="21" fill="#321F14" />
        </g>

        {/* Lush Green Temple Lawn & Grass Banks */}
        <path d="M0 196 L1000 192 L1000 250 L0 250 Z" fill="#6F944A" />
        <path d="M0 205 L240 205 L195 250 L0 250 Z" fill="#5B803A" />
        <path d="M770 198 L1000 198 L1000 250 L805 250 Z" fill="#5D823B" />

        {/* Left Sacred Mandapam Edge & Grazing Temple Cow (Visible Inside Pond Bank) */}
        <g transform="translate(86, 158)" stroke="#5B3A24" strokeWidth="0.75">
          <polygon points="0,24 58,24 50,15 8,15" fill="#AE8868" />
          <rect x="8" y="24" width="5" height="30" fill="#9A7254" />
          <rect x="44" y="24" width="5" height="30" fill="#9A7254" />
        </g>
        {/* Sacred White Temple Cow with Gold Saddle Cloth */}
        <g transform="translate(148, 186)" stroke="#574232" strokeWidth="0.75">
          <ellipse cx="22" cy="14" rx="16" ry="9" fill="#FAF6EE" />
          <path d="M12 7 Q19 4 27 7 L25 18 Q19 20 13 18 Z" fill="#DC2626" stroke="#FBBF24" strokeWidth="0.7" />
          {/* Neck, Head & Horns */}
          <path d="M35 12 Q42 6 45 10 Q46 15 41 18 Z" fill="#FAF6EE" />
          <path d="M39 7 Q38 3 41 2 M42 7 Q44 3 46 4" fill="none" stroke="#78350F" strokeWidth="1" />
          {/* Legs */}
          <line x1="11" y1="21" x2="10" y2="31" stroke="#FAF6EE" strokeWidth="2.4" />
          <line x1="16" y1="22" x2="16" y2="31" stroke="#EAE2D3" strokeWidth="2.2" />
          <line x1="29" y1="22" x2="30" y2="31" stroke="#FAF6EE" strokeWidth="2.4" />
          <line x1="33" y1="21" x2="34" y2="31" stroke="#EAE2D3" strokeWidth="2.2" />
        </g>

        {/* Swaying Coconut Palm Trees Framing Far Left & Far Right */}
        <g>
          {/* Left Palm */}
          <path d="M96 205 Q92 166 104 128" stroke="#6B472E" strokeWidth="3.6" fill="none" />
          <g transform="translate(104, 128)" stroke="#345E2C" strokeWidth="2.3" fill="none" strokeLinecap="round">
            <path d="M0 0 Q-22 -8 -36 4" />
            <path d="M0 0 Q-16 -20 -26 -22" />
            <path d="M0 0 Q4 -24 14 -20" />
            <path d="M0 0 Q22 -12 34 2" />
            <path d="M0 0 Q18 2 26 14" />
          </g>

          {/* Right Palms Framing Temple Gopuram */}
          <path d="M895 205 Q890 156 876 112" stroke="#6B472E" strokeWidth="3.8" fill="none" />
          <g transform="translate(876, 112)" stroke="#2F5929" strokeWidth="2.4" fill="none" strokeLinecap="round">
            <path d="M0 0 Q-26 -8 -42 6" />
            <path d="M0 0 Q-18 -24 -28 -26" />
            <path d="M0 0 Q6 -26 18 -22" />
            <path d="M0 0 Q28 -12 42 4" />
            <path d="M0 0 Q20 4 28 18" />
          </g>
        </g>

        {/* Tranquil Stepped Pushkarini Lotus Pond (Center-to-Right Foreground) */}
        <g>
          {/* Stone Coping Parapet */}
          <polygon points="235,204 778,202 812,250 198,250" fill="#A1795C" stroke="#5E3E28" strokeWidth="0.9" />
          {/* Shimmering Water Surface */}
          <polygon points="246,209 768,207 798,250 212,250" fill="url(#pondWaterGrad)" />
          {/* Gentle Water Ripples & Sun Shimmer */}
          <g stroke="#E2F1ED" strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round">
            <line x1="340" y1="218" x2="395" y2="218" />
            <line x1="480" y1="224" x2="545" y2="224" />
            <line x1="600" y1="216" x2="648" y2="216" />
            <line x1="295" y1="234" x2="355" y2="234" />
            <line x1="510" y1="238" x2="575" y2="238" />
          </g>

          {/* Floating Lily Pads & Blooming Pink Lotus Flowers */}
          {[
            { x: 285, y: 229, scale: 0.9 },
            { x: 365, y: 222, scale: 0.78 },
            { x: 432, y: 234, scale: 1.0 },
            { x: 518, y: 226, scale: 0.85 },
            { x: 598, y: 233, scale: 0.95 },
            { x: 668, y: 224, scale: 0.82 },
          ].map((lotus, idx) => (
            <g key={idx} transform={`translate(${lotus.x}, ${lotus.y}) scale(${lotus.scale})`}>
              {/* Green Lily Pad */}
              <ellipse cx="0" cy="4" rx="14" ry="4.5" fill="#4D7C0F" stroke="#365314" strokeWidth="0.6" />
              {/* Layered Pink Lotus Petals */}
              <path d="M-8,2 Q-5,-8 0,-11 Q5,-8 8,2 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="0.45" />
              <path d="M-11,2 Q-9,-4 -3,-6 Q-1,-1 0,2 Z" fill="#F9A8D4" stroke="#BE185D" strokeWidth="0.4" />
              <path d="M11,2 Q9,-4 3,-6 Q1,-1 0,2 Z" fill="#F9A8D4" stroke="#BE185D" strokeWidth="0.4" />
              <circle cx="0" cy="-3" r="1.6" fill="#FDE047" />
            </g>
          ))}
        </g>

        {/* Indian Peacock (Mayil) Perched Gracefully on Right Pond Bank */}
        <g transform="translate(755, 212)">
          {/* Emerald Flowing Tail Plumage with Golden Eyes */}
          <path d="M8,6 C22,0 44,12 62,28 C44,31 20,24 6,12 Z" fill="#0F766E" stroke="#115E59" strokeWidth="0.6" />
          <path d="M10,8 C25,5 42,14 55,25" fill="none" stroke="#34D399" strokeWidth="0.7" strokeOpacity="0.65" />
          {[
            { cx: 28, cy: 13 },
            { cx: 39, cy: 17 },
            { cx: 49, cy: 22 },
            { cx: 23, cy: 17 },
            { cx: 34, cy: 21 },
          ].map((eye, idx) => (
            <g key={idx} transform={`translate(${eye.cx}, ${eye.cy})`}>
              <circle cx="0" cy="0" r="2.2" fill="#FBBF24" />
              <circle cx="0" cy="0" r="1.1" fill="#1E3A8A" />
            </g>
          ))}
          {/* Sapphire Blue Neck, Head, Crown Crest & Legs */}
          <ellipse cx="4" cy="8" rx="6" ry="4.5" fill="#1D4ED8" />
          <path d="M2,6 Q-3,-3 -1,-9 Q1,-11 3,-8 Q5,-3 6,5 Z" fill="#1E40AF" />
          <circle cx="0" cy="-9" r="2.5" fill="#1D4ED8" />
          {/* Beak & Crown Feather */}
          <polygon points="-2,-9 -6,-8 -2,-7" fill="#F59E0B" />
          <line x1="1" y1="-11" x2="4" y2="-15" stroke="#1D4ED8" strokeWidth="0.9" />
          <circle cx="4.5" cy="-15.5" r="1" fill="#38BDF8" />
          {/* Legs */}
          <line x1="2" y1="12" x2="1" y2="20" stroke="#78350F" strokeWidth="1.2" />
          <line x1="6" y1="12" x2="7" y2="20" stroke="#78350F" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}
