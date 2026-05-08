import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { JBALogo } from '../JBALogo/JBALogo';

import styles from './PageTransition.module.css';

type Phase = 'idle' | 'covering' | 'uncovering';

const COVER_MS = 350;
const HOLD_MS = 80;
const UNCOVER_MS = 350;

/**
 * Page curtain — covers the screen on route change.
 *
 * Sequence:
 *   user clicks Link → React Router updates location → this effect fires
 *   covering (350ms) → hold (80ms) → uncovering (350ms) → idle
 *
 * The new route's content is already mounted underneath during the
 * covered moment, so the curtain reveals the new page when uncovering.
 *
 * The actual "page wipe" (`pageWipe` keyframes in the .module.css) is
 * also applied to each `<main>` via the global `.page-wipe` selector
 * — that gives the new content its own clip-path entrance after the
 * curtain has cleared.
 */
export function PageTransition() {
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const prev = useRef<string>(location.pathname);
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      prev.current = location.pathname;
      return;
    }
    if (prev.current === location.pathname) return;
    prev.current = location.pathname;

    setPhase('covering');
    const t1 = window.setTimeout(() => setPhase('uncovering'), COVER_MS + HOLD_MS);
    const t2 = window.setTimeout(() => setPhase('idle'), COVER_MS + HOLD_MS + UNCOVER_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [location.pathname]);

  if (phase === 'idle') return null;

  return (
    <div
      className={`${styles.curtain} ${phase === 'covering' ? styles.curtainCovering : ''} ${
        phase === 'uncovering' ? styles.curtainUncovering : ''
      }`}
      aria-hidden="true"
    >
      <div className={styles.center}>
        <div className={styles.centerInner}>
          <span className={styles.centerLogo}>
            <JBALogo size={48} ariaLabel="" />
          </span>
          <span className={styles.centerLabel}>JBA</span>
        </div>
      </div>
    </div>
  );
}

export const PAGE_WIPE_CLASS = styles.pageWipe;
