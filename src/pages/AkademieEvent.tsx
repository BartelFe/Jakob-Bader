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
        <Link to="/akademie" className={styles.eventBack}>
          ← Akademie-Archiv
        </Link>
        <p className={styles.eyebrow}>
          {event.dateLabel} · {isPast ? 'Vergangen' : 'Geplant'}
        </p>
        <h1 className={styles.headline}>{event.title}</h1>
      </header>

      <div className={styles.eventBody}>
        <div className={styles.eventBodyLabel}>Werkbericht</div>
        <div className={styles.eventBodyText}>
          <p style={{ marginBottom: '24px' }}>
            <strong>{event.speaker}</strong>
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
