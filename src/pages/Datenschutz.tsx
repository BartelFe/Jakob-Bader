import { useEffect } from 'react';

export function Datenschutz() {
  useEffect(() => {
    document.title = 'Datenschutz · Jakob Bader Architektur';
    return () => {
      document.title = 'Jakob Bader Architektur — Mut zum Raum';
    };
  }, []);

  return (
    <article
      style={{
        padding: 'clamp(140px, 18vh, 220px) var(--gutter) clamp(120px, 14vh, 200px)',
        background: 'var(--bg-deep)',
        color: 'var(--paper-on-deep)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '720px', marginInline: 'auto' }}>
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: 'var(--ls-eyebrow)',
            textTransform: 'uppercase',
            opacity: 0.62,
            marginBottom: '24px',
          }}
        >
          Datenschutz
        </p>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'var(--fs-h2)',
            lineHeight: 'var(--lh-snug)',
            letterSpacing: 'var(--ls-display)',
            fontWeight: 400,
            marginBottom: '48px',
          }}
        >
          Datenschutz<em>erklärung.</em>
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            fontSize: 'var(--fs-body-lg)',
            lineHeight: 1.65,
            color: 'var(--paper-on-deep-soft)',
          }}
        >
          <p>
            Diese Website verarbeitet personenbezogene Daten ausschließlich auf Grundlage der
            DSGVO. Wir erheben Daten nur, wenn dies zur Bereitstellung der Website oder zur
            Bearbeitung Ihrer Anfrage erforderlich ist.
          </p>
          <p>
            <strong style={{ color: 'var(--paper-on-deep)' }}>Server-Logs.</strong> Beim Aufruf
            werden technisch notwendige Daten (IP-Adresse, User-Agent, Zeitstempel) verarbeitet
            und nach kurzer Zeit gelöscht.
          </p>
          <p>
            <strong style={{ color: 'var(--paper-on-deep)' }}>Analyse.</strong> Wir nutzen Vercel
            Analytics in der cookie-freien Variante. Es werden keine
            personenbeziehbaren Profile gebildet.
          </p>
          <p>
            <strong style={{ color: 'var(--paper-on-deep)' }}>Schriften.</strong> Die Website
            lädt Schriften von Google Fonts. Beim Laden wird Ihre IP-Adresse an Google
            übermittelt.
          </p>
          <p style={{ fontSize: 'var(--fs-body-sm)', opacity: 0.6 }}>
            Stand: laufend. Vollständiger Datenschutz-Text wird vor Live-Schaltung mit Bader und
            Datenschutzbeauftragter abgestimmt.
          </p>
        </div>
      </div>
    </article>
  );
}
