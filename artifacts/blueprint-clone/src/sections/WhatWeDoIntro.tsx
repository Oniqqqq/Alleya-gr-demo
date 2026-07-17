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

      // Окно активности эффекта: начинается, когда секция на 85% высоты экрана (снизу)
      // и завершается полностью, когда она поднимается до 20% высоты (вверху)
      const start = viewH * 0.85;
      const end = viewH * 0.20;

      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const total = wordsRef.current.length;

      wordsRef.current.forEach((word, i) => {
        if (!word) return;

        // Поэтапное распределение появления каждого слова
        const wordStart = (i / total) * 0.80; // 80% диапазона скролла отдано на слова
        const wordEnd = wordStart + 0.18;     // наложение фаз появления соседних слов

        let wordProgress = 0;
        if (progress > wordStart) {
          wordProgress = Math.min(1, (progress - wordStart) / (wordEnd - wordStart));
        }

        // Применяем плавную функцию кубического Безье (easeInOutCubic) для Apple-эффекта
        const ease = wordProgress < 0.5
          ? 4 * wordProgress * wordProgress * wordProgress
          : 1 - Math.pow(-2 * wordProgress + 2, 3) / 2;

        const opacity = 0.08 + ease * 0.92;
        word.style.opacity = opacity.toFixed(3);
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
      <p className="intro-description">
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { if (el) wordsRef.current[i] = el; }}
            className="word"
            style={{
              opacity: 0.08,
              whiteSpace: 'nowrap',
            }}
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
