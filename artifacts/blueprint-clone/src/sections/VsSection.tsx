import { useEffect, useRef } from 'react';

const VS_ROWS = [
  {
    feature: 'Портфель брендов\nпод единым управлением',
    blueprint: true,
    agencies: 'Нет',
    marketplaces: 'Нет',
    portals: 'Нет',
  },
  {
    feature: 'Складская программа\nи стабильные поставки',
    blueprint: true,
    agencies: 'Иногда',
    marketplaces: 'Нет',
    portals: 'Иногда',
  },
  {
    feature: 'Поддержка продаж\nи маркетинг для партнёров',
    blueprint: true,
    agencies: 'Нет',
    marketplaces: 'Нет',
    portals: 'Нет',
  },
  {
    feature: 'Региональная сеть\nи сервисное сопровождение',
    blueprint: true,
    agencies: 'Иногда',
    marketplaces: 'Нет',
    portals: 'Нет',
  },
];

const Checkmark = () => (
  <span className="vs-checkmark" aria-label="Yes" />
);

export default function VsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    rowRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="vs-section">
      <div ref={titleRef} className="smart-text vs-title">
        <h2 className="h2">
          <span className="line"><span className="text">Аллея Групп и</span></span>
          <span className="line"><span className="text">обычная дистрибуция</span></span>
        </h2>
      </div>

      <div className="vs-table">
        {/* Header */}
        <div className="vs-thead">
          <div className="vs-tr">
            <div className="vs-th" />
            <div className="vs-th">Аллея Групп</div>
            <div className="vs-th">
              Дистрибьюторы<br />
              <span style={{ color: 'var(--muted)', fontSize: '12rem' }}>(мультибрендовые склады)</span>
            </div>
            <div className="vs-th">
              Маркетплейсы<br />
              <span style={{ color: 'var(--muted)', fontSize: '12rem' }}>(онлайн-каталоги)</span>
            </div>
            <div className="vs-th">
              Прямой импорт<br />
              <span style={{ color: 'var(--muted)', fontSize: '12rem' }}>(разовые закупки)</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="vs-tbody">
          {VS_ROWS.map((row, i) => (
            <div
              key={i}
              className="vs-tr-body"
              ref={(el) => { rowRefs.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="vs-td" style={{ whiteSpace: 'pre-line' }}>{row.feature}</div>
              <div className="vs-td">{row.blueprint ? <Checkmark /> : row.blueprint}</div>
              <div className="vs-td" style={{ color: 'var(--muted)' }}>{row.agencies}</div>
              <div className="vs-td" style={{ color: 'var(--muted)' }}>{row.marketplaces}</div>
              <div className="vs-td" style={{ color: 'var(--muted)' }}>{row.portals}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
