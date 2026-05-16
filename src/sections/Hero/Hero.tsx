import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import { HERO } from '@/data/manifest';
import { prefersReducedMotion } from '@/lib/webgl';

import styles from './Hero.module.css';

// Lazy-load so gsap + the canvas particle field stay out of the initial chunk.
const HeroImageScene = lazy(() =>
  import('@/three/HeroImageScene').then((m) => ({ default: m.HeroImageScene })),
);

/**
 * HERO — v4 image-driven atmospheric composition.
 *
 * The WebGL helm hit a fidelity wall; a GPT-Image-generated PNG of the
 * helm reads dramatically closer to the reference building. Landing
 * hero now embeds that PNG in a layered DOM/Canvas scene (vignette,
 * cloud, glints, reflection, mouse-glow, particles). The 3D helm still
 * lives in HeroScene.tsx and is reused on /werk/p48 where rotation
 * actually adds value.
 *
 * Fallback (reduced-motion): the architectural section drawing from
 * /projekte/p48/p48-helm-pure.*
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [diveProgress, setDiveProgress] = useState(0);
  const [canRenderScene, setCanRenderScene] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // The new image hero is DOM/Canvas only — no WebGL gate. We still
    // fall back to the static drawing when reduced-motion is requested.
    setCanRenderScene(!prefersReducedMotion());
    const mq = window.matchMedia('(max-width: 880px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (canRenderScene === false) return;
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
  }, [canRenderScene]);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className={`${styles.hero} surface-deep`}
      aria-labelledby="hero-heading"
    >
      <div className={styles.canvas}>
        <div className={styles.canvasInner}>
          {canRenderScene === true ? (
            <Suspense fallback={<FallbackVisual />}>
              <HeroImageScene
                cameraProgress={diveProgress}
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
