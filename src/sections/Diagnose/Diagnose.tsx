import { DIAGNOSE } from '@/data/manifest';
import styles from './Diagnose.module.css';

export function Diagnose() {
  return (
    <section
      className={`${styles.diagnose} surface-deep`}
      id="diagnose"
      aria-labelledby="diagnose-heading"
    >
      <div className={styles.grid}>
        <div className="reveal">
          <p className={styles.eyebrow}>{DIAGNOSE.eyebrow}</p>
          <span className={styles.number} aria-hidden="true">
            {DIAGNOSE.number}
          </span>
          <span className={styles.numberUnit}>{DIAGNOSE.numberUnit}</span>
        </div>
        <div className="reveal">
          <h2 id="diagnose-heading" className={styles.text}>
            Die wenigsten wissen, was ein Architekt{' '}
            <em className={styles.textEm}>wirklich</em> tut.
          </h2>
          <p className={styles.coda}>{DIAGNOSE.coda}</p>
        </div>
      </div>
    </section>
  );
}
