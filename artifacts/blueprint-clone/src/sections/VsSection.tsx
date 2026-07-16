import { useEffect, useRef } from 'react';

const VS_ROWS = [
  {
    feature: 'CTO-Led Vetting',
    blueprint: true,
    agencies: 'No',
    marketplaces: 'No',
    portals: 'No',
  },
  {
    feature: 'We handle all upfront vetting.\nYou only meet the top 1–2 candidates',
    blueprint: true,
    agencies: 'No',
    marketplaces: 'No',
    portals: 'No',
  },
  {
    feature: 'Staff Level Engineers',
    blueprint: true,
    agencies: 'Sometimes',
    marketplaces: 'Sometimes',
    portals: 'Sometimes',
  },
  {
    feature: 'Flexible Hiring Models',
    blueprint: true,
    agencies: 'No',
    marketplaces: 'No',
    portals: 'No',
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
          <span className="line"><span className="text">Blueprint VS</span></span>
          <span className="line"><span className="text">Traditional Hiring</span></span>
        </h2>
      </div>

      <div className="vs-table">
        {/* Header */}
        <div className="vs-thead">
          <div className="vs-tr">
            <div className="vs-th" />
            <div className="vs-th">Blueprint</div>
            <div className="vs-th">
              Dev Agencies<br />
              <span style={{ color: 'var(--muted)', fontSize: '12rem' }}>(Encora, BairesDev)</span>
            </div>
            <div className="vs-th">
              Marketplace<br />
              <span style={{ color: 'var(--muted)', fontSize: '12rem' }}>(TopTal, Upwork)</span>
            </div>
            <div className="vs-th">
              Hiring Portals<br />
              <span style={{ color: 'var(--muted)', fontSize: '12rem' }}>(ZipRecruiter, Monster)</span>
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
