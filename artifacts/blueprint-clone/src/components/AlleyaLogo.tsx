interface AlleyaLogoProps {
  className?: string;
  /** Белый вариант для тёмных поверхностей */
  inverted?: boolean;
  /** Только знак, без текстовой части */
  markOnly?: boolean;
}

/**
 * Фирменный знак «Аллея Групп» — векторизован с оригинального logoico
 * клиента (alleya-group.ru): синяя «A» + два красных пилона, без фона.
 * Размер задаётся font-size контейнера: знак = 1em высоты.
 */
export function AlleyaMark({ inverted = false }: { inverted?: boolean }) {
  const navy = inverted ? '#ffffff' : 'var(--alleya-navy, #1a2d72)';
  const red = inverted ? '#ff6b6d' : 'var(--alleya-red, #e8282b)';
  return (
    <svg
      viewBox="0 0 690 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '1em', width: 'auto', display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <path
        fill={navy}
        fillRule="evenodd"
        d="M146 140C158 106 242 106 253 140L397 487Q398 490 394 490L332 490Q328 490 326 486L292 403Q291 400 287 400L113 400Q109 400 108 403L74 486Q72 490 68 490L4 490Q0 490 1.5 486ZM196 189Q200 180 204 189L262 336Q266 346 258 346L142 346Q134 346 137 336Z"
      />
      <path
        fill={red}
        d="M423 10Q423 2 431 2L436 2C470 6 492 40 493 90L493 418C496 432 522 434 536 452C540 458 541 466 541 474Q541 490 524 490L462 490Q450 490 440 484C430 478 423 468 423 456Z"
      />
      <path
        fill={red}
        transform="translate(136,0)"
        d="M423 10Q423 2 431 2L436 2C470 6 492 40 493 90L493 418C496 432 522 434 536 452C540 458 541 466 541 474Q541 490 524 490L462 490Q450 490 440 484C430 478 423 468 423 456Z"
      />
    </svg>
  );
}

export default function AlleyaLogo({ className, inverted = false, markOnly = false }: AlleyaLogoProps) {
  const navy = inverted ? '#ffffff' : 'var(--alleya-navy, #1a2d72)';
  const grey = inverted ? 'rgba(255,255,255,0.65)' : 'var(--muted, #6b7280)';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.42em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
      aria-label="Аллея Групп"
    >
      <AlleyaMark inverted={inverted} />
      {!markOnly && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.13em' }}>
          <span
            style={{
              fontFamily: "'Saans', sans-serif",
              fontSize: '0.47em',
              letterSpacing: '0.06em',
              color: navy,
              fontWeight: 400,
            }}
          >
            ALLEYA
          </span>
          <span
            style={{
              fontFamily: "'Saans Mono', monospace",
              fontSize: '0.26em',
              letterSpacing: '0.42em',
              color: grey,
            }}
          >
            GROUP
          </span>
        </span>
      )}
    </span>
  );
}
