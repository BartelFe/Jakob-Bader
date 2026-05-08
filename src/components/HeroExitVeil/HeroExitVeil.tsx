import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './HeroExitVeil.module.css';

const FADE_RANGE_VH = 0.45; // veil window: ±45% of viewport height around hero.bottom = 0
const CORE_THRESHOLD = 0.7; // terracotta core appears once main opacity > 0.7

/**
 * Triangle-wave veil that flashes at the moment the hero finishes
 * scrolling out — perceptual punctuation between the doppelzwiebel
 * dive and the "82" reveal.
 *
 * Only mounts on the landing page (where the hero exists). Reads the
 * hero section by id="hero-section" — set in Hero.tsx.
 *
 * Updates opacity imperatively in a rAF loop instead of via React state
 * to avoid re-rendering the rest of the layout on every scroll tick.
 */
export function HeroExitVeil() {
  const location = useLocation();
  const veilRef = useRef<HTMLDivElement>(null);

  // Only on landing
  const isLanding = location.pathname === '/';

  useEffect(() => {
    if (!isLanding) return;
    if (typeof window === 'undefined') return;

    let raf = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const veil = veilRef.current;
      if (!veil) return;

      const hero = document.getElementById('hero-section');
      if (!hero) {
        veil.style.opacity = '0';
        return;
      }

      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = vh * FADE_RANGE_VH;

      // Distance of hero.bottom from viewport top (where it crosses out)
      const dist = rect.bottom; // positive when hero still visible, 0 when bottom-exit, negative when past
      const absDist = Math.abs(dist);

      let opacity = 0;
      if (absDist < range) {
        // Triangle wave: peak at dist=0, linear falloff
        const t = 1 - absDist / range;
        // Soften the curve a touch with a power so peak feels punchier
        opacity = Math.pow(t, 0.85);
      }

      veil.style.opacity = opacity.toFixed(3);
      veil.style.setProperty(
        '--core-opacity',
        opacity > CORE_THRESHOLD ? ((opacity - CORE_THRESHOLD) / (1 - CORE_THRESHOLD)).toFixed(3) : '0',
      );
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isLanding]);

  if (!isLanding) return null;
  return <div ref={veilRef} className={styles.veil} aria-hidden="true" />;
}
