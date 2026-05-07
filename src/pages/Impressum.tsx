import { useEffect } from 'react';
import { CONTACT } from '@/data/manifest';

export function Impressum() {
  useEffect(() => {
    document.title = 'Impressum · Jakob Bader Architektur';
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
          Impressum
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
          Angaben gemäß <em>§ 5 TMG</em>
        </h1>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            fontSize: 'var(--fs-body-lg)',
            lineHeight: 1.65,
            color: 'var(--paper-on-deep-soft)',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                fontWeight: 400,
                color: 'var(--paper-on-deep)',
                marginBottom: '8px',
              }}
            >
              Anbieter
            </h2>
            <p>
              Jakob Bader
              <br />
              Jakob Bader Architektur
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                fontWeight: 400,
                color: 'var(--paper-on-deep)',
                marginBottom: '8px',
              }}
            >
              Kontakt
            </h2>
            <p>
              E-Mail:{' '}
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--accent-soft)' }}>
                {CONTACT.email}
              </a>
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                fontWeight: 400,
                color: 'var(--paper-on-deep)',
                marginBottom: '8px',
              }}
            >
              Kammerzugehörigkeit
            </h2>
            <p>{CONTACT.bak}</p>
            <p>
              Berufsbezeichnung: Architekt (verliehen in der Bundesrepublik Deutschland)
              <br />
              Zuständige Aufsichtsbehörde:{' '}
              <a
                href="https://www.byak.de"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-soft)' }}
              >
                Bayerische Architektenkammer
              </a>
            </p>
          </div>

          <p style={{ fontSize: 'var(--fs-body-sm)', opacity: 0.6 }}>
            Stand: laufend. Vollständiger Impressum-Text wird vor Live-Schaltung mit Bader
            abgestimmt.
          </p>
        </section>
      </div>
    </article>
  );
}
