interface AlleyaLogoProps {
  className?: string;
  /** Если true — белый вариант (для тёмных фонов, напр. footer CTA) */
  inverted?: boolean;
}

/**
 * Логотип «Аллея Групп» — SVG реплика официального логотипа бренда
 * (navy синий + красный акцент, как на alleya-group.ru).
 */
export default function AlleyaLogo({ className, inverted = false }: AlleyaLogoProps) {
  const navy  = inverted ? '#ffffff' : '#1a2d72';
  const red   = inverted ? '#ff6b6b' : '#e8282b';
  const muted = inverted ? 'rgba(255,255,255,0.65)' : '#6b7280';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.28em',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
      }}
      aria-label="Аллея Групп"
    >
      {/* Ромб-акцент цвета бренда */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '0.55em',
          borderRadius: '0.1em',
          background: `linear-gradient(135deg, ${red} 0%, ${red} 50%, ${navy} 50%, ${navy} 100%)`,
          transform: 'rotate(45deg)',
          flexShrink: 0,
          boxShadow: inverted ? 'none' : '0 1px 4px rgba(232,40,43,0.25)',
        }}
      />
      {/* АЛЛЕЯ */}
      <span style={{
        fontFamily: "'Saans', sans-serif",
        color: navy,
        fontWeight: 700,
        letterSpacing: '-0.03em',
      }}>
        АЛЛЕЯ
      </span>
      {/* ГРУПП */}
      <span style={{
        fontFamily: "'Saans Mono', monospace",
        fontSize: '0.68em',
        color: muted,
        letterSpacing: '0.16em',
        marginLeft: '0.05em',
      }}>
        ГРУПП
      </span>
    </span>
  );
}
