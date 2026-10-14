import React from 'react';

interface TeamBadgeProps {
  badgeStyle?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const TournamentLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a2b" />
            <stop offset="50%" stopColor="#12241b" />
            <stop offset="100%" stopColor="#0d1812" />
          </linearGradient>
          <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Shield contour */}
        <path
          d="M 50 5 L 88 20 C 88 65 72 98 50 110 C 28 98 12 65 12 20 Z"
          fill="url(#shieldGrad)"
          stroke="url(#goldEdge)"
          strokeWidth="3.5"
        />
        {/* Inner gold border */}
        <path
          d="M 50 10 L 83 23 C 83 60 69 92 50 103 C 31 92 17 60 17 23 Z"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* Obelisk monument icon */}
        <path
          d="M 50 16 L 47 48 L 53 48 Z"
          fill="#fef08a"
          opacity="0.9"
        />
        <rect x="44" y="48" width="12" height="4" rx="1" fill="#fef08a" />
        {/* Soccer ball */}
        <circle cx="50" cy="65" r="14" fill="#ffffff" stroke="#12241b" strokeWidth="1.5" />
        <polygon points="50,56 56,61 54,68 46,68 44,61" fill="#1e3a2b" />
        <line x1="50" y1="56" x2="50" y2="51" stroke="#12241b" strokeWidth="1.2" />
        <line x1="56" y1="61" x2="62" y2="60" stroke="#12241b" strokeWidth="1.2" />
        <line x1="54" y1="68" x2="58" y2="74" stroke="#12241b" strokeWidth="1.2" />
        <line x1="46" y1="68" x2="42" y2="74" stroke="#12241b" strokeWidth="1.2" />
        <line x1="44" y1="61" x2="38" y2="60" stroke="#12241b" strokeWidth="1.2" />
        {/* Stars */}
        <circle cx="30" cy="35" r="1.5" fill="#fef08a" />
        <circle cx="70" cy="35" r="1.5" fill="#fef08a" />
        <circle cx="50" cy="20" r="1.2" fill="#fef08a" />
        {/* Banner text */}
        <text
          x="50"
          y="88"
          textAnchor="middle"
          fill="#fef08a"
          fontSize="6"
          fontWeight="bold"
          letterSpacing="0.5"
          fontFamily="system-ui"
        >
          OBELISCO
        </text>
        <text
          x="50"
          y="95"
          textAnchor="middle"
          fill="#10b981"
          fontSize="5.5"
          fontWeight="bold"
          letterSpacing="0.5"
          fontFamily="system-ui"
        >
          2026
        </text>
      </svg>
    </div>
  );
};

