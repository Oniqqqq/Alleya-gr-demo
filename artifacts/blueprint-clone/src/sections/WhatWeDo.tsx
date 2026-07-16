import { useEffect, useRef, useState } from 'react';
import { img } from '../data/assets';

const STEPS = [
  {
    title: 'Портфель брендов',
    titleSub: 'Единая система развития',
    subtitle: 'Собственные и партнёрские бренды под общими стандартами качества.',
    image: img('infra-packaging.svg'),
  },
  {
    title: 'Поставки и логистика',
    titleSub: 'Стабильные отгрузки',
    subtitle: 'Распределительные центры и магистральные перевозки по всей стране.',
    image: img('wide-truck.svg'),
  },
  {
    title: 'Региональная сеть',
    titleSub: 'Филиалы и дилеры',
    subtitle: 'Присутствие в регионах: филиалы, дилерские центры, партнёры.',
    image: img('wide-network.svg'),
  },
  {
    title: 'Поддержка партнёров',
    titleSub: 'Сопровождение продаж',
    subtitle: 'Маркетинг, обучение и сервисная поддержка на каждом этапе.',
    image: img('wide-service.svg'),
  },
];

export default function WhatWeDo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pastCards, setPastCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionScrolled = -rect.top;
      const sectionHeight = sectionRef.current.offsetHeight;
      const stepHeight = sectionHeight / STEPS.length;

      // Progress through the section (0 to 1)
      const rawIndex = Math.min(
        STEPS.length - 1,
        Math.max(0, Math.floor(sectionScrolled / stepHeight))
      );

      setCurrentIndex(rawIndex);

      // Track past cards
      const newPast = new Set<number>();
      for (let i = 0; i < rawIndex; i++) {
        newPast.add(i);
      }
      setPastCards(newPast);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="what-we-do-section"
      style={{ height: `${STEPS.length * 100}dvh` }}
    >
      <div className="what-we-do-sticky" ref={stickyRef}>
        <div className="what-we-do-content">
          {/* Left: Step titles */}
          <div className="what-we-do-titles">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`what-we-do-title-item ${i === currentIndex ? 'active' : ''}`}
              >
                <span className="title-main h3">{step.title}</span>
                <span className="title-sub">{step.titleSub}</span>
              </div>
            ))}
          </div>

          {/* Center: Card stack */}
          <div className="what-we-do-cards">
            {STEPS.map((step, i) => {
              const dist = i - currentIndex;
              const isPast = pastCards.has(i);
              const scaleDown = Math.max(0, dist) * 0.05;
              const translateY = Math.max(0, dist) * 25;
              const opacity = 1 - Math.max(0, dist) * 0.3;
              const zIndex = STEPS.length - i;

              return (
                <div
                  key={i}
                  className={`what-we-do-card ${isPast ? 'past' : ''}`}
                  style={{
                    zIndex,
                    transform: isPast
                      ? 'translateY(-100vh)'
                      : `none`,
                  }}
                >
                  <div
                    className="what-we-do-card-inner"
                    style={{
                      transform: `scale(${1 - scaleDown}) translateY(${translateY}rem)`,
                      opacity,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#fff',
                        borderRadius: '24rem',
                        opacity: Math.max(0, dist) * 0.05,
                        pointerEvents: 'none',
                      }}
                    />
                    <img
                      className="what-we-do-card-image"
                      src={step.image}
                      alt={step.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Step subtitles */}
          <div className="what-we-do-subtitles">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`what-we-do-subtitle-item ${i === currentIndex ? 'active' : ''}`}
              >
                <span className="subtitle-main">{step.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
