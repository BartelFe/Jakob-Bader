import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AKADEMIE_EVENTS, type AkademieTopic } from '@/data/akademie';
import { JsonLd } from '@/components/JsonLd/JsonLd';
import { AkademieVenueMap } from './AkademieVenueMap';
import styles from './Akademie.module.css';

type Filter = 'all' | 'upcoming' | 'past' | 'guest' | AkademieTopic;
type View = 'list' | 'map';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'upcoming', label: 'Kommend' },
  { id: 'past', label: 'Archiv' },
  { id: 'werkbericht', label: 'Werkbericht' },
  { id: 'reisebericht', label: 'Reisebericht' },
  { id: 'stadtdiskurs', label: 'Stadtdiskurs' },
  { id: 'architekturgeschichte', label: 'Architekturgeschichte' },
  { id: 'guest', label: 'Gäste' },
];

export function Akademie() {
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>('list');
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // JSON-LD: schema.org Event entries for upcoming + recent past
  const eventSchemas = useMemo(
    () =>
      AKADEMIE_EVENTS.map((e) => ({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: e.title,
        startDate: e.dateISO,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: e.venue,
          address: {
            '@type': 'PostalAddress',
            addressLocality: e.city ?? 'München',
            addressCountry: 'DE',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: 'Jakob Bader Architektur',
          url: 'https://jakobbader.de/',
        },
        performer: {
          '@type': 'Person',
          name: e.speaker,
        },
        description: `Akademie-Salon · ${e.title} · Vortrag von ${e.speaker}.`,
      })),
    [],
  );

  useEffect(() => {
    document.title = 'Akademie · Jakob Bader Architektur';
    return () => {
      document.title = 'Jakob Bader Architektur — Mut zum Raum';
    };
  }, []);

  const filtered = AKADEMIE_EVENTS.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return e.dateISO >= today;
    if (filter === 'past') return e.dateISO < today;
    if (filter === 'guest') return e.isGuest;
    return e.topic === filter;
  }).sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  return (
    <article className={styles.page}>
      <JsonLd id="akademie-events" data={eventSchemas} />
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Akademie · Vollarchiv</p>
        <h1 className={styles.headline}>
          Ein Salon
          <br />
          <em className={styles.headlineEm}>für die Stadt.</em>
        </h1>
      </header>

      <div className={styles.viewToggle} role="tablist" aria-label="Ansicht wählen">
        <button
          type="button"
          className={`${styles.viewToggleBtn} ${view === 'list' ? styles.viewToggleBtnActive : ''}`}
          onClick={() => setView('list')}
          role="tab"
          aria-selected={view === 'list'}
        >
          Liste
        </button>
        <button
          type="button"
          className={`${styles.viewToggleBtn} ${view === 'map' ? styles.viewToggleBtnActive : ''}`}
          onClick={() => setView('map')}
          role="tab"
          aria-selected={view === 'map'}
        >
          Orte
        </button>
      </div>

      {view === 'list' ? (
        <>
          <div className={styles.filters} role="tablist" aria-label="Akademie-Filter">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`${styles.filterBtn} ${filter === f.id ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(f.id)}
                role="tab"
                aria-selected={filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={styles.list}>
        {filtered.map((event) => {
          const isPast = event.dateISO < today;
          const isNext = !isPast && event === filtered.find((e) => e.dateISO >= today);
          return (
            <Link
              key={event.slug}
              to={`/akademie/${event.slug}`}
              className={`${styles.listItem} ${isPast ? styles.listItemPast : ''}`}
            >
              <div className={styles.listDate}>{event.dateLabel}</div>
              <div>
                <div className={styles.listTitle}>{event.title}</div>
                <span className={styles.listMeta}>
                  Vortrag von {event.speaker} · {event.venue}
                  {event.time ? `, ${event.time}` : ''}
                </span>
              </div>
              <span className={`${styles.listTag} ${isNext ? styles.listTagLive : ''}`}>
                {isNext ? 'Nächster Termin' : isPast ? 'Vergangen' : 'Geplant'}
              </span>
            </Link>
          );
        })}
          </div>
        </>
      ) : (
        <AkademieVenueMap />
      )}
    </article>
  );
}
