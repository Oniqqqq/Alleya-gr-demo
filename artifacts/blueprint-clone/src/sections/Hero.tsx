import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { img } from '../data/assets';

interface HeroPhoto {
  url: string;
  scrollSpeed: number;
  baseX: number;
  baseY: number;
  width: number;
  caption?: { name: string; desc: string };
}

const PHOTOS: HeroPhoto[] = [
  {
    url: img('product-canister.svg'),
    scrollSpeed: 100, baseX: 308, baseY: -32, width: 300,
    caption: { name: 'Технические жидкости', desc: '<strong>Собственные бренды</strong> — охлаждающие и специальные жидкости.' },
  },
  {
    url: img('product-bottle.svg'),
    scrollSpeed: 400, baseX: 1028, baseY: -2, width: 220,
  },
  {
    url: img('infra-warehouse.svg'),
    scrollSpeed: 50, baseX: 1186, baseY: 205, width: 240,
    caption: { name: 'Складская сеть', desc: 'Распределительные центры в ключевых регионах присутствия' },
  },
  {
    url: img('product-filter.svg'),
    scrollSpeed: 250, baseX: -16, baseY: 158, width: 220,
  },
  {
    url: img('product-brake-disc.svg'),
    scrollSpeed: 125, baseX: 111, baseY: 446, width: 280,
    caption: { name: 'Автокомпоненты', desc: '<strong>Детали шасси</strong> — тормозные системы и подвеска' },
  },
  {
    url: img('infra-truck.svg'),
    scrollSpeed: 25, baseX: 862, baseY: 609, width: 340,
  },
  {
    url: img('product-drum.svg'),
    scrollSpeed: 325, baseX: 237, baseY: 706, width: 260,
  },
  {
    url: img('infra-production.svg'),
    scrollSpeed: 90, baseX: 593, baseY: 965, width: 300,
    caption: { name: 'Производство', desc: '<strong>Производственные площадки</strong> и контроль качества' },
  },
  {
    url: img('product-battery.svg'),
    scrollSpeed: 250, baseX: 1107, baseY: 1050, width: 200,
  },
];

// Scatter-from positions (fraction of vw/vh)
const ORIGINS = [
  { x: 0.36, y: 0.28 },
  { x: 0.54, y: 0.18 },
  { x: 0.60, y: 0.34 },
  { x: 0.24, y: 0.38 },
  { x: 0.29, y: 0.52 },
  { x: 0.50, y: 0.58 },
  { x: 0.40, y: 0.48 },
  { x: 0.46, y: 0.64 },
  { x: 0.62, y: 0.54 },
];

// rem → px using the site's current scaling (reads the live html font-size,
// so it stays correct when media queries change the rem base)
function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Позиции фото заданы для контрольной ширины 1728px — масштабируем по вьюпорту
const DESIGN_WIDTH = 1728;
const posScale = () => Math.min(1, window.innerWidth / DESIGN_WIDTH);

