import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { AKADEMIE_EVENTS } from '@/data/akademie';
import { CONTACT } from '@/data/manifest';
import { NotFound } from './NotFound';

import styles from './Akademie.module.css';

export function AkademieEvent() {
  const { slug } = useParams<{ slug: string }>();
  const event = AKADEMIE_EVENTS.find((e) => e.slug === slug);

  useEffect(() => {
    if (event) document.title = `${event.title} · Akademie · JBA`;
    return () => {
      document.title = 'Jakob Bader Architektur — Mut zum Raum';
    };
  }, [event]);

  if (!event) return <NotFound />;

  const today = new Date().toISOString().slice(0, 10);
  const isPast = event.dateISO < today;

  return (
    <article className={styles.page}>
      <header className={styles.intro}>
        <Link
          to="/akademie"
          style={{
            display: 'inline-block',
            marginBottom: '32px',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-mono-sm)',
            letterSpacing: 'var(--ls-mono)',
            textTransform: 'uppercase',
            opacity: 0.62,
          }}
        >
          ← Akademie-Archiv
        </Link>
        <p className={styles.eyebrow}>
          {event.dateLabel} · {isPast ? 'Vergangen' : 'Geplant'}
        </p>
        <h1 className={styles.headline}>{event.title}</h1>
      </header>

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 'clamp(48px, 6vw, 120px)',
          alignItems: 'start',
          paddingBlock: '48px',
          borderTop: '1px solid var(--line-on-deep)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: 'var(--ls-eyebrow)',
            textTransform: 'uppercase',
            color: 'var(--paper-on-deep-soft)',
          }}
        >
          Werkbericht
        </div>
        <div
          style={{
            fontSize: 'var(--fs-body-lg)',
            lineHeight: 1.65,
            color: 'var(--paper-on-deep-soft)',
            maxWidth: '720px',
          }}
        >
          <p style={{ marginBottom: '24px' }}>
            <strong style={{ color: 'var(--paper-on-deep)' }}>{event.speaker}</strong>
            {event.isGuest ? ' (Gast)' : ''} · {event.venue}
            {event.city ? `, ${event.city}` : ''}
            {event.time ? ` · ${event.time}` : ''}
          </p>
          {!isPast ? (
            <p>
              Begrenzte Besucherzahl. Anmeldung vorab per Mail an{' '}
              <a
                href={`mailto:${CONTACT.email}?subject=Anmeldung%20${encodeURIComponent(event.title)}`}
                className="link-draw"
                style={{ color: 'var(--accent-soft)' }}
              >
                {CONTACT.email}
              </a>
            </p>
          ) : (
            <p>Dieser Vortrag ist Teil des Akademie-Archivs.</p>
          )}
        </div>
      </div>
    </article>
  );
}
