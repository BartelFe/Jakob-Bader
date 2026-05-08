import { useCallback, useEffect, useRef, useState } from 'react';

import type { Projekt } from '@/data/projekte';
import styles from './LuPoShowcase.module.css';

interface LuPoShowcaseProps {
  projekt: Projekt;
}

/**
 * LuPo — Stadtraum, weitergedacht.
 *
 * Treatment: before-after. Bestand (existing park, projekt.images[0])
 * vs. Vision (Bader pavilion render, projekt.images[1]).
 * Brief §7.3: "Before/After-Slider (Bestand vs. Vision-Render)".
 *
 * Drag/touch/keyboard accessible. Slider position 0..100 in percent.
 */
export function LuPoShowcase({ projekt }: LuPoShowcaseProps) {
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const before = projekt.hero;
  const after = projekt.images[0] ?? projekt.hero;
  const wider = projekt.images[1] ?? null;

  const updateFromX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const x = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      updateFromX(x);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [updateFromX]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    draggingRef.current = true;
    const x = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    updateFromX(x);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5));
    if (e.key === 'Home') setPosition(0);
    if (e.key === 'End') setPosition(100);
  };

  return (
    <>
      <section className={styles.intro}>
        <div>
          <p className={styles.label}>Vorher · Nachher · 04</p>
          <h2 className={styles.title}>
            Eine Achse, die <em className={styles.titleEm}>schon
            <br />
            immer da war</em>.
          </h2>
        </div>
        <p>
          Der Luitpoldpark ist ein gewachsener, in seiner Achse fragmentierter Stadtpark. Im
          Entwurf wird die historisch angelegte Pracht-Achse wieder freigelegt — ein
          zentrales Wasserbecken, ein leichter Stahlpavillon auf dem Schuttberg als
          Endpunkt der Blickachse.
        </p>
      </section>

      <section className={styles.slider}>
        <div
          ref={frameRef}
          className={styles.sliderFrame}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
        >
          <img src={before} alt="LuPo — Bestand des Luitpoldparks" className={styles.sliderImg} />
          <img
            src={after}
            alt="LuPo — Vision mit Pavillon und Wasserachse"
            className={`${styles.sliderImg} ${styles.sliderImgClipped}`}
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          />
          <div className={styles.sliderHandle} style={{ left: `${position}%` }}>
            <button
              type="button"
              className={styles.sliderHandleKnob}
              role="slider"
              aria-label="Vergleich Bestand und Vision"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              onKeyDown={onKeyDown}
            >
              ◀ ▶
            </button>
          </div>
        </div>
        <div className={styles.sliderLabels}>
          <span className={styles.sliderLabel}>
            <span className={`${styles.sliderLabelDot} ${styles.sliderLabelDotLeft}`} />
            Bestand · 2024
          </span>
          <span className={styles.sliderLabel}>
            <span className={`${styles.sliderLabelDot} ${styles.sliderLabelDotRight}`} />
            Vision · JBA
          </span>
        </div>
        <p className={styles.sliderInstruction}>Ziehen · ◀ ▶ Tastatur</p>
      </section>

      <section className={styles.vision}>
        <p className={styles.visionLine}>
          „Architektur als
          <br />
          <strong>gesellschaftlicher Beitrag</strong>."
        </p>
        <div className={styles.visionPoints}>
          <div className={styles.visionPoint}>
            <span className={styles.visionPointNumber}>I</span>
            <span className={styles.visionPointTitle}>Wasserbecken</span>
            <p className={styles.visionPointText}>
              Klare Geometrie auf der reaktivierten Pracht-Achse. Ein Spiegel für Stadt und
              Himmel, im Sommer ein Treffpunkt.
            </p>
          </div>
          <div className={styles.visionPoint}>
            <span className={styles.visionPointNumber}>II</span>
            <span className={styles.visionPointTitle}>Stahlpavillon</span>
            <p className={styles.visionPointText}>
              Leichte Konstruktion auf dem Schuttberg. Skelettartig, transparent — ein
              Belvédère statt eines Bauwerks.
            </p>
          </div>
          <div className={styles.visionPoint}>
            <span className={styles.visionPointNumber}>III</span>
            <span className={styles.visionPointTitle}>Achse</span>
            <p className={styles.visionPointText}>
              Vom Park-Eingang bis zum Pavillon eine geführte Sicht. Stadt im Maßstab des
              Spaziergängers, nicht des Autos.
            </p>
          </div>
        </div>
      </section>

      {wider ? (
        <figure
          style={{
            marginTop: 'clamp(80px, 10vh, 140px)',
            maxWidth: 'var(--max)',
            marginInline: 'auto',
            paddingInline: 'var(--gutter)',
            aspectRatio: '16/9',
            background: 'var(--bg-paper-warm)',
            overflow: 'hidden',
          }}
        >
          <img src={wider} alt="LuPo — weitere Visualisierung" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </figure>
      ) : null}
    </>
  );
}
