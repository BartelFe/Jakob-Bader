import { BIO_PARAGRAPHS, TIMELINE, PERSON_PULL_QUOTE, LINEAGE } from '@/data/person';
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
          <img
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

      <div className={styles.second}>
        <p className={`${styles.secondText} reveal`}>
          „Architektur ist nicht nur eine Hülle, sondern vor allem{' '}
          <strong>{PERSON_PULL_QUOTE.emphasis}</strong>. Und ein Raum ist ohne den Menschen leer
          und sinnlos. Erst Menschen erfüllen ihn mit Leben."
        </p>
        <div className={`${styles.secondImg} reveal`}>
          <img
            src="/portraits/bader-kueche.jpg"
            alt="Jakob Bader in seiner Küche mit verspiegelten Oberschränken"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className={`${styles.lineage} reveal`}>
        <p className={styles.lineageTitle}>Geistige Familie</p>
        <div className={styles.lineageWall}>
          {LINEAGE.map((entry) => (
            <div key={entry.name} className={styles.lineageItem} tabIndex={0}>
              <h3 className={styles.lineageName}>{entry.name}</h3>
              <p className={styles.lineageReason}>{entry.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
