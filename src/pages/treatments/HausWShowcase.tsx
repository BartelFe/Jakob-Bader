import type { Projekt } from '@/data/projekte';
import styles from './HausWShowcase.module.css';

interface HausWShowcaseProps {
  projekt: Projekt;
}

/**
 * Haus W — Villa für einen Geschichtsprofessor.
 *
 * Treatment: split-view. Schinkel-photograph isn't available, so the
 * brief's "split-view Schinkel Photo neben Haus W" is rendered
 * typographically: two named columns establish the lineage, then a
 * synthesis statement closes the argument. Per Felix's confirmation,
 * typographic in lieu of missing photograph.
 */
export function HausWShowcase({ projekt }: HausWShowcaseProps) {
  const layout = ['span12', 'span6', 'span6', 'span8', 'span4'] as const;

  return (
    <>
      <section className={styles.lineage} aria-label="Geistige Linie">
        <article className={styles.lineageColumn}>
          <span className={styles.lineageNumber}>Pate I</span>
          <h2 className={styles.lineageName}>
            Karl Friedrich
            <br />
            <em className={styles.lineageNameEm}>Schinkel</em>
          </h2>
          <span className={styles.lineageMeta}>1781–1841 · Preussen · Klassizismus</span>
          <p className={styles.lineageText}>
            Das Schloss Charlottenhof. Die Bauakademie. Die Haltung, dass ein Bau die Stadt
            erklärt — nicht umgekehrt. Klassizismus nicht als Stil, sondern als ethische
            Disziplin der Form.
          </p>
        </article>

        <span className={styles.lineageDivider} aria-hidden="true">
          ×
        </span>

        <article className={styles.lineageColumn}>
          <span className={styles.lineageNumber}>Pate II</span>
          <h2 className={styles.lineageName}>
            Farnsworth
            <br />
            <em className={styles.lineageNameEm}>House</em>
          </h2>
          <span className={styles.lineageMeta}>1951 · Plano IL · Mies van der Rohe</span>
          <p className={styles.lineageText}>
            Die Wand wird zur Membran. Das Haus wird zur Plattform. Eine Geste, die seitdem
            jeden Villenentwurf neu zu rechtfertigen zwingt — auch und gerade einen
            klassizistischen.
          </p>
        </article>
      </section>

      <section className={styles.synthesis}>
        <p className={styles.synthesisLabel}>Synthese · Berlin</p>
        <p className={styles.synthesisText}>
          Standpunkt frontal auf die Kirche im Kreisverkehr. <strong>Tessenow</strong> oder{' '}
          <strong>Loos</strong> hätten ihn ebenso entwerfen können — und das ist genau das
          Argument.
        </p>
      </section>

      {projekt.images.length > 0 ? (
        <div className={styles.gallery}>
          {projekt.images.map((src, i) => {
            const layoutKey = layout[i % layout.length] ?? 'span12';
            return (
              <figure key={src} className={`${styles.galleryItem} ${styles[layoutKey]}`}>
                <img src={src} alt={`${projekt.code} — ${i + 1}`} loading="lazy" />
              </figure>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
