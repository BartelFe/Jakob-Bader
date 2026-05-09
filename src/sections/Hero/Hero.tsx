import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import { HERO } from '@/data/manifest';
import { hasWebGL, prefersReducedMotion } from '@/lib/webgl';

import styles from './Hero.module.css';

// Lazy-load the R3F scene so three.js + r3f stay out of the initial chunk.
const HeroScene = lazy(() =>
  import('@/three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

/**
 * HERO — v5: WebGL helm + supporting context (gables + roof).
 *
 * The 3D approach was the right *feel* — Felix wanted that — but v3 had
 * the helm floating in dark space with off proportions. v5:
 *   - Profile re-traced from the actual section drawing (better
 *     proportions: fatter lower bulb, taller pedestal, longer spire)
 *   - Adds supporting context: small slate cap + roof slab + two
 *     cream-plaster gable peaks. The helm now stands on something.
 *   - Camera framing widened to show the whole composition; dive at end
 *     of scroll keeps the cinematic gesture.
 *
 * Fallback (no-WebGL or reduced-motion): the actual architectural
 * section drawing from /projekte/p48/p48-helm-pure.* — way prettier
 * than the previous SVG-from-profile fallback.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [diveProgress, setDiveProgress] = useState(0);
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ok = hasWebGL() && !prefersReducedMotion();
    setCanRender3D(ok);
    const mq = window.matchMedia('(max-width: 880px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (canRender3D === false) return;
    const el = sectionRef.current;
    if (!el) return;

    let lastQuantized = -1;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / (vh * 0.8)));
      const quantized = Math.round(p * 64) / 64;
      if (quantized !== lastQuantized) {
        lastQuantized = quantized;
        setDiveProgress(quantized);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [canRender3D]);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className={`${styles.hero} surface-deep`}
      aria-labelledby="hero-heading"
    >
      <div className={styles.canvas}>
        <div className={styles.canvasInner}>
          {canRender3D === true ? (
            <Suspense fallback={<FallbackVisual />}>
              <HeroScene
                morph={1}
                cameraProgress={diveProgress}
                edgesOpacity={0.18}
                isMobile={isMobile}
              />
            </Suspense>
          ) : (
            <FallbackVisual />
          )}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{HERO.eyebrow}</p>
        <h1 id="hero-heading" className={styles.headline}>
          {HERO.headlineLeft}
          <br />
          <em className={styles.headlineEm}>{HERO.headlineRight}</em>
        </h1>
        <p className={styles.sub}>{HERO.sub}</p>
        <blockquote className={styles.quote}>
          „{HERO.quote}"<span className={styles.quoteCite}>— {HERO.quoteAttrib}</span>
        </blockquote>
      </div>

      <span className={styles.scroll} aria-hidden="true">
        Scroll ↓
      </span>
    </section>
  );
}

/**
 * Fallback for no-WebGL / reduced-motion: render the actual
 * architectural drawing as the helm visual. Way prettier than an
 * SVG approximation, and uses the AVIF the pipeline already generates.
 */
function FallbackVisual() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(20px, 3vw, 40px)',
      }}
    >
      <picture
        style={{
          display: 'block',
          maxHeight: '90%',
          maxWidth: '100%',
          background: 'var(--bg-paper)',
          padding: 'clamp(20px, 3vw, 40px)',
          boxShadow: '0 16px 40px -16px rgba(0,0,0,0.5)',
        }}
      >
        <source srcSet="/projekte/p48/p48-helm-pure.avif" type="image/avif" />
        <source srcSet="/projekte/p48/p48-helm-pure.webp" type="image/webp" />
        <img
          src="/projekte/p48/p48-helm-pure.png"
          alt="Doppelzwiebel — Architektur-Schnitt JBA 2025"
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
          }}
        />
      </picture>
    </div>
  );
}
