interface AlleyaLogoProps {
  className?: string;
  /** Если true — белый вариант (для тёмных фонов, напр. footer) */
  inverted?: boolean;
}

/**
 * Премиальный 3D-логотип «Alleya Group» (металломорфизм).
 * - Использует сложные многоступенчатые металлические градиенты для эффекта хромированной стали.
 * - Применяет SVG-фильтр Specular Lighting для создания реалистичных 3D-бликов на гранях букв.
 * - Красные пилоны «ll» имеют сочный рубиново-металлический градиент.
 * - Буквы «A, E, Y, A» имеют глубокий сине-стальной отлив с белой фаской.
 */
export default function AlleyaLogo({ className, inverted = false }: AlleyaLogoProps) {
  // Динамические цвета для градиентов хрома
  const navy1 = inverted ? '#ffffff' : '#4d6ecf';
  const navy2 = inverted ? '#f1f5f9' : '#1a2d72';
  const navy3 = inverted ? '#cbd5e1' : '#0a122e';

  const red1 = inverted ? '#ff8a8c' : '#ff5a5d';
  const red2 = inverted ? '#ff4d4f' : '#e8282b';
  const red3 = inverted ? '#d32023' : '#8c0e10';

  const grey1 = inverted ? '#ffffff' : '#94a3b8';
  const grey2 = inverted ? '#e2e8f0' : '#475569';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
      }}
      aria-label="Alleya Group"
    >
      <svg
        width="116"
        height="40"
        viewBox="0 0 100 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))'
        }}
      >
        <defs>
          {/* Градиент для синих металлических букв (хром) */}
          <linearGradient id="navy-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={navy1} />
            <stop offset="35%" stopColor={navy2} />
            <stop offset="65%" stopColor={navy2} />
            <stop offset="100%" stopColor={navy3} />
          </linearGradient>

          {/* Градиент для красных металлических пилонов (рубин) */}
          <linearGradient id="red-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={red1} />
            <stop offset="40%" stopColor={red2} />
            <stop offset="100%" stopColor={red3} />
          </linearGradient>

          {/* Градиент для подписи GROUP (платина) */}
          <linearGradient id="platinum-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={grey1} />
            <stop offset="50%" stopColor={inverted ? '#ffffff' : '#cbd5e1'} />
            <stop offset="100%" stopColor={grey2} />
          </linearGradient>

          {/* Фильтр Specular Lighting для создания 3D-бликов на металлических гранях */}
          <filter id="metal-bevel" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feSpecularLighting in="blur" specularExponent="35" lightingColor="#ffffff" result="spec">
              <feDistantLight azimuth="225" elevation="65" />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1.1" k3="0.4" k4="0" />
          </filter>
        </defs>

        {/* Буква A (левая) */}
        <path
          d="M 1.5 20 L 9.2 1 H 12.8 L 20.5 20 H 16.5 L 14.7 14.5 H 7.3 L 5.5 20 H 1.5 Z M 11 5.5 L 13.2 11 H 8.8 L 11 5.5 Z"
          fill="url(#navy-metal)"
          filter="url(#metal-bevel)"
        />

        {/* Первая красная l (скругленный пилон) */}
        <path
          d="M 22.5 4.5 C 22.5 2, 24.1 0, 26.5 0 H 27.2 V 17.5 C 27.2 20, 25.6 22, 23.2 22 H 22.5 V 4.5 Z"
          fill="url(#red-metal)"
          filter="url(#metal-bevel)"
        />

        {/* Вторая красная l (скругленный пилон) */}
        <path
          d="M 29.5 4.5 C 29.5 2, 31.1 0, 33.5 0 H 34.2 V 17.5 C 34.2 20, 32.6 22, 30.2 22 H 29.5 V 4.5 Z"
          fill="url(#red-metal)"
          filter="url(#metal-bevel)"
        />

        {/* Буква E */}
        <path
          d="M 37.2 1 H 47.5 C 48.8 1, 49.2 1.8, 49.2 2.6 C 49.2 3.4, 48.8 4.2, 47.5 4.2 H 40.5 V 8 H 45.8 C 47.1 8, 47.5 8.8, 47.5 9.6 C 47.5 10.4, 47.1 11.2, 45.8 11.2 H 40.5 V 15 H 47.5 C 48.8 15, 49.2 15.8, 49.2 16.6 C 49.2 17.4, 48.8 18.2, 47.5 18.2 H 37.2 V 1 Z"
          fill="url(#navy-metal)"
          filter="url(#metal-bevel)"
        />

        {/* Буква Y */}
        <path
          d="M 51.5 1 H 55 L 58.2 6.5 L 61.4 1 H 64.9 L 59.9 9.5 V 18.2 H 56.7 V 9.5 Z"
          fill="url(#navy-metal)"
          filter="url(#metal-bevel)"
        />

        {/* Буква A (правая) */}
        <path
          d="M 67.2 20 L 74.9 1 H 78.5 L 86.2 20 H 82.2 L 80.4 14.5 H 73 L 71.2 20 H 67.2 Z M 76.7 5.5 L 78.9 11 H 74.5 L 76.7 5.5 Z"
          fill="url(#navy-metal)"
          filter="url(#metal-bevel)"
        />

        {/* Подпись GROUP */}
        <text
          x="43.5"
          y="31"
          fill="url(#platinum-metal)"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.22em"
          textAnchor="middle"
          style={{ textShadow: inverted ? 'none' : '0 1px 1px rgba(255,255,255,0.8)' }}
        >
          GROUP
        </text>
      </svg>
    </span>
  );
}
