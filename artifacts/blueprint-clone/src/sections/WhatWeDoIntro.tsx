import { useEffect, useRef } from 'react';

const INTRO_TEXT =
  'Сильный бренд — только начало. Масштаб создают стабильные поставки, развитая логистика, присутствие в регионах и системная поддержка партнёров. Аллея Групп объединяет эти возможности в одном портфеле.';

export default function WhatWeDoIntro() {
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 when section top hits viewport, 1 when section bottom leaves
      const progress = 1 - rect.bottom / (viewH + rect.height);
      const litCount = Math.floor(progress * wordsRef.current.length * 2);

      wordsRef.current.forEach((word, i) => {
        if (word) {
          word.style.opacity = i < litCount ? '1' : '0.07';
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const words = INTRO_TEXT.split(' ');

  return (
    <section className="what-we-do-intro" id="about" ref={sectionRef}>
      <div className="small-title">О компании</div>

      <p
        className="h1 intro-description"
        style={{ lineHeight: 0.95, letterSpacing: '-0.03em' }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { if (el) wordsRef.current[i] = el; }}
            style={{
              opacity: 0.07,
              transition: 'opacity 0.4s ease',
              display: 'inline',
            }}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
