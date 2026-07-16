import { useEffect, useRef, useState } from 'react';
import { APPLICATIONS, Application } from '../../data/applications';
import { brandsByApplication } from '../../data/brands';
import Pictogram from '../../components/Pictogram';
import { useCardReveal, useCardRevealOnChange } from '../../hooks/use-metal-sheen';

interface ApplicationsPickerProps {
  selectedAppId: string;
  onSelectApp: (id: string) => void;
  onGoToBrand: (brandId: string) => void;
}

export default function ApplicationsPicker({ selectedAppId, onSelectApp, onGoToBrand }: ApplicationsPickerProps) {
  const [displayed, setDisplayed] = useState<Application>(
    () => APPLICATIONS.find((a) => a.id === selectedAppId) ?? APPLICATIONS[0],
  );
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const leaveTimer   = useRef(0);
  const enterTimer   = useRef(0);
  const sectionRef   = useRef<HTMLElement>(null);
  const appsListRef  = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<HTMLDivElement>(null);

  // Reveal левой панели (направления) — один раз при входе в viewport
  useCardReveal(appsListRef as React.RefObject<HTMLElement>);
  // Re-reveal карточек брендов при смене направления
  useCardRevealOnChange(stageRef as React.RefObject<HTMLElement>, displayed.id);

  useEffect(() => {
    if (selectedAppId === displayed.id) return;
    const next = APPLICATIONS.find((a) => a.id === selectedAppId);
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
      enterTimer.current = window.setTimeout(() => setPhase('idle'), 1200);
    }, 380);

    return () => {
      clearTimeout(leaveTimer.current);
      clearTimeout(enterTimer.current);
    };
  }, [selectedAppId, displayed.id]);

  const brands = brandsByApplication(displayed.id);

  return (
    <section ref={sectionRef} className="apps-picker" id="applications">
      <div className="apps-picker-head">
        <div className="small-title">По направлениям</div>
      </div>

      <div className="apps-picker-body">
        {/* ── Левая область: список направлений ─────────────────────── */}
        <div className="apps-list" ref={appsListRef}>
          {APPLICATIONS.map((app, index) => {
            const count = brandsByApplication(app.id).length;
            return (
              <button
                key={app.id}
                className={`app-card ${app.id === selectedAppId ? 'active' : ''}`}
                style={{ '--reveal-i': index } as React.CSSProperties}
                onClick={() => onSelectApp(app.id)}
                aria-pressed={app.id === selectedAppId}
              >
                <span className="app-card-icon">
                  <Pictogram icon={app.icon} size="100%" />
                </span>
                <span className="app-card-text">
                  <span className="app-card-name">{app.name}</span>
                  <span className="app-card-desc">{app.shortDescription}</span>
                </span>
                <span className="app-card-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Правая область: активное направление ───────────────────── */}
        <div className={`apps-stage phase-${phase}`}>
          <div className="apps-stage-media">
            <div className="brand-stage-image">
              <img src={displayed.image} alt={displayed.name} decoding="async" />
            </div>
          </div>

          <div className="apps-stage-info">
            <h3 className="h3 seq seq-1">{displayed.name}</h3>
            <p className="apps-stage-desc seq seq-2">{displayed.description}</p>

            <span className="brand-stage-caption seq seq-3">
              Бренды направления — {brands.length}
            </span>

            <div ref={stageRef} className="apps-stage-brands seq seq-4" key={displayed.id}>
              {brands.map((brand, index) => (
                <button
                  key={brand.id}
                  className="apps-brand-card"
                  style={{ '--reveal-i': index } as React.CSSProperties}
                  onClick={() => onGoToBrand(brand.id)}
                >
                  <span className="apps-brand-preview">
                    <img src={brand.cardImage} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="apps-brand-text">
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
      </div>
    </section>
  );
}

