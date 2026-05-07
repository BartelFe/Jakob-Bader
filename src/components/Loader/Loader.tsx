import { useEffect, useMemo, useState } from 'react';

import { useLoader, type LoaderPhase } from '@/store/loader';
import { profileToSvgPath } from '@/three/profile';
import { prefersReducedMotion } from '@/lib/webgl';

import styles from './Loader.module.css';

const SCHEDULE: { phase: LoaderPhase; afterMs: number }[] = [
  { phase: 'svg-draw', afterMs: 0 },
  { phase: 'sweep', afterMs: 600 },
  { phase: 'reveal', afterMs: 1200 },
  { phase: 'fade-out', afterMs: 1800 },
  { phase: 'done', afterMs: 2400 },
];

const SKIP_AVAILABLE_AT = 600;

/**
 * Pre-Hero loader.
 *
 * Three visible phases over 1.8s, then 0.6s fade-out:
 *   1. svg-draw — profile path strokes in (vector, looks like a blueprint)
 *   2. sweep    — perspective Y-rotation suggests the lathe building volume
 *   3. reveal   — gold edges fade in (the "completion")
 *
 * Skippable after 0.6s. Won't show again in the same session.
 * Reduced-motion: collapses to instant render → 200ms fade-out.
 */
export function Loader() {
  const { shouldShow, phase, setPhase, markDone } = useLoader();
  const [skipVisible, setSkipVisible] = useState(false);
  const [progressFull, setProgressFull] = useState(false);

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const fillPath = useMemo(() => profileToSvgPath('doppelzwiebel', 220, 280), []);
  const linePath = fillPath; // same silhouette, drawn as line in phase 1

  useEffect(() => {
    if (!shouldShow) return;

    if (reducedMotion) {
      // Honor preferences: skip the choreography, fade out fast.
      setPhase('fade-out');
      const t = window.setTimeout(() => markDone(), 200);
      return () => window.clearTimeout(t);
    }

    const timers: number[] = [];
    SCHEDULE.forEach(({ phase: p, afterMs }) => {
      timers.push(
        window.setTimeout(() => {
          if (p === 'done') markDone();
          else setPhase(p);
        }, afterMs),
      );
    });
    timers.push(window.setTimeout(() => setSkipVisible(true), SKIP_AVAILABLE_AT));
    // Trigger progress bar transition shortly after mount
    timers.push(window.setTimeout(() => setProgressFull(true), 30));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [shouldShow, reducedMotion, setPhase, markDone]);

  // Lock body scroll while loader is visible.
  useEffect(() => {
    if (!shouldShow) return;
    if (phase === 'done') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldShow, phase]);

  if (!shouldShow || phase === 'done') return null;

  const isFading = phase === 'fade-out';
  const showSweep = phase === 'sweep' || phase === 'reveal' || phase === 'fade-out';
  const showEdges = phase === 'reveal' || phase === 'fade-out';

  return (
    <div
      className={`${styles.overlay} ${isFading ? styles.overlayFading : ''}`}
      aria-hidden={isFading}
      data-phase={phase}
    >
      <div className={styles.center}>
        <div className={styles.svgWrap}>
          <div className={`${styles.svgInner} ${showSweep ? styles.svgInnerSweep : ''}`}>
            <svg
              className={styles.svg}
              viewBox="0 0 220 280"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Phase 1: stroked profile draws in */}
              <path className={styles.pathDraw} d={linePath} />
              {/* Phase 3: warm-gold filled silhouette as the "completed" object */}
              <path
                className={`${styles.edges} ${showEdges ? styles.edgesVisible : ''}`}
                d={fillPath}
              />
            </svg>
          </div>
        </div>

        <div
          className={`${styles.caption} ${phase !== 'idle' && phase !== 'svg-draw' ? styles.captionVisible : ''}`}
        >
          Krachers Doppelzwiebel
          <span className={styles.captionEm}>1890 → 1924 → 2025</span>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <div className={`${styles.progressBar} ${progressFull ? styles.progressBarFull : ''}`} />
        </div>
      </div>

      <button
        type="button"
        className={`${styles.skip} ${skipVisible ? styles.skipVisible : ''}`}
        onClick={markDone}
        aria-label="Loader überspringen"
      >
        Überspringen →
      </button>
    </div>
  );
}
