/// <reference types="react" />

export interface LogoProps {
  compact?: boolean;
  size?: number;
}

export function Logo({ compact, size = 36 }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="tg-lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <filter id="tg-glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shield fill (subtle) */}
        <path
          d="M18 2 L32 8 L32 20 C32 27 25 32 18 34 C11 32 4 27 4 20 L4 8 Z"
          fill="url(#tg-lg1)"
          opacity="0.12"
        />

        {/* Shield outline */}
        <path
          d="M18 2 L32 8 L32 20 C32 27 25 32 18 34 C11 32 4 27 4 20 L4 8 Z"
          stroke="url(#tg-lg1)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Network nodes */}
        <circle cx="18" cy="13" r="2.5" fill="#38BDF8" filter="url(#tg-glow)" />
        <circle cx="12" cy="23" r="2.5" fill="#818CF8" filter="url(#tg-glow)" opacity="0.9" />
        <circle cx="24" cy="23" r="2.5" fill="#818CF8" filter="url(#tg-glow)" opacity="0.9" />

        {/* Edges */}
        <line x1="18" y1="13" x2="12" y2="23" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="18" y1="13" x2="24" y2="23" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="12" y1="23" x2="24" y2="23" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>

      {!compact && (
        <span className="text-xl font-bold text-white tracking-tight">
          Threat<span className="gradient-text">Graph</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
