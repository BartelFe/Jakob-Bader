import { partitionEvents, CONTACT_EMAIL } from './akademie-helpers';
import { STAMMGAST } from '@/data/akademie';
import styles from './Akademie.module.css';

const MAX_VISIBLE_PAST = 3;
const SEAT_LIMIT = 23;

export function Akademie() {
  const { upcoming, past } = partitionEvents();
  const visiblePast = past.slice(0, MAX_VISIBLE_PAST);
  const allRows = [
    ...upcoming.map((e, i) => ({
      ...e,
      status: i === 0 ? ('next' as const) : ('upcoming' as const),
    })),
    ...visiblePast.map((e) => ({ ...e, status: 'past' as const })),
  ];

  return (
    <section
      className={`${styles.akademie} surface-deep`}
      id="akademie"
      aria-labelledby="akademie-heading"
    >
      <div className={styles.intro}>
        <div className="reveal">
          <p className={styles.eyebrow}>Akademie · 03 · seit 2022</p>
          <h2 id="akademie-heading" className={styles.title}>
            Ein <em className={styles.titleEm}>Salon</em>
            <br />
            für die Stadt.
          </h2>
        </div>
        <p className={`${styles.blurb} reveal`}>
          Ein Ort, um in inspirierter Atmosphäre über die <strong>Korrelation von Architektur
          und Gesellschaft</strong> nachzudenken. Im Mittelpunkt jedes Akademieabends ein
          Impulsvortrag, ein Werk- oder Reisebericht — von Jakob Bader oder einem seiner
          Gäste. Stammgast:{' '}
          <span className={styles.speakerName} tabIndex={0}>
            <strong>{STAMMGAST.name}</strong>
            <span className={styles.speakerBio} role="tooltip">
              <strong>{STAMMGAST.role}</strong>
              {STAMMGAST.bio}
            </span>
          </span>
          .
        </p>
      </div>

      <div className={styles.body}>
        <div className={`${styles.program} reveal`}>
          {allRows.map((event) => {
            const speakerName = event.speaker;
            const isBraunfels = speakerName === STAMMGAST.name;
            return (
              <div
                key={event.slug}
                className={`${styles.row} ${event.status === 'past' ? styles.rowPast : ''} ${
                  event.status === 'next' ? styles.rowNext : ''
                }`}
              >
                <div className={styles.date}>{event.dateLabel}</div>
                <div>
                  <div className={styles.rowTitle}>
                    {event.titleEmphasis ? renderTitle(event.title, event.titleEmphasis) : event.title}
                  </div>
                  <span className={styles.speaker}>
                    Vortrag von{' '}
                    {isBraunfels ? (
                      <span className={styles.speakerName} tabIndex={0}>
                        {speakerName}
                        <span className={styles.speakerBio} role="tooltip">
                          <strong>{STAMMGAST.role}</strong>
                          {STAMMGAST.bio}
                        </span>
                      </span>
                    ) : (
                      speakerName
                    )}{' '}
                    · {event.venue}
                    {event.time ? `, ${event.time}` : ''}
                  </span>
                </div>
                <span
                  className={`${styles.tag} ${event.status === 'next' ? styles.tagLive : ''}`}
                >
                  {event.status === 'next'
                    ? 'Nächster Termin'
                    : event.status === 'upcoming'
                      ? 'Geplant'
                      : 'Vergangen'}
                </span>
              </div>
            );
          })}
        </div>

        <aside className={`${styles.aside} reveal`}>
          <div className={styles.photo}>
            <div className={styles.photoPlaceholder} aria-hidden="true">
              <div className={styles.photoPlaceholderInner}>
                <span className={styles.photoPlaceholderMono}>Akademie · Salon</span>
                <span className={styles.photoPlaceholderEm}>
                  Forum, Salon,
                  <br />
                  Vernissage, Club.
                </span>
              </div>
            </div>
          </div>
          <div className={styles.info}>
            <div>
              <strong>Format</strong>
              <p>
                Forum, Salon, Vernissage, Club. Eingeladen ist das erweiterte Umfeld des
                Architekturbüros — und alle, die mitdenken wollen.
              </p>
            </div>
            <div>
              <strong>Ort</strong>
              <p>JBA · Amalienstraße 14a · 80799 München · Maxvorstadt</p>
            </div>
            <div>
              <strong>Akkreditierung</strong>
              <p>
                Begrenzte Besucherzahl. Anmeldung vorab per Mail an{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-draw">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <div className={styles.limitGauge} aria-hidden="true">
                <div className={styles.limitGaugeRow}>
                  <span>Plätze pro Abend</span>
                  <span className={styles.limitGaugeBig}>{SEAT_LIMIT}</span>
                </div>
                <div className={styles.limitGaugeBar}>
                  <div className={styles.limitGaugeBarFill} />
                </div>
                <div className={styles.limitGaugeRow}>
                  <span>Akkreditierung erforderlich</span>
                  <span>≈ 78 % Stammgäste</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function renderTitle(title: string, emphasis: string) {
  const idx = title.indexOf(emphasis);
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const after = title.slice(idx + emphasis.length);
  return (
    <>
      {before}
      <em className={styles.rowTitleEm}>{emphasis}</em>
      {after}
    </>
  );
}
