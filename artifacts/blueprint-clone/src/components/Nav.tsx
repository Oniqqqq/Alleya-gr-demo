import { useEffect, useRef, useState } from 'react';

const BlueprintLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24" aria-label="Blueprint">
    <path d="M13.538 6.857H11c-1.468 0-2.538-1.213-2.538-2.572V2.572C8.462 1.128 7.332 0 5.924 0H2.54A2.55 2.55 0 0 0 0 2.571V6c0 1.395 1.078 2.571 2.56 2.571s2.516 1.247 2.516 2.589v4.268c0 6.857 1.692 8.57 8.462 8.57s8.46-1.714 8.46-8.527c0-6.814-1.692-8.616-8.46-8.616z" />
    <path d="M52.058 11.982v-.848c1.03-.367 1.92-1.583 1.92-3.302 0-2.477-1.829-3.83-4.549-3.83H42v16.056h7.749c3.407 0 4.823-1.973 4.823-4.381 0-2.18-1.166-3.371-2.514-3.693zM44.65 6.25h4.07c1.829 0 2.332.344 2.332 2.248s-.503 2.226-2.332 2.226h-4.07zm4.366 11.559h-4.366V12.83h4.366c2.012 0 2.56.368 2.56 2.477s-.548 2.5-2.56 2.5M58.457 4h-2.605v16.056h2.605zM68.402 15.514c0 2.248-.412 2.683-2.65 2.683-2.24 0-2.584-.414-2.584-2.66V8.244h-2.605v8.028c0 2.82 1.53 4.106 3.817 4.106 1.462 0 2.651-.55 3.382-1.353h.709l.045 1.033h2.47V8.244h-2.584v7.271zM78.345 7.922c-3.406 0-5.876 2.294-5.876 6.307s2.309 6.147 5.828 6.147c2.995 0 5.212-1.422 5.396-4.106h-2.515c-.182 1.606-1.211 1.995-2.903 1.995-2.515 0-3.223-.964-3.11-3.234h8.664c.046-.413.046-.802.046-1.193 0-3.394-1.874-5.918-5.532-5.918zm2.835 5.184h-5.99c-.023-2.271.777-3.005 3.063-3.005s3.064.757 2.927 3.005M92.084 7.922c-1.67 0-2.95.733-3.521 1.49h-.709l-.068-1.17H85.34v15.756h2.583v-5.091h.685c.572.733 1.806 1.467 3.406 1.467 2.628 0 4.937-1.95 4.937-6.284 0-3.99-2.01-6.17-4.869-6.17zm-1.028 10.23c-2.88 0-3.154-.62-3.154-4.013 0-3.394.273-3.967 3.154-3.967s3.132.573 3.132 3.967-.251 4.013-3.132 4.013M101.688 9.274h-.709l-.068-1.032h-2.446v11.812h2.606v-7.041c0-2.041.548-2.523 2.858-2.523h.799V7.944c-1.211-.023-2.332.39-3.04 1.33M108.718 4h-2.697v2.546h2.697zM108.672 8.244h-2.606v11.812h2.606zM117.162 7.922c-1.509 0-2.719.55-3.429 1.353h-.709l-.045-1.033h-2.469v11.812h2.583v-7.271c0-2.249.412-2.683 2.697-2.683 2.284 0 2.674.413 2.674 2.66v7.294h2.605v-8.028c0-2.82-1.553-4.106-3.908-4.106zM126.169 5.033h-2.606v3.211h-1.692v1.972h1.692v6.606c0 2.11 1.28 3.234 3.498 3.234h1.417v-2.203h-1.257c-.845 0-1.052-.205-1.052-.987v-6.651h2.309V8.242h-2.309z" />
  </svg>
);

export default function Nav() {
  const [isSmall, setIsSmall] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsSmall(y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`nav ${isSmall ? 'is-small' : ''}`}>
        <a href="/" className="nav-logo" aria-label="Blueprint home">
          <BlueprintLogo />
        </a>
        <div className="nav-right">
          <div className="nav-items">
            {['Services', 'Approach', 'Cases', 'About'].map((label) => (
              <a key={label} href={`/${label.toLowerCase()}/`} className="nav-item">
                {label}
              </a>
            ))}
          </div>
          <button
            className="nav-item"
            style={{ marginRight: '8rem', fontFamily: 'Saans Mono, monospace', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '14rem' }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <button className="btn-primary nav-hire">Hire Talent</button>
        </div>
      </nav>

      {/* Mobile/overlay menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(27,27,27,0.92)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          {['Home', 'Services', 'Approach', 'Cases', 'About'].map((label) => (
            <a
              key={label}
              href={label === 'Home' ? '/' : `/${label.toLowerCase()}/`}
              style={{ fontSize: '64rem', letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 0.9 }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div style={{ marginTop: '20rem', display: 'flex', gap: '24rem' }}>
            <a href="/terms/" style={{ fontSize: '14rem', color: 'var(--muted)', fontFamily: 'Saans Mono, monospace' }}>Terms & Conds</a>
            <a href="/privacy/" style={{ fontSize: '14rem', color: 'var(--muted)', fontFamily: 'Saans Mono, monospace' }}>Privacy Policy</a>
          </div>
          <button className="btn-primary" style={{ marginTop: '16rem', fontSize: '16rem', padding: '18rem 36rem' }}>Hire Talent</button>
        </div>
      )}
    </>
  );
}
