import { useEffect, useRef } from 'react';

const TECH_ROWS = [
  {
    label: 'Native',
    platforms: [
      {
        name: 'iOS',
        items: [
          { label: 'Swift', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7j55xUNkB13fD_Swift.svg' },
          { label: 'Objective-C', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7jZ5xUNkB13fB_OBJ-C.svg' },
        ],
      },
      {
        name: 'Android',
        items: [
          { label: 'Kotlin', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7jJ5xUNkB13fA_Kotlin.svg' },
          { label: 'Java', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7ip5xUNkB13e-_Java.svg' },
        ],
      },
    ],
  },
  {
    label: 'Hybrid',
    platforms: [
      {
        name: '',
        items: [
          { label: 'Flutter', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7iZ5xUNkB13e9_Flutter.svg' },
          { label: 'Dart', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7iJ5xUNkB13e8_Dart.svg' },
          { label: 'React Native', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7jp5xUNkB13fC_React_Native.svg' },
          { label: 'TypeScript', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7kJ5xUNkB13fE_Typescript.svg' },
          { label: 'Kotlin', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7jJ5xUNkB13fA_Kotlin.svg' },
          { label: 'JavaScript', icon: 'https://blueprint.cdn.prismic.io/blueprint/aOx7i55xUNkB13e__JavaScript.svg' },
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
        <div className="small-title">Our technologies</div>
        <div ref={titleRef} className="smart-text">
          <h2 className="h2 tech-subtitle">
            <span className="line"><span className="text">Mobile is all we do —</span></span>
            <span className="line"><span className="text">native or hybrid.</span></span>
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
                        <div className="tech-item-icon">
                          <img src={item.icon} alt={item.label} loading="lazy" />
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
