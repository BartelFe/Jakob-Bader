import type { Projekt } from '@/data/projekte';
import styles from './T61Showcase.module.css';

interface T61ShowcaseProps {
  projekt: Projekt;
}

/**
 * T61 — Restauration als Kunst.
 *
 * Treatment: detail-cards. Three rebuilt elements get individual cards
 * showing the photo + a short note on the restoration craft involved.
 * Brief §7.3: "Heizkörper, Stuck, Treppe als individuell animierte Cards".
 */
export function T61Showcase({ projekt }: T61ShowcaseProps) {
  // Curated detail mapping from the photoset. Indices match the disk order.
  const cards: Array<{
    image: string;
    number: string;
    titleLead: string;
    titleEmphasis: string;
    text: string;
    meta: string;
  }> = [
    {
      image: projekt.images[0] ?? projekt.hero,
      number: 'I',
      titleLead: 'Stuck als',
      titleEmphasis: 'Substanz.',
      text: 'Decken nach historischen Stichen rekonstruiert. Profile abgeformt, Rosetten neu gegossen — keine Annäherung, sondern Wiederbringung.',
      meta: 'Decke · Wand · Fries',
    },
    {
      image: projekt.images[2] ?? projekt.hero,
      number: 'II',
      titleLead: 'Treppe in',
      titleEmphasis: 'Eichenbohle.',
      text: 'Holztreppe in Originalgeometrie, Geländer als Schmiedearbeit, Antrittspfosten gedrechselt nach Vorlage Böhmer. Kein Kompromiss bei der Trittfläche.',
      meta: 'Antritt · Wange · Geländer',
    },
    {
      image: projekt.images[4] ?? projekt.hero,
      number: 'III',
      titleLead: 'Heizkörper aus',
      titleEmphasis: 'dem Ruhrgebiet.',
      text: 'Gliederheizkörper eigens nach historischer Form gegossen. Ein Werkstoff, der heute als „nicht mehr herstellbar" gilt — bis man die richtige Gießerei findet.',
      meta: 'Guss · Patina · Auf Maß',
    },
  ];

  // Remaining images not used in cards become a tighter editorial gallery.
  const usedIndices = new Set([0, 2, 4]);
  const remaining = projekt.images.filter((_, i) => !usedIndices.has(i));
  const layout = ['span8', 'span4', 'span6', 'span6'] as const;

  return (
    <>
      <section className={styles.section}>
        <p className={styles.label}>Restauration · Drei Handgriffe</p>
        <h2 className={styles.title}>
          Was übrig war, hieß <em className={styles.titleEm}>kaum</em>.
          <br />
          Was wir taten, hieß <em className={styles.titleEm}>genau</em>.
        </h2>
        <div className={styles.cards}>
          {cards.map((card) => (
            <article key={card.number} className={styles.card}>
              <div className={styles.cardImage}>
                <img src={card.image} alt={`T61 — ${card.titleLead} ${card.titleEmphasis}`} loading="lazy" />
              </div>
              <span className={styles.cardNumber}>Detail {card.number}</span>
              <h3 className={styles.cardTitle}>
                {card.titleLead} <em className={styles.cardTitleEm}>{card.titleEmphasis}</em>
              </h3>
              <p className={styles.cardText}>{card.text}</p>
              <p className={styles.cardMeta}>{card.meta}</p>
            </article>
          ))}
        </div>
      </section>

      {remaining.length > 0 ? (
        <div className={styles.gallery}>
          {remaining.map((src, i) => {
            const layoutKey = layout[i % layout.length] ?? 'span6';
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
