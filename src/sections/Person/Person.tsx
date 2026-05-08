import {
  BIO_PARAGRAPHS,
  KANZLER_TIMELINE,
  LINEAGE,
  MEMBERSHIPS,
  PERSON_CROSS_LINKS,
  PERSON_PULL_QUOTE,
  TIMELINE,
} from '@/data/person';
import { ResponsiveImage } from '@/components/ResponsiveImage/ResponsiveImage';
import styles from './Person.module.css';

export function Person() {
  return (
    <section className={styles.person} id="person" aria-labelledby="person-heading">
      <div className={`${styles.intro} reveal`}>
        <p className={styles.eyebrow}>Person · 04</p>
        <h2 id="person-heading" className={styles.headline}>
          Jakob Bader.
          <br />
          <em className={styles.headlineEm}>Architekt als Bühnenbildner.</em>
        </h2>
      </div>

      <div className={styles.spread}>
        <div className={`${styles.portrait} reveal`}>
          <ResponsiveImage
            src="/portraits/bader-salon.jpg"
            alt="Porträt Jakob Bader im eigenen Salon, Petersburger Hängung im Hintergrund"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className={`${styles.bio} reveal`}>
          {BIO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <div className={styles.timeline}>
            {TIMELINE.map((item) => (
              <div key={item.year} className={styles.timelineItem}>
                <strong>{item.year}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanzler micro-timeline — typographic per brief §7.5 */}
      <div className={`${styles.kanzler} reveal`}>
        <div className={styles.kanzlerLabel}>
          Kulturkiosk Kanzler
          <strong>2000 — 2002</strong>
          <span className={styles.kanzlerSub}>
            Behelfsbau gegenüber der TU als politischer Salon. Ein Jahr lang an jedem
            Freitagabend. Aufsehenerregend bis über die Stadtgrenze hinaus.
          </span>
        </div>
        <div className={styles.kanzlerTimeline}>
          {KANZLER_TIMELINE.map((row) => (
            <div key={`${row.year}-${row.tag}`} className={styles.kanzlerRow}>
              <span className={styles.kanzlerYear}>{row.year}</span>
              <span className={styles.kanzlerLine}>
                {row.lead} <em className={styles.kanzlerLineEm}>{row.em}</em>
                <span className={styles.kanzlerTag}>· {row.tag}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.second}>
        <p className={`${styles.secondText} reveal`}>
          Architektur ist nicht nur eine Hülle, sondern vor allem{' '}
          <strong>{PERSON_PULL_QUOTE.emphasis}</strong>. Und ein Raum ist ohne den Menschen
          leer und sinnlos. Erst Menschen erfüllen ihn mit Leben.
          <span className={styles.secondCite}>— Jakob Bader</span>
        </p>
        <div className={`${styles.secondImg} reveal`}>
          <ResponsiveImage
            src="/portraits/bader-kueche.jpg"
            alt="Jakob Bader in seiner Küche mit verspiegelten Oberschränken"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className={`${styles.memberships} reveal`}>
        <p className={styles.membershipsLabel}>Mitgliedschaften & Auszeichnungen</p>
        <div className={styles.membershipsList}>
          {MEMBERSHIPS.map((m) => (
            <div key={m.code} className={styles.membership}>
              <span className={styles.membershipCode}>{m.code}</span>
              {m.detail ? <span className={styles.membershipDetail}>{m.detail}</span> : null}
            </div>
          ))}
        </div>
        <div className={styles.crossLinks}>
          <a
            href={PERSON_CROSS_LINKS.brillux.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.crossLink}
          >
            <span className={styles.crossLinkLabel}>Homestory</span>
            <span className={styles.crossLinkTitle}>{PERSON_CROSS_LINKS.brillux.label}</span>
            <span className={styles.crossLinkNote}>{PERSON_CROSS_LINKS.brillux.note}</span>
            <span className={styles.crossLinkArrow}>brillux.de →</span>
          </a>
          <a
            href={PERSON_CROSS_LINKS.fassadenpreis.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.crossLink}
          >
            <span className={styles.crossLinkLabel}>Auszeichnung</span>
            <span className={styles.crossLinkTitle}>{PERSON_CROSS_LINKS.fassadenpreis.label}</span>
            <span className={styles.crossLinkNote}>{PERSON_CROSS_LINKS.fassadenpreis.note}</span>
            <span className={styles.crossLinkArrow}>stadt.muenchen.de →</span>
          </a>
        </div>
      </div>

      <div className={`${styles.lineage} reveal`}>
        <p className={styles.lineageTitle}>Geistige Familie</p>
        <div className={styles.lineageWall}>
          {LINEAGE.map((entry) => (
            <div
              key={entry.name}
              className={styles.lineageItem}
              tabIndex={0}
              role="article"
              aria-label={`${entry.name}: ${entry.reason}`}
            >
              <h3 className={styles.lineageName}>{entry.name}</h3>
              <p className={styles.lineageReason} aria-hidden="true">
                {entry.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
