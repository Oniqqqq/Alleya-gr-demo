import { useEffect, useRef } from 'react';
import { img } from '../data/assets';

export default function FlexSection() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const targets = itemsRef.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll-based parallax for the second card
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = itemsRef.current[1];
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (0.5 - progress) * 200;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="flex-section">
      <div className="flex-section-top">
        <div>
          <div className="small-title">Как мы работаем</div>
        </div>
      </div>

      <div className="flex-section-items">
        {[
          {
            image: img('wide-warehouse.svg'),
            title: 'Дистрибуция и поставки',
            desc: 'Консолидированные закупки, складская программа и стабильные отгрузки для дилеров и сетей во всех регионах присутствия.',
          },
          {
            image: img('wide-service.svg'),
            title: 'Поддержка продаж',
            desc: 'Маркетинговые программы, обучение персонала и сервисное сопровождение для роста продаж партнёров.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-item fade-in"
            ref={(el) => { itemsRef.current[i] = el; }}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="flex-item-image">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <strong className="flex-item-title">{item.title}</strong>
            <p className="flex-item-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
