import { useEffect, useRef } from 'react';

import { HERO } from '@/data/manifest';

import styles from './Hero.module.css';

/**
 * HERO — final v4.
 *
 * The WebGL Doppelzwiebel-Lathe was pulled in favour of the actual
 * architectural section drawing (`/projekte/p48/p48-helm-pure.png` —
 * cropped from `p48-schnitt.jpg`). The drawing reads with the proper
 * red-on-white architectural convention (cut/section on the left side
 * of the helm, exterior outline on the right) — something a 3D mesh
 * could never communicate.
 *
 * Bundle impact: ~240 kB lazy chunk (three + drei + RGBELoader + R3F)
 * removed. The hero now ships zero JS for its visual.
 *
 * Felt-like: a printed architectural drawing pinned on a deep stage,
 * slowly drifting upward as the user scrolls (parallax).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle vertical parallax on the helm card — driven by scroll position
  // through the hero. Translates the card upward as user scrolls past,
  // giving a "rising" feel without changing the card's content.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const card = cardRef.current;
      if (!card) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress 0..1 across the hero
      const scrolled = -rect.top;
      const total = rect.height - vh;
      const p = total <= 0 ? 0 : Math.max(0, Math.min(1, scrolled / total));
      const offset = p * 90; // px, gentle
      card.style.transform = `translateY(${(-offset).toFixed(1)}px)`;
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
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className={`${styles.hero} surface-deep`}
      aria-labelledby="hero-heading"
    >
      <figure className={styles.helmStage} aria-hidden="false">
        <span className={styles.helmCornerTL} aria-hidden="true" />
        <span className={styles.helmCornerTR} aria-hidden="true" />
        <span className={styles.helmCornerBL} aria-hidden="true" />
        <span className={styles.helmCornerBR} aria-hidden="true" />
        <div className={styles.helmCard} ref={cardRef}>
          <picture className={styles.helmImage}>
            <source srcSet="/projekte/p48/p48-helm-pure.avif" type="image/avif" />
            <source srcSet="/projekte/p48/p48-helm-pure.webp" type="image/webp" />
            <img
              src="/projekte/p48/p48-helm-pure.png"
              alt="Krachers Doppelzwiebel — Architekturzeichnung im Schnitt, JBA 2025"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>
        <figcaption className={styles.helmCaption}>
          <span className={styles.helmCaptionTitle}>
            Krachers Doppelzwiebel
          </span>
          <span className={styles.helmCaptionMeta}>
            Schnitt · 1890 / 2025 · JBA
          </span>
        </figcaption>
      </figure>

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

// Keep the lazy-loaded HeroScene file in src/three/ for now — it's
// no longer wired but the code is preserved as a reference. Tree-shaking
// won't include it because nothing imports it anymore.

// Used to live here:
//   const HeroScene = lazy(() => import('@/three/HeroScene')...);
// + WebGL detection state + cameraProgress hook + DiveCamera composition.
