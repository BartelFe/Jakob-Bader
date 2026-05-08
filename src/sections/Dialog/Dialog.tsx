import { Link } from 'react-router-dom';

import { CONTACT } from '@/data/manifest';
import { useMagneticHover } from '@/lib/useMagneticHover';

import { MaxvorstadtMap } from './MaxvorstadtMap';
import styles from './Dialog.module.css';

const GMAPS_URL =
  'https://www.google.com/maps/place/Amalienstra%C3%9Fe+14a,+80799+M%C3%BCnchen';

export function Dialog() {
  const ctaPrimaryRef = useMagneticHover<HTMLAnchorElement>(0.32);
  const ctaSecondaryRef = useMagneticHover<HTMLAnchorElement>(0.32);

  return (
    <section
      className={`${styles.dialog} surface-deep`}
      id="dialog"
      aria-labelledby="dialog-heading"
    >
      <div className={styles.grid}>
        <div>
          <p className={`${styles.eyebrow} reveal`}>Dialog · 05</p>
          <h2 id="dialog-heading" className={`${styles.headline} reveal`}>
            Mit JBA
            <br />
            <em className={styles.headlineEm}>bauen.</em>
          </h2>
          <div className={`${styles.ctas} reveal`}>
            <a
              ref={ctaPrimaryRef}
              className={styles.ctaPrimary}
              href={`mailto:${CONTACT.email}?subject=Anfrage%20Erstgespr%C3%A4ch`}
            >
              Erstgespräch vereinbaren
              <span className={styles.ctaArrow} aria-hidden="true">
                →
              </span>
            </a>
            <Link ref={ctaSecondaryRef} className={styles.ctaSecondary} to="/akademie">
              Akademie besuchen
              <span className={styles.ctaArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
        <div className={`${styles.info} reveal`}>
          <div>
            <strong>Adresse</strong>
            <p>
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </p>
          </div>
          <div>
            <strong>Kontakt</strong>
            <p>
              <a href={`mailto:${CONTACT.email}`} className="link-draw">
                {CONTACT.email}
              </a>
            </p>
          </div>
          <div>
            <strong>Kammer</strong>
            <p>{CONTACT.bak}</p>
          </div>
        </div>
      </div>

      <div className={`${styles.map} reveal`}>
        <MaxvorstadtMap />
        <div className={styles.mapDetails}>
          <span className={styles.mapDetailLabel}>Im Kunstareal</span>
          <p className={styles.mapDetailLine}>
            Eine Querstraße nördlich der Pinakotheken. Drei Minuten zur Alten Pinakothek,
            sieben zum Königsplatz, zehn zur TU München.
          </p>
          <span className={styles.mapDetailMono}>
            48° 8′ 49″ N · 11° 34′ 23″ E
          </span>
          <a
            href={GMAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapDetailLink}
          >
            In Google Maps öffnen →
          </a>
        </div>
      </div>
    </section>
  );
}
