import { Link } from 'wouter';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24rem',
        textAlign: 'center',
        padding: '0 var(--margin)',
      }}
    >
      <div className="small-title">Ошибка 404</div>
      <h1 className="h2">Страница не найдена</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '420rem', fontSize: '18rem', lineHeight: 1.4 }}>
        Возможно, страница была перемещена. Вернитесь на главную или откройте портфель брендов.
      </p>
      <div style={{ display: 'flex', gap: '16rem' }}>
        <Link href="/" className="btn-primary">На главную</Link>
        <Link href="/brands" className="btn-primary dark">Портфель брендов</Link>
      </div>
    </main>
  );
}
