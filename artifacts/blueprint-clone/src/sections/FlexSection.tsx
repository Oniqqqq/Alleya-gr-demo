import { useEffect, useRef } from 'react';

export default function FlexSection() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [...itemsRef.current, textRef.current].filter(Boolean) as HTMLElement[];
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
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll-based parallax for the second card
  useEffect(() => {
    const el = itemsRef.current[1];
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (0.5 - progress) * 200;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="flex-section">
      <div className="flex-section-top">
        <div>
          <div className="small-title">Made to flex</div>
        </div>
        <div ref={textRef} className="smart-text">
          <h2 className="h2">
            <span className="line"><span className="text">Top-tier mobile dev talent. Fast, flexible, and</span></span>
            <span className="line"><span className="text">fully aligned with your goals. Work with a</span></span>
            <span className="line"><span className="text">global team engineered to grow and evolve</span></span>
            <span className="line"><span className="text">as you do.</span></span>
          </h2>
        </div>
      </div>

      <div className="flex-section-items">
        {[
          {
            image: 'https://images.prismic.io/blueprint/aN2pZZ5xUNkB1YxM_ce07cb97fa800149a773499db3cb724a74ce0eb9.jpg?auto=format&fit=max&w=750',
            title: 'Staff Augmentation',
            desc: 'Scale your engineering team fast with vetted, high-performing developers who plug in instantly.',
          },
          {
            image: 'https://images.prismic.io/blueprint/aN2njZ5xUNkB1Yv__e335a325380ce25044cd945e890db60d4377be20.jpg?auto=format&fit=max&w=750',
            title: 'Contract to Hire',
            desc: 'Trial top-tier talent risk-free, with a seamless path to full-time hire when you\'re ready.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-item fade-in"
            ref={(el) => { itemsRef.current[i] = el; }}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="flex-item-image">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <strong className="flex-item-title">{item.title}</strong>
            <p className="flex-item-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
