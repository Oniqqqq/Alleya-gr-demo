import { useEffect, useRef } from 'react';

interface BarrelProps {
  /** Фирменный цвет бренда — корпус бочки (плавный transition в CSS) */
  color: string;
  /** Логотип-этикетка бренда */
  logo: string;
  logoAlt: string;
  /** Ключ смены бренда — на каждую смену бочка делает плавный «оборот» */
  spinKey: string;
}

// Геометрия развёртки: этикетка «обёрнута» вокруг бочки,
// полный оборот = WRAP px в координатах SVG
const WRAP = 560;
const BODY_X = 60;
const BODY_W = 280;

/**
 * Вертикальная бочка (как на lippini.com): корпус красится в цвет бренда,
 * при прокрутке страницы этикетка и блики «проворачиваются» вокруг корпуса,
 * при смене бренда бочка делает плавный дополнительный оборот.
 * Чистый SVG + один rAF-цикл, без 3D-библиотек.
 */
export default function Barrel({ color, logo, logoAlt, spinKey }: BarrelProps) {
  const trackRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const spinExtra = useRef(0);        // накопленные «обороты» от смены брендов
  const spinTarget = useRef(0);
  const firstKey = useRef(true);

  // Смена бренда → цель +1 оборот
  useEffect(() => {
    if (firstKey.current) {
      firstKey.current = false;
      return;
    }
    spinTarget.current += WRAP;
  }, [spinKey]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = () => {
      // догоняем цель оборота с плавным затуханием (easing-хвост)
      const diff = spinTarget.current - spinExtra.current;
      if (Math.abs(diff) > 0.5) {
        spinExtra.current += diff * 0.07;
      } else {
        spinExtra.current = spinTarget.current;
      }

      const scrollSpin = reduced ? 0 : window.scrollY * 0.35;
      const spin = scrollSpin + spinExtra.current;
      const offset = ((spin % WRAP) + WRAP) % WRAP;

      if (trackRef.current) {
        trackRef.current.setAttribute('transform', `translate(${-offset}, 0)`);
      }
      // лёгкий наклон корпуса — только от прокрутки, в покое бочка ровная
      if (rootRef.current && !reduced) {
        const tilt = Math.sin(scrollSpin / 400) * 2.2;
        rootRef.current.style.transform = `rotate(${tilt}deg)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // Логотип рисуется трижды с шагом WRAP — при любом offset один всегда в кадре
  const labels = [0, WRAP, WRAP * 2].map((shift) => (
    <g key={shift} transform={`translate(${shift}, 0)`}>
      <image
        href={logo}
        x={110}
        y={222}
        width={180}
        height={108}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  ));

  return (
    <div ref={rootRef} className="barrel" style={{ color }}>
      <svg viewBox="0 0 400 560" fill="none" aria-label={logoAlt} role="img">
        <defs>
          {/* цилиндрическое затенение корпуса */}
          <linearGradient id="barrel-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.38" />
            <stop offset="0.12" stopColor="#000" stopOpacity="0.18" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.42" stopColor="#fff" stopOpacity="0.34" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.78" stopColor="#000" stopOpacity="0.16" />
            <stop offset="1" stopColor="#000" stopOpacity="0.42" />
          </linearGradient>
          {/* затухание этикетки к краям корпуса — эффект огибания цилиндра */}
          <linearGradient id="barrel-curve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.55" />
            <stop offset="0.16" stopColor="#000" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="0.84" stopColor="#000" stopOpacity="0.08" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </linearGradient>
          <clipPath id="barrel-body-clip">
            <rect x={BODY_X} y={64} width={BODY_W} height={452} rx={30} />
          </clipPath>
        </defs>

        {/* мягкая тень-подставка */}
        <ellipse cx="200" cy="532" rx="150" ry="16" fill="#0f1a3e" opacity="0.16" />

        {/* корпус: цвет бренда через currentColor (transition в CSS) */}
        <rect x={BODY_X} y={64} width={BODY_W} height={452} rx={30} fill="currentColor" />

        {/* этикетка, «обёрнутая» вокруг корпуса */}
        <g clipPath="url(#barrel-body-clip)">
          <g ref={trackRef}>{labels}</g>
        </g>

        {/* рёбра жёсткости */}
        <g fill="currentColor">
          <rect x={BODY_X - 8} y={158} width={BODY_W + 16} height={20} rx={10} />
          <rect x={BODY_X - 8} y={402} width={BODY_W + 16} height={20} rx={10} />
        </g>
        <g fill="#000" opacity="0.12">
          <rect x={BODY_X - 8} y={172} width={BODY_W + 16} height={6} rx={3} />
          <rect x={BODY_X - 8} y={416} width={BODY_W + 16} height={6} rx={3} />
        </g>

        {/* объём: затенение корпуса и «огибание» этикетки */}
        <rect x={BODY_X - 8} y={64} width={BODY_W + 16} height={452} rx={30} fill="url(#barrel-curve)" />
        <rect x={BODY_X - 8} y={64} width={BODY_W + 16} height={452} rx={30} fill="url(#barrel-shade)" style={{ mixBlendMode: 'soft-light' }} />

        {/* крышка */}
        <ellipse cx="200" cy="70" rx={BODY_W / 2 + 2} ry="26" fill="currentColor" />
        <ellipse cx="200" cy="70" rx={BODY_W / 2 + 2} ry="26" fill="#fff" opacity="0.18" />
        <ellipse cx="200" cy="72" rx={BODY_W / 2 - 22} ry="19" fill="#000" opacity="0.14" />
        <ellipse cx="252" cy="66" rx="17" ry="7" fill="#000" opacity="0.22" />
        <ellipse cx="148" cy="74" rx="11" ry="5" fill="#000" opacity="0.16" />
      </svg>
    </div>
  );
}
