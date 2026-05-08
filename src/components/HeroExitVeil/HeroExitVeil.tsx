import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './HeroExitVeil.module.css';

const FADE_RANGE_VH = 0.35; // veil window: ±35% of viewport height around hero.bottom = 0
const PEAK_OPACITY = 0.62; // max veil opacity — Diagnose still readable underneath
const CORE_THRESHOLD = 0.5; // terracotta core appears once main opacity > 0.5

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
        // Triangle wave clamped to PEAK_OPACITY so the section beneath
        // (Diagnose) stays readable through the veil.
        const t = 1 - absDist / range;
        opacity = Math.pow(t, 0.85) * PEAK_OPACITY;
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
