import { useCallback, useEffect, useState } from 'react';

import type { Projekt } from '@/data/projekte';
import styles from './AKPL22Showcase.module.css';

interface AKPL22ShowcaseProps {
  projekt: Projekt;
}

/**
 * AKPL2.2 — Wohnung im Ernst-Barth-Bau.
 *
 * Treatment: Petersburger Hängung. Salon-style irregular gallery wall —
 * dark-painted frames at varied sizes, Petersburg-museum density.
 * Click any frame → lightbox. Arrow keys + Escape navigate.
 *
 * Brief §7.3: "Petersburger-Hängung-Style — Galerie-Wand mit 9 Bildern,
 * klickbar wie ein Memory-Game".
 */
export function AKPL22Showcase({ projekt }: AKPL22ShowcaseProps) {
  const allImages = [projekt.hero, ...projekt.images];
  const wallImages = allImages.slice(0, 9);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () =>
      setLightboxIndex((i) => (i === null ? null : (i + 1) % wallImages.length)),
    [wallImages.length],
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + wallImages.length) % wallImages.length,
      ),
    [wallImages.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, close, next, prev]);

  // Lock scroll while lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex]);

  return (
    <>
      <section className={styles.intro}>
        <div>
          <p className={styles.label}>Petersburger Hängung · 02</p>
          <h2 className={styles.title}>
            Eine Wohnung als
            <br />
            <em className={styles.titleEm}>persönliche Ausstellung</em>.
          </h2>
        </div>
        <p className={styles.blurb}>
          Mailand-Feeling, Fischgrät, dezent farbig. Eine kleine Veränderung pro Raum,
          aber mit dem Anspruch, die Wohnung in „die beste Version ihrer selbst" zu
          verwandeln. Klick öffnet das jeweilige Bild groß.
        </p>
      </section>

      <section className={styles.wall}>
        <div className={styles.frames}>
          {wallImages.map((src, i) => (
            <button
              type="button"
              key={src}
              className={`${styles.frame} ${styles[`f${i}` as keyof typeof styles]}`}
              onClick={() => setLightboxIndex(i)}
              aria-label={`AKPL2.2 — Bild ${i + 1} von ${wallImages.length} öffnen`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      <div
        className={`${styles.lightbox} ${lightboxIndex !== null ? styles.lightboxOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={lightboxIndex === null}
        onClick={close}
      >
        {lightboxIndex !== null ? (
          <img
            src={wallImages[lightboxIndex]}
            alt={`AKPL2.2 — Bild ${lightboxIndex + 1}`}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        ) : null}
        <button
          type="button"
          className={styles.lightboxClose}
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          aria-label="Schließen"
        >
          ×
        </button>
        <button
          type="button"
          className={styles.lightboxPrev}
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Vorheriges Bild"
        >
          ←
        </button>
        <button
          type="button"
          className={styles.lightboxNext}
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Nächstes Bild"
        >
          →
        </button>
        {lightboxIndex !== null ? (
          <div className={styles.lightboxIndex}>
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(wallImages.length).padStart(2, '0')}
          </div>
        ) : null}
      </div>
    </>
  );
}
