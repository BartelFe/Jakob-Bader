import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import { HERO } from '@/data/manifest';
import { hasWebGL, prefersReducedMotion } from '@/lib/webgl';
import { StaticDoppelzwiebel } from '@/three/StaticDoppelzwiebel';

import styles from './Hero.module.css';

// Lazy-load the R3F scene so three.js + r3f stay out of the initial chunk
// for users who never reach the hero (accessibility tools, no-WebGL, etc.).
const HeroScene = lazy(() =>
  import('@/three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

/**
 * HERO — left content column, right 3D canvas.
 *
 * v3 (post-feedback): the cone → onion → doppelzwiebel scroll-morph was
 * pulled — Felix found the in-progress vertex blending visually noisy
 * ("gequirtels"). The hero now shows the FULL doppelzwiebel statically
 * with its idle Y-rotation + cursor-reactive group, plus the existing
 * scroll-tied camera dive that brings the camera close to the cross at
 * the end of the hero scroll. No state labels needed since there's no
 * historical narrative being told via geometry change.
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

  // Scroll choreography: now drives ONLY the camera dive, not the morph.
  // diveProgress 0..1 across the sticky 180vh hero.
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
              <HeroScene morph={1} cameraProgress={diveProgress} edgesOpacity={0.18} isMobile={isMobile} />
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

function FallbackVisual() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <StaticDoppelzwiebel
        width={260}
        height={340}
        fill="rgba(42, 40, 38, 0.92)"
        stroke="#c9b896"
        strokeWidth={1.2}
        ariaLabel="Doppelzwiebel — statische Darstellung"
      />
    </div>
  );
}
