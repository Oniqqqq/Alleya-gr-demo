import { useEffect, useRef } from 'react';

/**
 * Apple-style scroll reveal через data-атрибут на контейнере.
 *
 * КЛЮЧЕВОЕ: React перезаписывает className кнопок при каждом ре-рендере.
 * Поэтому мы НЕ добавляем класс к отдельным карточкам — мы добавляем
 * data-cards-revealed к КОНТЕЙНЕРУ. React не трогает data-атрибуты
 * (которых нет в JSX), поэтому состояние сохраняется при кликах.
 *
 * CSS подхватывает: [data-cards-revealed] .brand-card { animation: cardReveal ... }
 * Задержка передаётся через CSS-переменную --reveal-i (inline style в JSX).
 */
export function useCardReveal(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const revealed = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Если уже revealed (напр. после hot-reload) — сразу ставим атрибут
    if (revealed.current) {
      container.setAttribute('data-cards-revealed', 'true');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          container.setAttribute('data-cards-revealed', 'true');
          revealed.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);
}

/**
 * При смене набора карточек (напр. смена направления) — временно убираем
 * data-cards-revealed, затем возвращаем: CSS-анимация перезапускается.
 */
export function useCardRevealOnChange(
  containerRef: React.RefObject<HTMLElement | null>,
  dep: unknown,
) {
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    // Сбрасываем — карточки исчезают
    container.removeAttribute('data-cards-revealed');

    // Возвращаем через 80ms — CSS-анимация перезапускается с начала
    const tid = window.setTimeout(() => {
      container.setAttribute('data-cards-revealed', 'true');
    }, 80);

    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
