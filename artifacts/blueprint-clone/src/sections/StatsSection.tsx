import { useEffect, useRef } from 'react';

const STATS = [
  { number: '<5%', desc: 'Acceptance rate into our CTO vetted network' },
  { number: '94%', desc: 'Developer retention on client teams for 2.5+ years (avg tenure w/ Blueprint = 6 years)' },
  { number: '84%', desc: 'Contract-to-hire engineers convert to full time' },
  { number: '86%', desc: 'Staff Augmentation Clients renew after the initial 6 month engagement' },
];

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
        <div className="small-title">The model works</div>
        <div ref={titleRef} className="smart-text">
          <h2 className="h2 stats-subtitle">
            <span className="line"><span className="text">Here's the proof.</span></span>
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
            <span className="super stat-number">{stat.number}</span>
            <p className="h4 stat-desc">{stat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
