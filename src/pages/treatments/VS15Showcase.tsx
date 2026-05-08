import type { Projekt } from '@/data/projekte';
import styles from './VS15Showcase.module.css';

interface VS15ShowcaseProps {
  projekt: Projekt;
}

interface Swatch {
  name: string;
  hex: string;
  use: string;
  light?: boolean;
}

const PALETTE: Swatch[] = [
  { name: 'Rosmaringrün', hex: '#5a6d4f', use: 'Linoleum, Bodenfläche', light: true },
  { name: 'Pariser Knochen', hex: '#e6dccd', use: 'Wand, Hauptraum' },
  { name: 'Luxembourg-Stuhl', hex: '#3d5240', use: 'Akzent, Möbel', light: true },
  { name: 'Schwabinger Lehm', hex: '#c8a888', use: 'Türen, Holzwerk' },
  { name: 'Pariser Tinte', hex: '#1c2433', use: 'Detail, Beschläge', light: true },
];

/**
 * VS15 — 3 + 1 = 5.
 *
 * Treatment: typographic. The arithmetic is the lede; the
 * Luxembourg-park-stuhl color story becomes a hover-revealing palette.
 * Brief §7.3: "3+1=5 als typografisches Statement, Linoleum-Farbpalette
 * als Hover-Reveal".
 */
export function VS15Showcase({ projekt }: VS15ShowcaseProps) {
  const layout = ['span8', 'span4', 'span12', 'span4', 'span8'] as const;

  return (
    <>
      <section className={styles.equation}>
        <div className={styles.equationDisplay} aria-hidden="true">
          <span className={styles.equationN}>3</span>
          <span className={styles.equationOp}>+</span>
          <span className={styles.equationN}>1</span>
          <span className={styles.equationOp}>=</span>
          <span className={styles.equationN}>5</span>
        </div>
        <div className={styles.equationText}>
          <p>
            Aus einer 3-Zimmer-Wohnung und einem 1-Zimmer-Apartment wird eine funktionale
            5-Zimmer-Wohnung. Eine Mauer fällt, eine andere bleibt — die Arithmetik ist die
            erste Entwurfshandlung.
          </p>
          <p>
            <strong>Die Pariser Bauherrin</strong> brachte Möbel mit, das Grün der
            Luxembourg-Parkstühle wurde zum rosmaringrünen Linoleum.
          </p>
        </div>
      </section>

      <section className={styles.palette}>
        <div className={styles.paletteHead}>
          <div>
            <p className={styles.paletteLabel}>Materialpalette · 05</p>
            <h2 className={styles.paletteTitle}>
              Eine Wohnung beginnt
              <br />
              mit einem <em className={styles.paletteTitleEm}>Stuhl</em>.
            </h2>
          </div>
          <p className={styles.paletteBlurb}>
            Die Bauherrin saß in Paris auf einem Stuhl im Jardin du Luxembourg. Das Grün
            kam mit nach München. Hover für Anwendung — die Wohnung ist die Antwort auf
            den Stuhl.
          </p>
        </div>
        <div className={styles.swatches}>
          {PALETTE.map((s) => (
            <div
              key={s.hex}
              className={styles.swatch}
              style={{ background: s.hex }}
              data-light={s.light ? 'true' : 'false'}
              tabIndex={0}
              aria-label={`${s.name} · ${s.hex}`}
            >
              <div className={styles.swatchHover} aria-hidden="true" />
              <div className={styles.swatchInfo}>
                <span className={styles.swatchName}>{s.name}</span>
                <span className={styles.swatchHex}>{s.hex}</span>
                <span className={styles.swatchUse}>{s.use}</span>
              </div>
            </div>
          ))}
        </div>
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
