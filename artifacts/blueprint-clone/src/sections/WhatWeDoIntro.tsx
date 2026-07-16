import { useEffect, useRef } from 'react';

const INTRO_TEXT = "Hiring senior mobile devs shouldn't feel uncertain. Blueprint makes it clear. Through expert screening, matched talent, flexible models, and long-term fit, we make every hire count.";

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
    <section className="what-we-do-intro" ref={sectionRef}>
      <div className="small-title">What we do</div>

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
