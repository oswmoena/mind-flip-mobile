import type { CSSProperties } from 'react';

// Barra del portafolio de Oswall Moena (solo web), con el mismo estilo que la de Hardware Advisor.
// Aparece solo si el build define EXPO_PUBLIC_PORTFOLIO_URL (el build web del portafolio).
// Usa elementos HTML porque son enlaces normales de navegador, fuera de la app.
const PORTFOLIO_URL = process.env.EXPO_PUBLIC_PORTFOLIO_URL?.replace(/\/$/, '') ?? '';
const REPO_URL = 'https://github.com/oswmoena/mind-flip-mobile';

export function PortfolioBar() {
  if (!PORTFOLIO_URL) return null;
  return (
    <nav style={styles.bar} aria-label="Portafolio de Oswall Moena">
      <div style={styles.inner}>
        <div style={styles.group}>
          <a href={PORTFOLIO_URL} style={styles.back}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            <span style={styles.logo} aria-hidden="true">OM</span>
            <span style={styles.backText}>Portafolio de Oswall</span>
          </a>
          <span style={styles.divider} aria-hidden="true" />
          <span style={styles.app}>Mind Flip</span>
        </div>
        <div style={styles.group}>
          <a href={`${PORTFOLIO_URL}/#apps`} style={styles.link}>Otras apps</a>
          <a href={REPO_URL} style={styles.link}>Ver código</a>
        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  bar: {
    background: '#050a0f',
    borderBottom: '1px solid rgba(47, 224, 255, 0.35)',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: 14,
    flexShrink: 0,
  },
  inner: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  group: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    padding: '0 6px',
    color: '#e6f4f8',
    textDecoration: 'none',
    fontWeight: 600,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 7,
    background: '#2fe0ff',
    color: '#050a0f',
    display: 'inline-grid',
    placeItems: 'center',
    fontSize: 11,
    fontWeight: 800,
  },
  backText: { whiteSpace: 'nowrap' },
  divider: { width: 1, height: 18, background: 'rgba(230, 244, 248, 0.25)' },
  app: { color: '#2fe0ff', fontWeight: 700, whiteSpace: 'nowrap' },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
    padding: '0 12px',
    borderRadius: 10,
    border: '1px solid rgba(230, 244, 248, 0.2)',
    color: '#e6f4f8',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
};
