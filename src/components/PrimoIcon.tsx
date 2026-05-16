// src/components/PrimoIcon.tsx
import React from 'react';

const C = {
  navy: '#1a3a4a',
  cream: '#eae2b7',
  orange: '#f26419',
  yellow: '#f5b800',
  green: '#8bbe6e',
};

export type IconName =
  // Industrias (ICP cards)
  | 'healthcare'
  | 'legal'
  | 'realestate'
  | 'ecommerce'
  | 'education'
  // Customer Journey
  | 'discovery'
  | 'firstimpression'
  | 'nurture'
  | 'conversion'
  | 'delivery'
  | 'retention'
  | 'advocacy'
  | 'mastery'
  // Timeline / Milestones
  | 'strategycall'
  | 'roadmap'
  | 'launch'
  | 'sprint'
  | 'optimization'
  | 'scale'
  // Funcionales
  | 'clock'
  | 'location'
  | 'phone'
  | 'email'
  | 'calendar'
  | 'readtime'
  | 'author';

interface PrimoIconProps {
  name: IconName;
  size?: number;
  variant?: 'inline' | 'card-cream' | 'card-navy' | 'card-orange' | 'card-green' | 'card-yellow';
}

export const PrimoIcon: React.FC<PrimoIconProps> = ({
  name,
  size = 48,
  variant = 'inline'
}) => {
  const cardBg: Record<string, string> = {
    'inline': 'transparent',
    'card-cream': '#f5ecc4',
    'card-navy': C.navy,
    'card-orange': C.orange,
    'card-green': C.green,
    'card-yellow': C.yellow,
  };

  const cardBorder: Record<string, string> = {
    'inline': 'none',
    'card-cream': '1px solid rgba(26, 58, 74, 0.12)',
    'card-navy': 'none',
    'card-orange': 'none',
    'card-green': 'none',
    'card-yellow': 'none',
  };

  // Color de la "i" naranja se mantiene siempre, salvo sobre card naranja
  const iColor = variant === 'card-orange' ? C.cream : C.orange;
  // Color de las formas secundarias (líneas, círculos secundarios)
  const accentColor = variant === 'card-navy' ? C.cream :
                      variant === 'card-orange' ? C.cream :
                      C.navy;

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    background: cardBg[variant],
    border: cardBorder[variant],
    borderRadius: variant === 'inline' ? 0 : 14,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const svgSize = variant === 'inline' ? size : size * 0.65;

  return (
    <span style={containerStyle}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {getIconPath(name, iColor, accentColor)}
      </svg>
    </span>
  );
};

