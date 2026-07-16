import { useEffect, useRef } from 'react';
import { STATS } from '../data/stats';

export default function StatsSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section">
      <div className="stats-left">
        <div className="small-title">Инфраструктура</div>
        <div ref={titleRef} className="smart-text">
          <h2 className="h2 stats-subtitle">
            <span className="line"><span className="text">Масштаб,</span></span>
            <span className="line"><span className="text">подтверждённый</span></span>
            <span className="line"><span className="text">инфраструктурой</span></span>
          </h2>
        </div>
      </div>

      <div className="stats-right">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-item"
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <span className="super stat-number">{stat.value}</span>
            <p className="h4 stat-desc">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
