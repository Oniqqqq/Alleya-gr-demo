import { useEffect, useRef, useState } from 'react';
import { BRANDS, Brand } from '../../data/brands';
import { getApplication } from '../../data/applications';
import { useCardReveal } from '../../hooks/use-metal-sheen';

interface BrandPickerProps {
  selectedBrandId: string;
  onSelectBrand: (id: string) => void;
}

/**
 * Блок выбора бренда: слева крупная область активного бренда (60%),
 * справа — вертикальный каталог с собственным нативным скроллом (40%).
 * Смена бренда идёт через направленный clip-path переход изображения
 * и последовательное появление текстовых блоков (те же easing/скорости,
 * что и в остальном проекте).
 */
export default function BrandPicker({ selectedBrandId, onSelectBrand }: BrandPickerProps) {
  // displayed отстаёт от selected на время исходящей анимации
  const [displayed, setDisplayed] = useState<Brand>(
    () => BRANDS.find((b) => b.id === selectedBrandId) ?? BRANDS[0],
  );
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('entering');
  const listRef     = useRef<HTMLDivElement>(null);
  const listWrapRef = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const leaveTimer  = useRef(0);
  const enterTimer  = useRef(0);

  // Apple-style reveal: data-cards-revealed ставится на контейнер списка
  // React не трогает data-атрибуты → состояние не сбрасывается при кликах
  useCardReveal(listWrapRef as React.RefObject<HTMLElement>);

  // Обработка смены выбранного бренда (в т.ч. извне — из блока направлений)
  useEffect(() => {
    if (selectedBrandId === displayed.id) return;
    const next = BRANDS.find((b) => b.id === selectedBrandId);
    if (!next) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplayed(next);
      setPhase('idle');
      return;
    }

    setPhase('leaving');
    clearTimeout(leaveTimer.current);
    clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setDisplayed(next);
      setPhase('entering');
      enterTimer.current = window.setTimeout(() => setPhase('idle'), 1300);
    }, 420);

    return () => {
      clearTimeout(leaveTimer.current);
      clearTimeout(enterTimer.current);
    };
  }, [selectedBrandId, displayed.id]);

  // Первичное появление
  useEffect(() => {
    enterTimer.current = window.setTimeout(() => setPhase('idle'), 1300);
    return () => clearTimeout(enterTimer.current);
  }, []);

  // Плавно доводим активную карточку до видимой области списка
  // (скроллим сам список, не страницу)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('.brand-card.active');
    if (!active) return;
    const listRect = list.getBoundingClientRect();
    const cardRect = active.getBoundingClientRect();
    if (cardRect.top < listRect.top || cardRect.bottom > listRect.bottom) {
      list.scrollTo({
        top: active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [selectedBrandId]);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={sectionRef} className="brand-picker" id="brands-picker">
      <div className="brand-picker-head">
        <div className="small-title">Портфель брендов</div>
      </div>

      <div className="brand-picker-body">
        {/* ── Левая область: активный бренд ─────────────────────────── */}
        <div className={`brand-stage phase-${phase}`}>
          <div className="brand-stage-media">
            <div className="brand-stage-image">
              <img src={displayed.heroImage} alt={displayed.name} decoding="async" />
            </div>
            {displayed.gallery.length > 1 && (
              <div className="brand-stage-thumb">
                <img src={displayed.gallery[1]} alt="" loading="lazy" decoding="async" />
              </div>
            )}
          </div>

          <div className="brand-stage-info">
            <div className="brand-stage-logo seq seq-1">
              <img src={displayed.logo} alt={`Логотип ${displayed.name}`} />
            </div>

            <h3 className="h3 brand-stage-name seq seq-2">{displayed.name}</h3>
            <p className="brand-stage-positioning seq seq-2">{displayed.shortDescription}</p>
            <p className="brand-stage-desc seq seq-3">{displayed.fullDescription}</p>

            <div className="brand-stage-features seq seq-4">
              <span className="brand-stage-caption">Направления применения</span>
              <div className="brand-stage-tags">
                {displayed.applicationIds.map((id) => {
                  const app = getApplication(id);
                  return app ? <span key={id} className="brand-tag">{app.name}</span> : null;
                })}
              </div>
            </div>

            <div className="brand-stage-features seq seq-4">
              <span className="brand-stage-caption">Продукция</span>
              <div className="brand-stage-tags">
                {displayed.features.map((f) => (
                  <span key={f} className="brand-tag dim">{f}</span>
                ))}
              </div>
            </div>

            {displayed.metrics.length > 0 && (
              <div className="brand-stage-metrics seq seq-5">
                {displayed.metrics.map((m, i) => (
                  <div key={i} className="brand-metric">
                    <span className="brand-metric-value">{m.value}</span>
                    <span className="brand-metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="brand-stage-actions seq seq-6">
              <button className="btn-primary" onClick={scrollToContact}>Обсудить сотрудничество</button>
              <a
                className="btn-primary dark"
                href={displayed.websiteUrl}
                target={displayed.websiteUrl.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                onClick={(e) => { if (!displayed.websiteUrl.startsWith('http')) e.preventDefault(); }}
              >
                Подробнее
              </a>
              {displayed.websiteUrl.startsWith('http') && (
                <a className="brand-stage-site" href={displayed.websiteUrl} target="_blank" rel="noreferrer">
                  Сайт бренда ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Правая область: каталог брендов ───────────────────────── */}
        <div className="brand-list-wrap" ref={listWrapRef}>
          <div className="brand-list" ref={listRef}>
            {BRANDS.map((brand, index) => (
              <button
                key={brand.id}
                id={`brand-${brand.id}`}
                className={`brand-card ${brand.id === selectedBrandId ? 'active' : ''}`}
                style={{ '--reveal-i': index } as React.CSSProperties}
                onClick={() => onSelectBrand(brand.id)}
                aria-pressed={brand.id === selectedBrandId}
              >
                <span className="brand-card-preview">
                  <img src={brand.cardImage} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="brand-card-text">
                  <span className="brand-card-name">{brand.name}</span>
                  <span className="brand-card-desc">{brand.shortDescription}</span>
                </span>
                <span className="brand-card-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
