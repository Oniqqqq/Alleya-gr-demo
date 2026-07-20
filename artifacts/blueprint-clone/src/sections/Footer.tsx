import { Link } from 'wouter';
import AlleyaLogo from '../components/AlleyaLogo';
import { BRANDS } from '../data/brands';
import { APPLICATIONS } from '../data/applications';

const SITE_LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'О компании', href: '/#about' },
  { label: 'Портфель брендов', href: '/brands' },
  { label: 'Карта присутствия', href: '/#map' },
  { label: 'Контакты', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Columns */}
      <div className="footer-columns">
        <div className="footer-col footer-col-brand">
          <Link href="/" className="footer-logo" aria-label="Аллея Групп — главная">
            <AlleyaLogo className="footer-logo-text" />
          </Link>
          <p className="footer-col-desc">
            Портфель брендов, система поставок и поддержка продаж
            на всей территории присутствия.
          </p>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Разделы</span>
          {SITE_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
          ))}
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Портфель брендов</span>
          {BRANDS.slice(0, 6).map((b) => (
            <Link key={b.id} href={`/brands#brand-${b.id}`} className="footer-link">{b.name}</Link>
          ))}
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Направления</span>
          {APPLICATIONS.map((a) => (
            <Link key={a.id} href="/brands#applications" className="footer-link">{a.name}</Link>
          ))}
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Контакты</span>
          <a href="tel:+74950000000" className="footer-link">+7 (495) 000-00-00</a>
          <a href="mailto:info@alleya-group.ru" className="footer-link">info@alleya-group.ru</a>
          <Link href="/#map" className="footer-link">Филиалы на карте</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copy">
          © {new Date().getFullYear()} Аллея Групп
        </span>

        <nav className="footer-links" aria-label="Правовая информация">
          <a href="/privacy/" className="footer-link" onClick={(e) => e.preventDefault()}>
            Политика конфиденциальности
          </a>
          <a href="/consent/" className="footer-link" onClick={(e) => e.preventDefault()}>
            Согласие на обработку персональных данных
          </a>
        </nav>
      </div>

      {/* Крупная фоновая надпись */}
      <div className="footer-watermark" aria-hidden="true">
        АЛЛЕЯ ГРУПП
      </div>
    </footer>
  );
}
