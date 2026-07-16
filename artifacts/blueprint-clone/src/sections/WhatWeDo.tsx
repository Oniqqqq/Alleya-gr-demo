import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    title: 'Screen for Skill & Fit',
    titleSub: 'CTO-screened engineers',
    subtitle: 'Vetted for skill, communication, timezone fit, and values.',
    image: 'https://blueprint.cdn.prismic.io/blueprint/aXgikgIvOtkhB9v4_Talent_Card.svg?auto=format&fit=max&w=800',
  },
  {
    title: 'Simplify Selection',
    titleSub: 'Only top matches',
    subtitle: 'You meet just 1–2 engineers, pre-vetted for fit.',
    image: 'https://images.prismic.io/blueprint/aOSNoJ5xUNkB1qaw_2.png?auto=format&fit=max&w=800',
  },
  {
    title: 'Staff Smart—Scale Fast',
    titleSub: 'Flexible Staffing Options',
    subtitle: 'Staff Aug or Contract-to-Hire. 84% convert.',
    image: 'https://images.prismic.io/blueprint/aOSNn55xUNkB1qau_3.png?auto=format&fit=max&w=800',
  },
  {
    title: 'Proven Partner',
    titleSub: 'Retention',
    subtitle: '94% engineer retention. 86% client renewal.',
    image: 'https://images.prismic.io/blueprint/aOSNnp5xUNkB1qat_4.png?auto=format&fit=max&w=800',
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
