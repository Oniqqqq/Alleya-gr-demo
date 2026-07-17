import { useEffect, useRef } from 'react';
import { STATS } from '../data/stats';

/**
 * Блок показателей в стиле blueprintapps.io: без разделительных линий,
 * каждая цифра плавно «зажигается» по мере прокрутки — прогресс появления
 * привязан к положению элемента в вьюпорте (не разовый fade-in).
 */
export default function StatsSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  // Появление заголовка (существующий механизм smart-text)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  // Скролл-зависимое «зажигание» цифр
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      itemRefs.current.forEach((el) => { if (el) el.style.opacity = '1'; });
      return;
    }

    const onScroll = () => {
      const vh = window.innerHeight;
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // 0 — верх элемента на 88% высоты экрана, 1 — поднялся до 48%
        const raw = (vh * 0.88 - rect.top) / (vh * 0.40);
        const p = Math.min(1, Math.max(0, raw));
        // easeInOutCubic — той же природы, что и в текстовой scroll-секции
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        el.style.opacity = (0.1 + ease * 0.9).toFixed(3);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="stats-section">
      <div className="stats-left">
        <div className="small-title">Инфраструктура</div>
        <div ref={titleRef} className="smart-text">
          <h2 className="h2 stats-subtitle">
            <span className="line"><span className="text">Масштаб,</span></span>
            <span className="line"><span className="text">подтверждённый</span></span>
            <span className="line"><span className="text">цифрами</span></span>
          </h2>
        </div>
      </div>

      <div className="stats-right">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-item"
            ref={(el) => { itemRefs.current[i] = el; }}
          >
            <span className="stat-number">{stat.value}</span>
            <p className="h4 stat-desc">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
