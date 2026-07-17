import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import AlleyaLogo from './AlleyaLogo';

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'О компании', href: '/#about' },
  { label: 'Бренды', href: '/brands' },
  { label: 'Направления', href: '/brands#applications' },
  { label: 'Филиалы', href: '/brands#map' },
  { label: 'Контакты', href: '/#contact' },
];

/** Навигация к якорю: внутри текущей страницы — плавный скролл, между маршрутами — через wouter. */
function useAnchorNav() {
  const [location, navigate] = useLocation();

  return (href: string) => {
    const [path, hash] = href.includes('#') ? href.split('#') : [href, ''];
    const targetPath = path || '/';
    if (targetPath === location && hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate(hash ? `${targetPath}#${hash}` : targetPath);
  };
}

export default function Nav() {
  const [isSmall, setIsSmall] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement | null>(null);
  const sheenTimerRef = useRef<number>(0);
  const go = useAnchorNav();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsSmall(y > 80);

      // Металлический блик при скролле: двигаем CSS-переменную --nav-sheen-pos
      if (navRef.current) {
        const delta = Math.abs(y - lastScrollY.current);
        if (delta > 2) {
          // Быстро перемещаем блик слева направо
          navRef.current.style.setProperty('--nav-sheen-pos', '-10% 0');
          clearTimeout(sheenTimerRef.current);
          sheenTimerRef.current = window.setTimeout(() => {
            if (navRef.current) navRef.current.style.setProperty('--nav-sheen-pos', '220% 0');
          }, 80);
        }
      }

      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(sheenTimerRef.current);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    go(href);
  };

  return (
    <>
      <nav ref={navRef as React.RefObject<HTMLElement>} className={`nav ${isSmall ? 'is-small' : ''}`}>
        <Link href="/" className="nav-logo" aria-label="Аллея Групп — главная">
          <AlleyaLogo className="nav-logo-text" markOnly={isSmall} />
        </Link>
        <div className="nav-right">
          <div className="nav-items">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="nav-item" onClick={(e) => handleNavClick(e, item.href)}>
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="nav-item nav-menu-toggle"
            style={{ marginRight: '8rem', fontFamily: 'Saans Mono, monospace', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '14rem' }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Закрыть' : 'Меню'}
          </button>
          <button className="btn-primary nav-hire" onClick={(e) => handleNavClick(e, '/#contact')}>
            Обсудить сотрудничество
          </button>
        </div>
      </nav>

      {/* Mobile/overlay menu */}
      {menuOpen && (
        <div
          className="nav-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12rem',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            background: 'rgba(245, 243, 239, 0.96)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          {[{ label: 'Главная', href: '/' }, ...NAV_ITEMS].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-overlay-link"
              style={{ fontSize: '64rem', letterSpacing: '-0.03em', color: 'var(--alleya-navy)', lineHeight: 0.9 }}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
          <div style={{ marginTop: '20rem', display: 'flex', gap: '24rem' }}>
            <a href="/privacy/" onClick={(e) => e.preventDefault()} style={{ fontSize: '14rem', color: 'var(--muted)', fontFamily: 'Saans Mono, monospace' }}>
              Политика конфиденциальности
            </a>
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: '16rem', fontSize: '16rem', padding: '18rem 36rem' }}
            onClick={(e) => handleNavClick(e, '/#contact')}
          >
            Обсудить сотрудничество
          </button>
        </div>
      )}
    </>
  );
}
