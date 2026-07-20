import { useEffect, useRef, useState } from 'react';
import { BRANDS, Brand } from '../../data/brands';
import { getApplication } from '../../data/applications';
import Pictogram from '../../components/Pictogram';
import Barrel3D from '../../components/Barrel3D';
import HonestSignBadge from '../../components/HonestSignBadge';
import { useCardReveal } from '../../hooks/use-metal-sheen';

interface BrandPickerProps {
  selectedBrandId: string;
  onSelectBrand: (id: string) => void;
}

/**
 * Шоукейс портфеля брендов: слева — бочка, которая крутится при прокрутке,
 * делает оборот при смене бренда и перекрашивается в фирменный цвет;
 * справа — короткая продающая подача; внизу — лента карточек-табов.
 */
export default function BrandPicker({ selectedBrandId, onSelectBrand }: BrandPickerProps) {
  // displayed отстаёт от selected на время исходящей анимации текста;
  // бочка реагирует на selected сразу — цвет и оборот бесшовные
  const [displayed, setDisplayed] = useState<Brand>(
    () => BRANDS.find((b) => b.id === selectedBrandId) ?? BRANDS[0],
  );
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('entering');
  const stripRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef(0);
  const enterTimer = useRef(0);

  const selected = BRANDS.find((b) => b.id === selectedBrandId) ?? BRANDS[0];
  const selectedIndex = BRANDS.findIndex((b) => b.id === selected.id);

  useCardReveal(stripRef as React.RefObject<HTMLElement>);

  // Смена бренда: тексты уходят → подменяются → входят каскадом
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
      enterTimer.current = window.setTimeout(() => setPhase('idle'), 1100);
    }, 380);

    return () => {
      clearTimeout(leaveTimer.current);
      clearTimeout(enterTimer.current);
    };
  }, [selectedBrandId, displayed.id]);

  useEffect(() => {
    enterTimer.current = window.setTimeout(() => setPhase('idle'), 1100);
    return () => clearTimeout(enterTimer.current);
  }, []);

  // Активная карточка плавно доводится до видимой области ленты
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>('.brand-card.active');
    if (!active) return;
    strip.scrollTo({
      left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [selectedBrandId]);

  const step = (dir: 1 | -1) => {
    const next = (selectedIndex + dir + BRANDS.length) % BRANDS.length;
    onSelectBrand(BRANDS[next].id);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="brand-picker" id="brands-picker">
      <div className="brand-picker-head showcase-head">
        <div className="small-title">Портфель брендов</div>
        <span className="showcase-counter">
          {String(selectedIndex + 1).padStart(2, '0')} — {String(BRANDS.length).padStart(2, '0')}
        </span>
      </div>

      <div className="showcase">
        {/* ── Сцена с бочкой ─────────────────────────────────────────── */}
        <div className="showcase-scene">
          <div className="showcase-halo" style={{ background: selected.accent }} aria-hidden="true" />
          <Barrel3D
            color={selected.barrelColor}
            logo={selected.logo}
            logoAlt={selected.name}
            spinKey={selected.id}
          />
        </div>

        {/* ── Короткая подача ────────────────────────────────────────── */}
        <div className={`showcase-info phase-${phase}`}>
          <h3 className="showcase-name seq seq-1">{displayed.name}</h3>
          <p className="showcase-tagline seq seq-2" style={{ color: displayed.accent }}>
            {displayed.shortDescription}
          </p>
          <p className="showcase-desc seq seq-3">{displayed.fullDescription}</p>

          <HonestSignBadge className="seq seq-3" />

          <div className="showcase-industries seq seq-4">
            {displayed.applicationIds.map((id) => {
              const app = getApplication(id);
              return app ? (
                <span key={id} className="showcase-industry">
                  <span className="showcase-industry-icon"><Pictogram icon={app.icon} size="100%" /></span>
                  <span>{app.name}</span>
                </span>
              ) : null;
            })}
          </div>

          <div className="showcase-actions seq seq-5">
            <button className="btn-primary" onClick={scrollToContact}>
              Обсудить сотрудничество
            </button>
            <a className="btn-primary dark" href={displayed.websiteUrl} target="_blank" rel="noreferrer">
              Сайт бренда ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── Лента карточек-табов ─────────────────────────────────────── */}
      <div className="brand-strip-wrap">
        <button className="strip-arrow" onClick={() => step(-1)} aria-label="Предыдущий бренд">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>

        <div className="brand-strip" ref={stripRef}>
          {BRANDS.map((brand, index) => (
            <button
              key={brand.id}
              id={`brand-${brand.id}`}
              className={`brand-card ${brand.id === selectedBrandId ? 'active' : ''}`}
              style={{ '--reveal-i': index, '--brand-accent': brand.accent } as React.CSSProperties}
              onClick={() => onSelectBrand(brand.id)}
              aria-pressed={brand.id === selectedBrandId}
            >
              <span className="brand-card-dot" aria-hidden="true" />
              <span className="brand-card-name">{brand.name}</span>
              <span className="brand-card-chips">
                {brand.applicationIds.slice(0, 2).map((id) => {
                  const app = getApplication(id);
                  return app ? <span key={id} className="brand-chip">{app.name}</span> : null;
                })}
              </span>
              <HonestSignBadge className="compact" />
            </button>
          ))}
        </div>

        <button className="strip-arrow" onClick={() => step(1)} aria-label="Следующий бренд">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