export default function Hero() {
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const titleWrap   = useRef<HTMLDivElement>(null);
  const titleH1     = useRef<HTMLHeadingElement>(null);
  const desc        = useRef<HTMLParagraphElement>(null);
  const btn         = useRef<HTMLDivElement>(null);
  const entered     = useRef(false);
  const mouse       = useRef({ x: 0, y: 0 });
  const raf         = useRef(0);
  const [, navigate] = useLocation();

  // ── ENTRANCE: scatter animation ──────────────────────────────────────────
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const s = posScale();

    if (prefersReducedMotion()) {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = `translate3d(${PHOTOS[i].baseX * s}px,${PHOTOS[i].baseY * s}px,0)`;
      });
      [titleWrap, desc].forEach((r) => {
        if (!r.current) return;
        r.current.style.opacity = '1';
        r.current.style.transform = 'none';
      });
      if (btn.current) {
        btn.current.style.opacity = '1';
        btn.current.style.transform = 'translateX(-50%)';
      }
      titleH1.current?.classList.add('is-visible');
      entered.current = true;
      return;
    }

    // Step 1 — put every photo at its origin cluster (instant, no transition)
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const o   = ORIGINS[i] ?? { x: 0.5, y: 0.5 };
      const w   = remToPx(PHOTOS[i].width);
      const ox  = o.x * vw - w / 2;
      const oy  = o.y * vh;
      el.style.transition = 'none';
      el.style.opacity    = '0';
      el.style.transform  = `translate3d(${ox}px,${oy}px,0) scale(0.42)`;
    });

    // Hide text elements
    [titleWrap, desc].forEach((r) => {
      if (!r.current) return;
      r.current.style.transition = 'none';
      r.current.style.opacity    = '0';
      r.current.style.transform  = 'translateY(20px)';
    });
    if (btn.current) {
      btn.current.style.transition = 'none';
      btn.current.style.opacity    = '0';
      btn.current.style.transform  = 'translate(-50%, 20px)';
    }

    // Step 2 — next paint: trigger scatter to final positions
    const timers: number[] = [];
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        PHOTOS.forEach((p, i) => {
          const el = itemRefs.current[i];
          if (!el) return;
          const delay = 0.04 + i * 0.07;
          el.style.transition = `
            transform 1.4s cubic-bezier(0.19,1,0.22,1) ${delay}s,
            opacity   0.55s ease ${delay}s
          `;
          el.style.opacity   = '1';
          el.style.transform = `translate3d(${p.baseX * s}px,${p.baseY * s}px,0) scale(1)`;
        });

        // Title reveals ~350 ms in
        timers.push(window.setTimeout(() => {
          if (titleWrap.current) {
            titleWrap.current.style.transition = 'opacity 0.9s cubic-bezier(0.19,1,0.22,1), transform 0.9s cubic-bezier(0.19,1,0.22,1)';
            titleWrap.current.style.opacity    = '1';
            titleWrap.current.style.transform  = 'translateY(0)';
          }
          if (titleH1.current) {
            titleH1.current.classList.add('is-visible');
          }
        }, 350));

        // Description
        timers.push(window.setTimeout(() => {
          if (desc.current) {
            desc.current.style.transition = 'opacity 0.9s cubic-bezier(0.19,1,0.22,1), transform 0.9s cubic-bezier(0.19,1,0.22,1)';
            desc.current.style.opacity    = '1';
            desc.current.style.transform  = 'translateY(0)';
          }
        }, 560));

        // Button
        timers.push(window.setTimeout(() => {
          if (btn.current) {
            btn.current.style.transition = 'opacity 0.8s cubic-bezier(0.19,1,0.22,1), transform 0.8s cubic-bezier(0.19,1,0.22,1)';
            btn.current.style.opacity    = '1';
            btn.current.style.transform  = 'translate(-50%, 0)';
          }
        }, 780));

        // After all transitions done → hand off to JS parallax (no transition)
        const maxMs = (0.04 + 8 * 0.07 + 1.4) * 1000 + 150; // ≈ 2.15 s
        timers.push(window.setTimeout(() => {
          entered.current = true;
          itemRefs.current.forEach((el) => {
            if (el) el.style.transition = 'none';
          });
        }, maxMs));
      });
    });

    return () => {
      cancelAnimationFrame(id);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  // ── SCROLL PARALLAX ──────────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onScroll = () => {
      if (!entered.current) return;
      const y = window.scrollY;
      const s = posScale();
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = PHOTOS[i];
        el.style.transform = `translate3d(${p.baseX * s}px,${p.baseY * s + y * p.scrollSpeed / 1000}px,0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── MOUSE PARALLAX ────────────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX - window.innerWidth / 2)  / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      };
    };
    const tick = () => {
      itemRefs.current.forEach((el, i) => {
        const inner = el?.querySelector<HTMLElement>('.hero-item-inner');
        if (!inner) return;
        const f = (i % 5 + 1) * 0.35;
        inner.style.transform = `translate(${mouse.current.x * f * 18}px,${mouse.current.y * f * 18}px)`;
      });
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="hero">

      {/* ── Photo cards ────────────────────────────────────────────────── */}
      <div className="hero-items">
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            className="hero-item"
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ opacity: 0 }}
          >
            <div className="hero-item-inner">
              <div className="hero-item-image">
                <img
                  src={p.url}
                  alt={p.caption?.name ?? ''}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
              {p.caption && (
                <div className="hero-item-caption">
                  <span className="hero-item-caption-name">{p.caption.name}</span>
                  <p className="hero-item-caption-desc" dangerouslySetInnerHTML={{ __html: p.caption.desc }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Centre text ────────────────────────────────────────────────── */}
      <div className="hero-center">
        <div ref={titleWrap} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0, transform: 'translateY(20px)' }}>
          <h1
            ref={titleH1}
            className="hero-title h2 smart-text"
            style={{ lineHeight: 1 }}
          >
            <span className="line"><span className="text">Портфель брендов</span></span>
            <span className="line"><span className="text">федерального масштаба</span></span>
          </h1>
        </div>

        <p
          ref={desc}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            color: 'var(--muted)',
            lineHeight: 1.35,
            marginTop: '24rem',
            maxWidth: '500rem',
            textAlign: 'center',
            fontSize: '20rem',
            letterSpacing: '-0.01em',
          }}
        >
          Аллея Групп объединяет сильные бренды,<br />
          развитую систему поставок и поддержку продаж<br />
          на всей территории присутствия.
        </p>
      </div>

      {/* ── CTA button ─────────────────────────────────────────────────── */}
      <div ref={btn} className="hero-btn" style={{ opacity: 0, transform: 'translate(-50%, 20px)' }}>
        <button
          className="btn-primary"
          style={{ fontSize: '16rem', padding: '18rem 32rem' }}
          onClick={() => navigate('/brands')}
        >
          Смотреть портфель
        </button>
      </div>

    </div>
  );
}
