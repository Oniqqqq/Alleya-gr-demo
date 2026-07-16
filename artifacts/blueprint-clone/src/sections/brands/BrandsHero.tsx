import { useEffect, useRef } from 'react';
import { img } from '../../data/assets';

const BG_ITEMS = [
  { url: img('product-canister.svg'), x: '6%', y: '12%', w: 220, speed: 60 },
  { url: img('infra-warehouse.svg'), x: '78%', y: '8%', w: 260, speed: 140 },
  { url: img('product-drum.svg'), x: '70%', y: '58%', w: 200, speed: 220 },
];

const NAV = [
  { label: 'По брендам', target: 'brands-picker' },
  { label: 'По направлениям', target: 'applications' },
  { label: 'Карта присутствия', target: 'map' },
];

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function BrandsHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Entrance reveal (same smart-text pattern as the home hero)
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      titleRef.current?.classList.add('is-visible');
    }, 250);
    const t2 = window.setTimeout(() => {
      restRef.current?.classList.add('is-visible');
    }, 550);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Slow scroll parallax on background images
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onScroll = () => {
      const y = window.scrollY;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate3d(0, ${y * BG_ITEMS[i].speed / 1000}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="brands-hero">
      <div className="brands-hero-items" aria-hidden="true">
        {BG_ITEMS.map((item, i) => (
          <div
            key={i}
            className="brands-hero-item"
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ left: item.x, top: item.y, width: `${item.w}rem` }}
          >
            <div className="hero-item-image">
              <img src={item.url} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        ))}
      </div>

      <div className="brands-hero-center">
        <div className="small-title">Портфель брендов</div>
        <h1 ref={titleRef} className="h1 smart-text brands-hero-title">
          <span className="line"><span className="text">Бренды, объединённые</span></span>
          <span className="line"><span className="text">общей системой развития</span></span>
        </h1>

        <div ref={restRef} className="fade-in brands-hero-rest">
          <p className="brands-hero-desc">
            Портфель продукции для транспорта, промышленности,
            производства и сервисного обслуживания.
          </p>

          <nav className="brands-hero-nav" aria-label="Навигация по странице">
            {NAV.map((n) => (
              <button key={n.target} className="brands-hero-nav-item" onClick={() => scrollTo(n.target)}>
                <span>{n.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
