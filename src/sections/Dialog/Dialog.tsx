import { Link } from 'react-router-dom';
import { CONTACT } from '@/data/manifest';
import styles from './Dialog.module.css';

export function Dialog() {
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
          <a
            className={`${styles.cta} reveal`}
            href={`mailto:${CONTACT.email}?subject=Anfrage%20Erstgespr%C3%A4ch`}
          >
            Erstgespräch vereinbaren
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </a>
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
            <strong>Akademie-Termin</strong>
            <p>
              <Link to="/akademie" className="link-draw">
                Salon besuchen →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
