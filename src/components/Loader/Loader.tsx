import { useEffect, useMemo, useState } from 'react';

import { useLoader, type LoaderPhase } from '@/store/loader';
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
// `?v=` cache-buster: Vercel serves /preroll-doppelzwiebel.png with
// Cache-Control: max-age=31536000, immutable. Bumping this version
// forces browsers to refetch when we swap the underlying PNG.
const PREROLL_IMG = '/preroll-doppelzwiebel.png?v=2';

/**
 * Pre-Hero loader.
 *
 * Three visible phases over 1.8s, then 0.6s fade-out:
 *   1. svg-draw — wireframe-helm image fades in (the blueprint)
 *   2. sweep    — perspective Y-rotation suggests the lathe building volume
 *   3. reveal   — image holds at full intensity, caption appears
 *
 * Skippable after 0.6s. Won't show again in the same session.
 * Reduced-motion: collapses to instant render → 200ms fade-out.
 *
 * The PNG has a transparent background with dark wireframe lines; CSS
 * `filter: invert(1)` flips them to white so they read on --bg-deep.
 */
export function Loader() {
  const { shouldShow, phase, setPhase, markDone } = useLoader();
  const [skipVisible, setSkipVisible] = useState(false);
  const [progressFull, setProgressFull] = useState(false);

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

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
  const imgVisible = phase !== 'idle';

  return (
    <div
      className={`${styles.overlay} ${isFading ? styles.overlayFading : ''}`}
      aria-hidden={isFading}
      data-phase={phase}
    >
      <div className={styles.center}>
        <div className={styles.svgWrap}>
          <div className={`${styles.svgInner} ${showSweep ? styles.svgInnerSweep : ''}`}>
            <img
              src={PREROLL_IMG}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={`${styles.img} ${imgVisible ? styles.imgVisible : ''}`}
            />
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