function getIconPath(name: IconName, iColor: string, accent: string): React.ReactNode {
  switch (name) {
    // ━━━━━━━ INDUSTRIAS ━━━━━━━

    case 'healthcare':
      // Cruz médica con "i" en el centro
      return (
        <>
          <rect x="32" y="14" width="16" height="52" rx="3" fill={accent}/>
          <rect x="14" y="32" width="52" height="16" rx="3" fill={accent}/>
          <circle cx="40" cy="36" r="3" fill={iColor}/>
          <rect x="37" y="40" width="6" height="10" rx="3" fill={iColor}/>
        </>
      );

    case 'legal':
      // Balanza con "i"
      return (
        <>
          {/* Base */}
          <rect x="34" y="58" width="12" height="6" rx="2" fill={accent}/>
          {/* Asta vertical */}
          <rect x="38" y="22" width="4" height="40" rx="2" fill={accent}/>
          {/* Barra horizontal */}
          <rect x="14" y="22" width="52" height="3" rx="1.5" fill={accent}/>
          {/* Platillos */}
          <circle cx="22" cy="34" r="6" fill="none" stroke={accent} strokeWidth="2.5"/>
          <circle cx="58" cy="34" r="6" fill="none" stroke={accent} strokeWidth="2.5"/>
          {/* La "i" naranja en el tope */}
          <circle cx="40" cy="12" r="3" fill={iColor}/>
          <rect x="37" y="16" width="6" height="6" rx="3" fill={iColor}/>
        </>
      );

    case 'realestate':
      // Casa con "i" adentro
      return (
        <>
          <path d="M 14 40 L 40 18 L 66 40 L 66 64 L 14 64 Z"
                fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round"/>
          <circle cx="40" cy="42" r="3.5" fill={iColor}/>
          <rect x="36.5" y="47" width="7" height="14" rx="3.5" fill={iColor}/>
        </>
      );

    case 'ecommerce':
      // Bolsa de compras con "i"
      return (
        <>
          <path d="M 18 28 L 18 64 Q 18 68 22 68 L 58 68 Q 62 68 62 64 L 62 28 Z"
                fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round"/>
          {/* Asas */}
          <path d="M 28 28 L 28 22 Q 28 14 40 14 Q 52 14 52 22 L 52 28"
                fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          {/* La "i" naranja */}
          <circle cx="40" cy="40" r="3.5" fill={iColor}/>
          <rect x="36.5" y="45" width="7" height="14" rx="3.5" fill={iColor}/>
        </>
      );

    case 'education':
      // Birrete con "i"
      return (
        <>
          {/* Birrete top */}
          <path d="M 12 32 L 40 22 L 68 32 L 40 42 Z"
                fill={accent}/>
          {/* Base/línea */}
          <path d="M 22 36 L 22 50 Q 22 58 40 58 Q 58 58 58 50 L 58 36"
                fill="none" stroke={accent} strokeWidth="3"/>
          {/* La "i" naranja */}
          <circle cx="40" cy="48" r="3" fill={iColor}/>
          <rect x="37" y="52" width="6" height="6" rx="3" fill={iColor}/>
        </>
      );

    // ━━━━━━━ CUSTOMER JOURNEY ━━━━━━━

    case 'discovery':
      // Lupa con "i" adentro
      return (
        <>
          <circle cx="34" cy="34" r="20" fill="none" stroke={accent} strokeWidth="3.5"/>
          <line x1="50" y1="50" x2="64" y2="64" stroke={accent} strokeWidth="4" strokeLinecap="round"/>
          <circle cx="34" cy="27" r="3" fill={iColor}/>
          <rect x="31" y="32" width="6" height="12" rx="3" fill={iColor}/>
        </>
      );

    case 'firstimpression':
      // Spark / brillo
      return (
        <>
          <line x1="40" y1="10" x2="40" y2="20" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="40" y1="60" x2="40" y2="70" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="10" y1="40" x2="20" y2="40" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="60" y1="40" x2="70" y2="40" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="19" y1="19" x2="26" y2="26" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="54" y1="54" x2="61" y2="61" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="61" y1="19" x2="54" y2="26" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="26" y1="54" x2="19" y2="61" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <circle cx="40" cy="32" r="4" fill={iColor}/>
          <rect x="36" y="37" width="8" height="16" rx="4" fill={iColor}/>
        </>
      );

    case 'nurture':
      // Plantita creciendo con "i"
      return (
        <>
          {/* Maceta */}
          <path d="M 22 48 L 58 48 L 54 66 L 26 66 Z"
                fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round"/>
          {/* Hojas */}
          <path d="M 40 48 Q 28 36 22 28" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <path d="M 40 48 Q 52 36 58 28" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          {/* La "i" como tallo central */}
          <circle cx="40" cy="20" r="4" fill={iColor}/>
          <rect x="36" y="24" width="8" height="22" rx="4" fill={iColor}/>
        </>
      );

    case 'conversion':
      // Diana / target con "i" en el centro
      return (
        <>
          <circle cx="40" cy="40" r="26" fill="none" stroke={accent} strokeWidth="3"/>
          <circle cx="40" cy="40" r="16" fill="none" stroke={accent} strokeWidth="3"/>
          <circle cx="40" cy="32" r="3" fill={iColor}/>
          <rect x="37" y="36" width="6" height="12" rx="3" fill={iColor}/>
        </>
      );

    case 'delivery':
      // Cohete / launch con "i"
      return (
        <>
          {/* Cuerpo del cohete (es básicamente una "i" grande) */}
          <path d="M 32 16 Q 40 8 48 16 L 48 50 L 32 50 Z"
                fill={iColor} stroke={accent} strokeWidth="2.5"/>
          {/* Aletas */}
          <path d="M 32 38 L 22 52 L 32 50 Z" fill={accent}/>
          <path d="M 48 38 L 58 52 L 48 50 Z" fill={accent}/>
          {/* Llamas */}
          <path d="M 34 52 L 40 66 L 46 52 Z" fill={accent}/>
          {/* Ventana circular */}
          <circle cx="40" cy="28" r="4" fill={accent}/>
        </>
      );

    case 'retention':
      // Refresh / círculo con flechas + "i"
      return (
        <>
          <path d="M 64 40 A 24 24 0 1 0 40 64" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 56 30 L 64 40 L 54 44" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="40" cy="32" r="3.5" fill={iColor}/>
          <rect x="36.5" y="37" width="7" height="14" rx="3.5" fill={iColor}/>
        </>
      );

    case 'advocacy':
      // Megáfono con "i"
      return (
        <>
          <path d="M 14 32 L 14 48 L 28 48 L 56 60 L 56 20 L 28 32 Z"
                fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round"/>
          <circle cx="40" cy="32" r="3" fill={iColor}/>
          <rect x="37" y="36" width="6" height="12" rx="3" fill={iColor}/>
          {/* Líneas de sonido */}
          <path d="M 62 30 L 68 26" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M 62 40 L 70 40" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M 62 50 L 68 54" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
        </>
      );

    case 'mastery':
      // Trofeo con "i"
      return (
        <>
          {/* Base del trofeo */}
          <rect x="30" y="58" width="20" height="6" rx="2" fill={accent}/>
          <rect x="34" y="50" width="12" height="10" fill={accent}/>
          {/* Copa */}
          <path d="M 24 16 L 24 36 Q 24 50 40 50 Q 56 50 56 36 L 56 16 Z"
                fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round"/>
          {/* Asas */}
          <path d="M 24 22 Q 14 22 14 30 Q 14 36 24 36" fill="none" stroke={accent} strokeWidth="2.5"/>
          <path d="M 56 22 Q 66 22 66 30 Q 66 36 56 36" fill="none" stroke={accent} strokeWidth="2.5"/>
          {/* La "i" naranja en la copa */}
          <circle cx="40" cy="24" r="3.5" fill={iColor}/>
          <rect x="36.5" y="29" width="7" height="14" rx="3.5" fill={iColor}/>
        </>
      );

    // ━━━━━━━ TIMELINE / MILESTONES ━━━━━━━

    case 'strategycall':
      // Teléfono con "i"
      return (
        <>
          <path d="M 20 16 Q 16 16 16 20 L 16 30 Q 20 50 50 60 L 60 60 Q 64 60 64 56 L 64 48 Q 64 44 60 44 L 52 44 Q 48 44 46 48 Q 36 44 32 32 Q 32 28 36 28 L 36 20 Q 36 16 32 16 Z"
                fill={accent}/>
          <circle cx="56" cy="22" r="3.5" fill={iColor}/>
          <rect x="52.5" y="27" width="7" height="14" rx="3.5" fill={iColor}/>
        </>
      );

    case 'roadmap':
      // Mapa con "i"
      return (
        <>
          <path d="M 10 20 L 28 14 L 52 20 L 70 14 L 70 56 L 52 62 L 28 56 L 10 62 Z"
                fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round"/>
          {/* Líneas verticales del mapa */}
          <line x1="28" y1="14" x2="28" y2="56" stroke={accent} strokeWidth="2" strokeDasharray="3,3"/>
          <line x1="52" y1="20" x2="52" y2="62" stroke={accent} strokeWidth="2" strokeDasharray="3,3"/>
          {/* La "i" naranja como pin */}
          <circle cx="40" cy="32" r="4" fill={iColor}/>
          <rect x="36" y="36" width="8" height="14" rx="4" fill={iColor}/>
        </>
      );

    case 'launch':
      // Bandera con "i"
      return (
        <>
          <line x1="20" y1="14" x2="20" y2="66" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 20 16 L 60 16 L 52 28 L 60 40 L 20 40 Z"
                fill={iColor} stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
        </>
      );

    case 'sprint':
      // Engranaje con "i"
      return (
        <>
          <circle cx="40" cy="40" r="14" fill="none" stroke={accent} strokeWidth="3"/>
          {/* Dientes del engranaje */}
          <rect x="37" y="14" width="6" height="8" rx="1" fill={accent}/>
          <rect x="37" y="58" width="6" height="8" rx="1" fill={accent}/>
          <rect x="14" y="37" width="8" height="6" rx="1" fill={accent}/>
          <rect x="58" y="37" width="8" height="6" rx="1" fill={accent}/>
          <rect x="20" y="20" width="6" height="8" rx="1" transform="rotate(-45 23 24)" fill={accent}/>
          <rect x="54" y="20" width="6" height="8" rx="1" transform="rotate(45 57 24)" fill={accent}/>
          <rect x="20" y="52" width="6" height="8" rx="1" transform="rotate(45 23 56)" fill={accent}/>
          <rect x="54" y="52" width="6" height="8" rx="1" transform="rotate(-45 57 56)" fill={accent}/>
          {/* La "i" naranja en el centro */}
          <circle cx="40" cy="35" r="3" fill={iColor}/>
          <rect x="37" y="39" width="6" height="8" rx="3" fill={iColor}/>
        </>
      );

    case 'optimization':
      // Gráfica ascendente con "i"
      return (
        <>
          {/* Ejes */}
          <line x1="14" y1="14" x2="14" y2="64" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          <line x1="14" y1="64" x2="68" y2="64" stroke={accent} strokeWidth="3" strokeLinecap="round"/>
          {/* Línea de gráfica ascendente */}
          <polyline points="20,58 32,46 44,38 56,22 66,18"
                    fill="none" stroke={iColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Puntos */}
          <circle cx="32" cy="46" r="3" fill={accent}/>
          <circle cx="44" cy="38" r="3" fill={accent}/>
          <circle cx="56" cy="22" r="3" fill={accent}/>
        </>
      );

    case 'scale':
      // Multiple "i" creciendo (como las que tenías en el branding)
      return (
        <>
          {/* i pequeña */}
          <circle cx="16" cy="40" r="2.5" fill={accent}/>
          <rect x="13.5" y="44" width="5" height="14" rx="2.5" fill={accent}/>
          {/* i mediana */}
          <circle cx="30" cy="32" r="3" fill={accent}/>
          <rect x="27" y="37" width="6" height="22" rx="3" fill={accent}/>
          {/* i grande naranja */}
          <circle cx="46" cy="22" r="4" fill={iColor}/>
          <rect x="42" y="28" width="8" height="32" rx="4" fill={iColor}/>
          {/* i extra grande */}
          <circle cx="64" cy="14" r="4.5" fill={accent}/>
          <rect x="59.5" y="20" width="9" height="40" rx="4.5" fill={accent}/>
        </>
      );

    // ━━━━━━━ FUNCIONALES ━━━━━━━

    case 'clock':
      return (
        <>
          <circle cx="40" cy="40" r="26" fill="none" stroke={accent} strokeWidth="3.5"/>
          <line x1="40" y1="40" x2="40" y2="24" stroke={iColor} strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="40" y1="40" x2="52" y2="46" stroke={iColor} strokeWidth="3.5" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="2" fill={accent}/>
        </>
      );

    case 'location':
      return (
        <>
          <path d="M 40 12 Q 22 12 22 30 Q 22 46 40 68 Q 58 46 58 30 Q 58 12 40 12 Z"
                fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round"/>
          <circle cx="40" cy="30" r="6" fill={iColor}/>
        </>
      );

    case 'phone':
      return (
        <path d="M 24 14 Q 18 14 18 20 L 18 30 Q 22 56 50 64 L 60 64 Q 66 64 66 58 L 66 50 Q 66 46 62 46 L 54 46 Q 50 46 48 50 Q 36 44 32 32 Q 32 28 36 28 L 36 20 Q 36 14 32 14 Z"
              fill={accent}/>
      );

    case 'email':
      return (
        <>
          <rect x="12" y="20" width="56" height="40" rx="4" fill="none" stroke={accent} strokeWidth="3.5"/>
          <path d="M 12 22 L 40 44 L 68 22" fill="none" stroke={iColor} strokeWidth="3.5" strokeLinejoin="round"/>
        </>
      );

    case 'calendar':
      return (
        <>
          <rect x="14" y="20" width="52" height="46" rx="4" fill="none" stroke={accent} strokeWidth="3.5"/>
          <line x1="14" y1="32" x2="66" y2="32" stroke={accent} strokeWidth="3"/>
          <rect x="24" y="12" width="4" height="14" rx="2" fill={accent}/>
          <rect x="52" y="12" width="4" height="14" rx="2" fill={accent}/>
          <rect x="34" y="40" width="12" height="12" rx="2" fill={iColor}/>
        </>
      );

    case 'readtime':
      return (
        <>
          <circle cx="40" cy="40" r="26" fill="none" stroke={accent} strokeWidth="3.5"/>
          <line x1="40" y1="40" x2="40" y2="24" stroke={iColor} strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="40" y1="40" x2="52" y2="46" stroke={iColor} strokeWidth="3.5" strokeLinecap="round"/>
        </>
      );

    case 'author':
      return (
        <>
          <circle cx="40" cy="28" r="10" fill="none" stroke={accent} strokeWidth="3.5"/>
          <path d="M 20 64 Q 20 46 40 46 Q 60 46 60 64" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
        </>
      );

    default:
      return null;
  }
}

export default PrimoIcon;
