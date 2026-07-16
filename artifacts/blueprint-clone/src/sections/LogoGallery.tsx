interface Logo {
  name: string;
  url: string;
}

interface LogoGalleryProps {
  title: string;
  logos: Logo[];
}

export default function LogoGallery({ title, logos }: LogoGalleryProps) {
  // Duplicate logos for seamless marquee
  const doubled = [...logos, ...logos];

  return (
    <section className="logo-section">
      <h2 className="logo-section-title">{title}</h2>
      <div className="logo-gallery-mask">
        <div className="logo-gallery-row">
          {doubled.map((logo, i) => (
            <div key={i} className="logo-item">
              <img
                src={logo.url}
                alt={logo.name}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