export const TeamBadge: React.FC<TeamBadgeProps> = ({
  badgeStyle = 'wolf',
  name = '',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const renderBadgeSvg = () => {
    switch (badgeStyle) {
      // 1. ALPHA: Purple Wolf Crest
      case 'wolf':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="wolfBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            <polygon points="50,4 88,18 94,62 50,96 6,62 12,18" fill="url(#wolfBg)" stroke="#c084fc" strokeWidth="3" />
            <polygon points="50,12 80,24 85,58 50,86 15,58 20,24" fill="#0f0c29" stroke="#9333ea" strokeWidth="1.5" />
            {/* Wolf face silhouette */}
            <path d="M 28 35 L 40 45 L 36 24 Z" fill="#c084fc" />
            <path d="M 72 35 L 60 45 L 64 24 Z" fill="#c084fc" />
            <polygon points="50,34 38,50 44,65 50,72 56,65 62,50" fill="#a855f7" />
            <polygon points="50,42 42,54 50,68 58,54" fill="#f5d0fe" />
            {/* Eyes */}
            <polygon points="41,47 47,49 43,53" fill="#38bdf8" />
            <polygon points="59,47 53,49 57,53" fill="#38bdf8" />
            {/* Nose */}
            <polygon points="50,64 47,60 53,60" fill="#2e1065" />
            {/* Banner */}
            <rect x="22" y="74" width="56" height="13" rx="3" fill="#581c87" stroke="#e9d5ff" strokeWidth="1" />
            <text x="50" y="83.5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="system-ui" letterSpacing="1">
              ALPHA
            </text>
          </svg>
        );

      // 2. CAIMANES FC: Emerald alligator/croc shield
      case 'alligator':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="crocBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
            </defs>
            <path d="M 50 5 L 90 20 C 90 65 72 90 50 97 C 28 90 10 65 10 20 Z" fill="url(#crocBg)" stroke="#10b981" strokeWidth="3" />
            <path d="M 50 12 L 82 24 C 82 58 68 80 50 87 C 32 80 18 58 18 24 Z" fill="#041a14" stroke="#eab308" strokeWidth="1.5" />
            {/* Croc eye & snout */}
            <ellipse cx="50" cy="46" rx="26" ry="18" fill="#047857" />
            <path d="M 28 46 Q 50 32 72 46 Q 50 62 28 46 Z" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
            {/* Sharp teeth */}
            <polygon points="34,46 38,41 42,46" fill="#fef08a" />
            <polygon points="44,46 48,41 52,46" fill="#fef08a" />
            <polygon points="54,46 58,41 62,46" fill="#fef08a" />
            <polygon points="38,46 42,51 46,46" fill="#fef08a" />
            <polygon points="48,46 52,51 56,46" fill="#fef08a" />
            <polygon points="58,46 62,51 66,46" fill="#fef08a" />
            {/* Eye */}
            <circle cx="50" cy="33" rx="4" ry="3" fill="#eab308" />
            <circle cx="50" cy="33" r="1.5" fill="#022c22" />
            {/* Text banner */}
            <rect x="18" y="68" width="64" height="13" rx="3" fill="#065f46" stroke="#fbbf24" strokeWidth="1" />
            <text x="50" y="77" textAnchor="middle" fill="#fef08a" fontSize="6.8" fontWeight="900" fontFamily="system-ui" letterSpacing="0.8">
              CAIMANES
            </text>
          </svg>
        );

      // 3. CARUCIENA SC: Classic Italian circular stripes
      case 'stripes':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <clipPath id="circleClip">
                <circle cx="50" cy="50" r="42" />
              </clipPath>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#090d16" stroke="#e2e8f0" strokeWidth="3" />
            <g clipPath="url(#circleClip)">
              <rect x="8" y="8" width="84" height="84" fill="#0f172a" />
              {/* Stripes */}
              <rect x="22" y="8" width="11" height="84" fill="#f8fafc" />
              <rect x="44" y="8" width="12" height="84" fill="#f8fafc" />
              <rect x="67" y="8" width="11" height="84" fill="#f8fafc" />
              {/* Central Badge */}
              <circle cx="50" cy="50" r="24" fill="#090d16" stroke="#fbbf24" strokeWidth="2" />
              {/* Soccer ball inside */}
              <circle cx="50" cy="46" r="11" fill="#ffffff" stroke="#000" strokeWidth="1" />
              <polygon points="50,40 54,43 53,48 47,48 46,43" fill="#000" />
            </g>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />
            <text x="50" y="80" textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold" fontFamily="system-ui">
              CARUCIENA SC
            </text>
          </svg>
        );

      // 4. CRISBAN FC: Blue & Gold Geometric Star Shield
      case 'star':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="crisbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <polygon points="50,5 92,20 90,65 50,95 10,65 8,20" fill="url(#crisbanGrad)" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="50,12 84,24 82,60 50,86 18,60 16,24" fill="#091024" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Big Golden Star */}
            <polygon
              points="50,22 56,38 72,38 59,48 64,64 50,54 36,64 41,48 28,38 44,38"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="45" r="5" fill="#1e3a8a" stroke="#fff" strokeWidth="1" />
            <rect x="18" y="71" width="64" height="12" rx="2" fill="#1e40af" stroke="#93c5fd" strokeWidth="1" />
            <text x="50" y="80" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="system-ui" letterSpacing="0.8">
              CRISBAN
            </text>
          </svg>
        );

      // 5. DEPORTIVO SIN LUZ: Golden Lantern/Shadowy Lion Shield
      case 'lantern':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="sinLuzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#292524" />
                <stop offset="100%" stopColor="#0c0a09" />
              </linearGradient>
            </defs>
            <path d="M 50 6 L 88 18 C 92 60 72 88 50 96 C 28 88 8 60 12 18 Z" fill="url(#sinLuzGrad)" stroke="#d97706" strokeWidth="3" />
            <path d="M 50 12 L 82 22 C 85 55 68 79 50 87 C 32 79 15 55 18 22 Z" fill="#1c1917" stroke="#fbbf24" strokeWidth="1" />
            {/* Glowing Lantern / flame icon */}
            <path d="M 50 24 Q 60 38 58 48 Q 50 58 42 48 Q 40 38 50 24 Z" fill="#fbbf24" />
            <path d="M 50 30 Q 56 40 54 46 Q 50 52 46 46 Q 44 40 50 30 Z" fill="#fef08a" />
            {/* Lantern frame */}
            <rect x="42" y="24" width="16" height="4" rx="1" fill="#78350f" />
            <rect x="40" y="52" width="20" height="5" rx="1" fill="#78350f" />
            <text x="50" y="72" textAnchor="middle" fill="#f59e0b" fontSize="5.5" fontWeight="900" fontFamily="system-ui">
              SIN LUZ
            </text>
            <text x="50" y="80" textAnchor="middle" fill="#d6d3d1" fontSize="4.8" fontWeight="bold" fontFamily="system-ui">
              DEPORTIVO
            </text>
          </svg>
        );

      // 6. ELITE F.C.: Black & Luxury Gold Crown Shield
      case 'elite':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="eliteGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            <polygon points="50,6 92,20 88,68 50,96 12,68 8,20" fill="#0f172a" stroke="url(#eliteGold)" strokeWidth="3" />
            <polygon points="50,14 84,25 80,63 50,86 20,63 16,25" fill="#020617" stroke="#e2e8f0" strokeWidth="1" />
            {/* Crown */}
            <polygon points="34,44 32,32 42,38 50,28 58,38 68,32 66,44" fill="url(#eliteGold)" stroke="#fef08a" strokeWidth="1" />
            <rect x="34" y="44" width="32" height="4" rx="1" fill="#f59e0b" />
            <circle cx="32" cy="31" r="1.5" fill="#fff" />
            <circle cx="50" cy="27" r="1.5" fill="#fff" />
            <circle cx="68" cy="31" r="1.5" fill="#fff" />
            {/* E Monogram */}
            <text x="50" y="66" textAnchor="middle" fill="url(#eliteGold)" fontSize="18" fontWeight="900" fontFamily="serif">
              E
            </text>
            <text x="50" y="78" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="system-ui" letterSpacing="1">
              ELITE F.C.
            </text>
          </svg>
        );

      // 7. FAMILIS FC: Neon Green Horned Beast/Devil Crest
      case 'beast':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="familisBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14532d" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>
            </defs>
            <polygon points="50,6 88,18 94,62 50,96 6,62 12,18" fill="url(#familisBg)" stroke="#22c55e" strokeWidth="3" />
            {/* Horns */}
            <path d="M 32 36 Q 22 18 16 24 Q 28 30 36 42 Z" fill="#4ade80" />
            <path d="M 68 36 Q 78 18 84 24 Q 72 30 64 42 Z" fill="#4ade80" />
            {/* Mask */}
            <polygon points="50,32 34,46 40,64 50,72 60,64 66,46" fill="#15803d" stroke="#86efac" strokeWidth="1.5" />
            {/* Glowing red eyes */}
            <polygon points="41,48 47,50 43,54" fill="#ef4444" />
            <polygon points="59,48 53,50 57,54" fill="#ef4444" />
            {/* Fangs */}
            <polygon points="46,62 48,58 50,62" fill="#fff" />
            <polygon points="50,62 52,58 54,62" fill="#fff" />
            {/* Banner */}
            <rect x="20" y="74" width="60" height="12" rx="2" fill="#166534" stroke="#86efac" strokeWidth="1" />
            <text x="50" y="82.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="system-ui" letterSpacing="0.8">
              FAMILIS FC
            </text>
          </svg>
        );

      // 8. HALCONES FC: Yellow & Red Circular Falcon
      case 'falcon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="halconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#halconGrad)" stroke="#facc15" strokeWidth="3.5" />
            <circle cx="50" cy="50" r="38" fill="#1e1b4b" stroke="#f87171" strokeWidth="1.5" />
            {/* Falcon head */}
            <path d="M 34 38 Q 48 24 64 36 Q 74 44 68 56 Q 60 52 54 50 Q 56 60 48 58 Q 40 54 34 38 Z" fill="#facc15" />
            <path d="M 64 36 L 76 44 L 64 46 Z" fill="#f97316" /> {/* Beak */}
            <circle cx="54" cy="38" r="3" fill="#000" />
            <circle cx="55" cy="37.5" r="1" fill="#fff" />
            {/* Football icon at bottom */}
            <circle cx="50" cy="70" r="8" fill="#ffffff" stroke="#991b1b" strokeWidth="1.2" />
            <polygon points="50,66 53,68 52,72 48,72 47,68" fill="#991b1b" />
            <text x="50" y="88" textAnchor="middle" fill="#fef08a" fontSize="6.5" fontWeight="900" fontFamily="system-ui">
              HALCONES FC
            </text>
          </svg>
        );

      // 9. LEONES FC: Electric Sapphire Roaring Lion
      case 'lion':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="leonesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <polygon points="50,6 90,20 86,66 50,96 14,66 10,20" fill="url(#leonesGrad)" stroke="#60a5fa" strokeWidth="3" />
            {/* Mane */}
            <circle cx="50" cy="44" r="22" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
            {/* Face */}
            <polygon points="50,30 38,44 42,56 50,64 58,56 62,44" fill="#3b82f6" />
            <polygon points="42,42 48,44 45,47" fill="#fbbf24" />
            <polygon points="58,42 52,44 55,47" fill="#fbbf24" />
            <polygon points="50,56 46,52 54,52" fill="#020617" />
            {/* Ears */}
            <circle cx="34" cy="30" r="5" fill="#2563eb" />
            <circle cx="66" cy="30" r="5" fill="#2563eb" />
            {/* Banner */}
            <rect x="20" y="74" width="60" height="12" rx="2" fill="#1d4ed8" stroke="#bfdbfe" strokeWidth="1" />
            <text x="50" y="82.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="system-ui" letterSpacing="0.8">
              LEONES FC
            </text>
          </svg>
        );

      // 10. LOS CHAMOS FC: Midnight Blue & Silver CH Shield
      case 'shield_ch':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="chamosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <path d="M 50 6 L 88 18 C 92 64 74 90 50 97 C 26 90 8 64 12 18 Z" fill="url(#chamosGrad)" stroke="#38bdf8" strokeWidth="3" />
            <path d="M 50 12 L 82 22 C 85 58 70 82 50 88 C 30 82 15 58 18 22 Z" fill="#090d16" stroke="#94a3b8" strokeWidth="1" />
            {/* CH Emblem */}
            <circle cx="50" cy="46" r="20" fill="#0369a1" stroke="#e0f2fe" strokeWidth="1.5" />
            <text x="50" y="53" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900" fontFamily="system-ui">
              CH
            </text>
            <rect x="16" y="71" width="68" height="13" rx="2" fill="#0284c7" stroke="#bae6fd" strokeWidth="1" />
            <text x="50" y="80" textAnchor="middle" fill="#ffffff" fontSize="6.2" fontWeight="900" fontFamily="system-ui" letterSpacing="0.5">
              LOS CHAMOS FC
            </text>
          </svg>
        );

      // 11. NEW FC: Burgundy & Black Star Roundel
      case 'new_star':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="newGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#newGrad)" stroke="#e11d48" strokeWidth="3" />
            <circle cx="50" cy="50" r="37" fill="#0f172a" stroke="#fb7185" strokeWidth="1.5" />
            {/* Central Football & Star */}
            <polygon
              points="50,22 54,34 66,34 56,42 60,54 50,46 40,54 44,42 34,34 46,34"
              fill="#fb7185"
            />
            <circle cx="50" cy="58" r="10" fill="#fff" stroke="#881337" strokeWidth="1" />
            <polygon points="50,54 53,56 52,60 48,60 47,56" fill="#881337" />
            <text x="50" y="82" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="system-ui" letterSpacing="1">
              NEW FC
            </text>
          </svg>
        );

      // 12. SPORTING VISAJE: Cyan & Navy Cyclone Silhouette
      case 'visaje':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <defs>
              <linearGradient id="visajeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#082f49" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="url(#visajeGrad)" stroke="#67e8f9" strokeWidth="1.5" />
            {/* Stylized mask/phantom striker figure */}
            <path
              d="M 32 35 C 38 25 62 25 68 35 C 72 45 66 65 50 72 C 34 65 28 45 32 35 Z"
              fill="#ecfeff"
              stroke="#0891b2"
              strokeWidth="1.5"
            />
            {/* Eyes */}
            <polygon points="40,42 46,44 42,47" fill="#0e7490" />
            <polygon points="60,42 54,44 58,47" fill="#0e7490" />
            <text x="50" y="84" textAnchor="middle" fill="#cffafe" fontSize="5.5" fontWeight="900" fontFamily="system-ui" letterSpacing="0.5">
              SPORTING VISAJE
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {renderBadgeSvg()}
    </div>
  );
};
