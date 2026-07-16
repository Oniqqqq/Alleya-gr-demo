import { useEffect, useRef } from 'react';
import Pictogram from '../components/Pictogram';

const TECH_ROWS = [
  {
    label: 'Транспорт',
    platforms: [
      {
        name: 'Легковой',
        items: [
          { label: 'Масла', icon: 'car' },
          { label: 'Жидкости', icon: 'car' },
          { label: 'Фильтры', icon: 'car' },
          { label: 'АКБ', icon: 'car' },
        ],
      },
      {
        name: 'Коммерческий',
        items: [
          { label: 'Масла HD', icon: 'truck' },
          { label: 'Компоненты', icon: 'truck' },
        ],
      },
    ],
  },
  {
    label: 'Промышленность и сервис',
    platforms: [
      {
        name: '',
        items: [
          { label: 'СОЖ', icon: 'factory' },
          { label: 'Гидравлика', icon: 'factory' },
          { label: 'Спецтехника', icon: 'excavator' },
          { label: 'Оборудование', icon: 'machine' },
          { label: 'Автохимия', icon: 'wrench' },
          { label: 'Сервис СТО', icon: 'wrench' },
        ],
      },
    ],
  },
];

export default function TechSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  let itemIndex = 0;

  return (
    <section className="tech-section">
      <div className="tech-left">
        <div className="small-title">Товарные направления</div>
        <div ref={titleRef} className="smart-text">
          <h2 className="h2 tech-subtitle">
            <span className="line"><span className="text">От транспорта</span></span>
            <span className="line"><span className="text">до производства.</span></span>
          </h2>
        </div>
      </div>

      <div className="tech-right">
        {TECH_ROWS.map((row, ri) => (
          <div key={ri} className="tech-row">
            <div
              className="tech-row-title fade-in-y"
              ref={(el) => { itemRefs.current[itemIndex++] = el; }}
            >
              {row.label}
            </div>
            <div className="tech-platforms">
              {row.platforms.map((platform, pi) => (
                <div key={pi} className="tech-platform">
                  {platform.name && (
                    <span
                      className="tech-platform-title fade-in-y"
                      ref={(el) => { itemRefs.current[itemIndex++] = el as unknown as HTMLDivElement | null; }}
                    >
                      {platform.name}
                    </span>
                  )}
                  <div className="tech-items">
                    {platform.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="tech-item fade-in-y"
                        ref={(el) => { itemRefs.current[itemIndex++] = el; }}
                        style={{ transitionDelay: `${ii * 0.06}s` }}
                      >
                        <div className="tech-item-icon" style={{ color: 'var(--muted)' }}>
                          <Pictogram icon={item.icon} size="100%" />
                        </div>
                        <span className="tech-item-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
