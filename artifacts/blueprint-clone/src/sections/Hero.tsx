import { useEffect, useRef } from 'react';

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
    url: 'https://images.prismic.io/blueprint/aN2njZ5xUNkB1Yv__e335a325380ce25044cd945e890db60d4377be20.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 100, baseX: 308, baseY: -32, width: 300,
    caption: { name: 'Anne Kaerst', desc: '<strong>Industry Voice</strong> – Speaker at Swift meetups & global mobile conferences.' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2nuZ5xUNkB1YwB_8e975a3677a52e26d519524665a0b79f3ddedc77.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 400, baseX: 1028, baseY: -2, width: 220,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2nzp5xUNkB1YwC_143da4701ff36f419a7380096e94e86ea18cb584.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 50, baseX: 1186, baseY: 205, width: 240,
    caption: { name: 'Tim Green', desc: 'Published Author – Best-selling book on high-performance programming' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2n_Z5xUNkB1YwE_e2069d872b252cf4c8b6804763330503ebcd387d.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 250, baseX: -16, baseY: 158, width: 220,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2oDZ5xUNkB1YwG_f6ea2fa96ac5239054a0afae9814bd1236bb7606.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 125, baseX: 111, baseY: 446, width: 280,
    caption: { name: 'Daniel Coyer', desc: '<strong>Open Source Leader</strong> – Creator of a widely used Swift library' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2oJp5xUNkB1YwM_3eb388a3b46c3edaeab91472ccc2c75a6efa8eeb.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 25, baseX: 862, baseY: 609, width: 340,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2oO55xUNkB1YwW_70c9742847ec985a071271e7391c14619f5b9fee.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 325, baseX: 237, baseY: 706, width: 260,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2pZZ5xUNkB1YxM_ce07cb97fa800149a773499db3cb724a74ce0eb9.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 90, baseX: 593, baseY: 965, width: 300,
    caption: { name: 'Nina Sau', desc: '<strong>Ex-Apple Engineer</strong> – Bringing Silicon Valley expertise' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2pfJ5xUNkB1YxN_b093d832a290925043b0dea0c5becdba0c41f3fe.jpg?auto=format&fit=max&w=800',
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

// rem → px using the site's scaling (1rem = viewport_width × 0.0005787)
function remToPx(rem: number): number {
  return rem * window.innerWidth * 0.0005787;
}

export default function Hero() {
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const titleWrap   = useRef<HTMLDivElement>(null);
  const titleH1     = useRef<HTMLHeadingElement>(null);
  const desc        = useRef<HTMLParagraphElement>(null);
  const btn         = useRef<HTMLDivElement>(null);
  const entered     = useRef(false);
  const mouse       = useRef({ x: 0, y: 0 });
  const raf         = useRef(0);

  // ── ENTRANCE: scatter animation ──────────────────────────────────────────
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

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
    [titleWrap, desc, btn].forEach((r) => {
      if (!r.current) return;
      r.current.style.transition = 'none';
      r.current.style.opacity    = '0';
      r.current.style.transform  = 'translateY(20px)';
    });

    // Step 2 — next paint: trigger scatter to final positions
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
          el.style.transform = `translate3d(${p.baseX}px,${p.baseY}px,0) scale(1)`;
        });

        // Title reveals ~350 ms in
        setTimeout(() => {
          if (titleWrap.current) {
            titleWrap.current.style.transition = 'opacity 0.9s cubic-bezier(0.19,1,0.22,1), transform 0.9s cubic-bezier(0.19,1,0.22,1)';
            titleWrap.current.style.opacity    = '1';
            titleWrap.current.style.transform  = 'translateY(0)';
          }
          if (titleH1.current) {
            titleH1.current.classList.add('is-visible');
          }
        }, 350);

        // Description
        setTimeout(() => {
          if (desc.current) {
            desc.current.style.transition = 'opacity 0.9s cubic-bezier(0.19,1,0.22,1), transform 0.9s cubic-bezier(0.19,1,0.22,1)';
            desc.current.style.opacity    = '1';
            desc.current.style.transform  = 'translateY(0)';
          }
        }, 560);

        // Button
        setTimeout(() => {
          if (btn.current) {
            btn.current.style.transition = 'opacity 0.8s cubic-bezier(0.19,1,0.22,1), transform 0.8s cubic-bezier(0.19,1,0.22,1)';
            btn.current.style.opacity    = '1';
            btn.current.style.transform  = 'translateY(0)';
          }
        }, 780);

        // After all transitions done → hand off to JS parallax (no transition)
        const maxMs = (0.04 + 8 * 0.07 + 1.4) * 1000 + 150; // ≈ 2.15 s
        setTimeout(() => {
          entered.current = true;
          itemRefs.current.forEach((el) => {
            if (el) el.style.transition = 'none';
          });
        }, maxMs);
      });
    });

    return () => cancelAnimationFrame(id);
  }, []);

  // ── SCROLL PARALLAX ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (!entered.current) return;
      const y = window.scrollY;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = PHOTOS[i];
        el.style.transform = `translate3d(${p.baseX}px,${p.baseY + y * p.scrollSpeed / 1000}px,0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── MOUSE PARALLAX ────────────────────────────────────────────────────────
  useEffect(() => {
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
            <span className="line"><span className="text">Hire Mobile Devs</span></span>
            <span className="line"><span className="text">Differently</span></span>
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
          Engineers who own outcomes —<br />
          CTO-screened with ≤&nbsp;5% pass rate for skill,<br />
          mindset, and long-term fit.
        </p>
      </div>

      {/* ── CTA button ─────────────────────────────────────────────────── */}
      <div ref={btn} className="hero-btn" style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <button className="btn-primary" style={{ fontSize: '16rem', padding: '18rem 32rem' }}>
          Hire Talent
        </button>
      </div>

    </div>
  );
}
