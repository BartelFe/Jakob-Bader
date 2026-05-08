import { Link } from 'react-router-dom';

import { AKADEMIE_EVENTS } from '@/data/akademie';
import styles from './Akademie.module.css';

interface VenueGroup {
  venue: string;
  city: string;
  isMunich: boolean;
  events: typeof AKADEMIE_EVENTS;
}

function groupByVenue(): VenueGroup[] {
  const map = new Map<string, VenueGroup>();
  for (const e of AKADEMIE_EVENTS) {
    const key = e.venue;
    const isMunich = e.venue.includes('JBA') || e.city === 'München';
    if (!map.has(key)) {
      map.set(key, { venue: e.venue, city: e.city ?? '—', isMunich, events: [] });
    }
    map.get(key)!.events.push(e);
  }
  // Sort: Munich first, then by event count desc
  return [...map.values()].sort((a, b) => {
    if (a.isMunich !== b.isMunich) return a.isMunich ? -1 : 1;
    return b.events.length - a.events.length;
  });
}

/**
 * Akademie venue distribution view — a schematic Bayern/BW silhouette
 * with two location pins (München primary, external venues like
 * Heidelberg secondary) plus a list grouped by venue.
 */
export function AkademieVenueMap() {
  const groups = groupByVenue();

  return (
    <div className={styles.venueGrid}>
      <div className={styles.venueMap}>
        <svg
          className={styles.venueMapSvg}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Karte: Veranstaltungsorte München und Heidelberg"
          role="img"
        >
          {/* Conceptual outline of the southern German territory */}
          <path
            className="bavaria"
            d="M 30 60 L 50 30 L 90 25 L 130 35 L 165 55 L 175 90 L 165 130 L 140 160 L 90 175 L 50 165 L 30 130 Z"
          />
          {/* Connection line between München (right, JBA) and Heidelberg (upper-left) */}
          <path className="bavariaLine" d="M 130 110 Q 100 80 60 70" />

          {/* HEIDELBERG pin — secondary, north-west */}
          <g transform="translate(60 70)" className={styles.venuePinSecondary}>
            <circle className="outer" cx="0" cy="0" r="8" />
            <circle className="inner" cx="0" cy="0" r="3" />
          </g>
          <text className="cityLabel" x="50" y="60">
            Heidelberg
          </text>

          {/* MÜNCHEN pin — primary, lower-right */}
          <g transform="translate(130 110)" className={styles.venuePinPrimary}>
            <circle className="pulse" cx="0" cy="0" r="4" />
            <circle className="outer" cx="0" cy="0" r="14" />
            <circle className="inner" cx="0" cy="0" r="5" />
          </g>
          <text className="cityLabel cityLabelAccent" x="142" y="115">
            München
          </text>
          <text className="cityLabel" x="142" y="125">
            JBA · Salon
          </text>

          {/* Compass rose */}
          <g transform="translate(180 180)" opacity="0.5">
            <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(244,237,224,0.32)" strokeWidth="0.6" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(244,237,224,0.32)" strokeWidth="0.6" />
            <text className="cityLabel" x="-3" y="-12">N</text>
          </g>
        </svg>
      </div>

      <div className={styles.venueList}>
        {groups.map((g) => (
          <div key={g.venue} className={styles.venueGroup}>
            <div className={styles.venueGroupHead}>
              <h3 className={styles.venueName}>
                {g.isMunich ? (
                  <span className={styles.venueNameAccent}>{g.venue}</span>
                ) : (
                  g.venue
                )}
              </h3>
              <span className={styles.venueCount}>
                {g.events.length}{' '}
                {g.events.length === 1 ? 'Termin' : 'Termine'}
              </span>
            </div>
            <p className={styles.venueAddress}>
              {g.city}
              {g.isMunich ? ' · Maxvorstadt · Amalienstr. 14a' : ''}
            </p>
            <div className={styles.venueEvents}>
              {g.events.map((e) => (
                <div key={e.slug} className={styles.venueEvent}>
                  <span className={styles.venueEventDate}>{e.dateLabel}</span>
                  <Link to={`/akademie/${e.slug}`} className={styles.venueEventTitle}>
                    {e.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
