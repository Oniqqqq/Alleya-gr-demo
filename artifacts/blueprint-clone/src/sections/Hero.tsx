import { useEffect, useRef } from 'react';

interface HeroPhoto {
  url: string;
  scrollSpeed: number;
  baseX: number; // px at 1728px viewport
  baseY: number; // px at 1728px viewport
  caption?: {
    name: string;
    desc: string;
  };
}

const HERO_PHOTOS: HeroPhoto[] = [
  {
    url: 'https://images.prismic.io/blueprint/aN2njZ5xUNkB1Yv__e335a325380ce25044cd945e890db60d4377be20.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 100,
    baseX: 308,
    baseY: -32,
    caption: { name: 'Anne Kaerst', desc: '<strong>Industry Voice</strong> – Speaker at Swift meetups & global mobile conferences.' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2nuZ5xUNkB1YwB_8e975a3677a52e26d519524665a0b79f3ddedc77.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 400,
    baseX: 1028,
    baseY: -2,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2nzp5xUNkB1YwC_143da4701ff36f419a7380096e94e86ea18cb584.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 50,
    baseX: 1186,
    baseY: 205,
    caption: { name: 'Tim Green', desc: 'Published Author – Best-selling book on high-performance programming' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2n_Z5xUNkB1YwE_e2069d872b252cf4c8b6804763330503ebcd387d.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 250,
    baseX: -16,
    baseY: 158,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2oDZ5xUNkB1YwG_f6ea2fa96ac5239054a0afae9814bd1236bb7606.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 125,
    baseX: 111,
    baseY: 446,
    caption: { name: 'Daniel Coyer', desc: '<strong>Open Source Leader</strong> – Creator of a widely used Swift library' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2oJp5xUNkB1YwM_3eb388a3b46c3edaeab91472ccc2c75a6efa8eeb.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 25,
    baseX: 862,
    baseY: 609,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2oO55xUNkB1YwW_70c9742847ec985a071271e7391c14619f5b9fee.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 325,
    baseX: 237,
    baseY: 706,
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2pZZ5xUNkB1YxM_ce07cb97fa800149a773499db3cb724a74ce0eb9.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 90,
    baseX: 593,
    baseY: 965,
    caption: { name: 'Nina Sau', desc: '<strong>Ex-Apple Engineer</strong> – Bringing Silicon Valley expertise' },
  },
  {
    url: 'https://images.prismic.io/blueprint/aN2pfJ5xUNkB1YxN_b093d832a290925043b0dea0c5becdba0c41f3fe.jpg?auto=format&fit=max&w=800',
    scrollSpeed: 250,
    baseX: 1107,
    baseY: 1050,
  },
];

export default function Hero() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const photo = HERO_PHOTOS[i];
        const parallaxY = scrollY * photo.scrollSpeed / 1000;
        el.style.transform = `translate3d(${photo.baseX}px, ${photo.baseY + parallaxY}px, 0)`;
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      };
    };

    // Animate mouse parallax on inner elements
    const animateMouseParallax = () => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const inner = el.querySelector<HTMLElement>('.hero-item-inner');
        if (!inner) return;
        const factor = (i % 5 + 1) * 0.4;
        const tx = mouseRef.current.x * factor * 20;
        const ty = mouseRef.current.y * factor * 20;
        inner.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      rafRef.current = requestAnimationFrame(animateMouseParallax);
    };

    // Initialize positions
    HERO_PHOTOS.forEach((photo, i) => {
      const el = itemRefs.current[i];
      if (el) {
        el.style.transform = `translate3d(${photo.baseX}px, ${photo.baseY}px, 0)`;
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animateMouseParallax);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="hero" ref={sectionRef}>
      {/* Scattered photo items */}
      <div className="hero-items">
        {HERO_PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="hero-item"
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ transform: `translate3d(${photo.baseX}px, ${photo.baseY}px, 0)` }}
          >
            <div className="hero-item-inner">
              <div className="hero-item-image">
                <img
                  src={photo.url}
                  alt={photo.caption?.name || ''}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
              {photo.caption && (
                <div className="hero-item-caption">
                  <span className="hero-item-caption-name">{photo.caption.name}</span>
                  <p
                    className="hero-item-caption-desc"
                    dangerouslySetInnerHTML={{ __html: photo.caption.desc }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Center content — sticky during first viewport */}
      <div className="hero-center">
        <h1 className="hero-title h2 smart-text is-visible" style={{ lineHeight: 1 }}>
          <span className="line"><span className="text">Hire Mobile Devs</span></span>
          <span className="line"><span className="text">Differently</span></span>
        </h1>
        <p className="hero-description h4 smart-text is-visible">
          <span className="line" style={{ transitionDelay: '0.1s' }}>
            <span className="text">Engineers who own outcomes —</span>
          </span>
          <span className="line" style={{ transitionDelay: '0.2s' }}>
            <span className="text">CTO-screened with ≤ 5% pass rate for skill,</span>
          </span>
          <span className="line" style={{ transitionDelay: '0.3s' }}>
            <span className="text">mindset, and long-term fit.</span>
          </span>
        </p>
      </div>

      {/* CTA button near bottom of first viewport */}
      <div className="hero-btn">
        <button className="btn-primary" style={{ fontSize: '16rem', padding: '18rem 32rem' }}>
          Hire Talent
        </button>
      </div>
    </div>
  );
}
