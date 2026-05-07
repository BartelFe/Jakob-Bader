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

const STATE_LABELS = [
  { label: 'Verloren', threshold: 0 },
  { label: 'Reduziert', threshold: 0.5 },
  { label: 'Wiederhergestellt', threshold: 1 },
];

/**
 * HERO — left content column, right 3D canvas.
 *
 * Scroll-driven morph: as the user scrolls through the hero section,
 * the doppelzwiebel transforms from cone → onion → full doppelzwiebel.
 * Brief §7.1: "Cone (0% scroll) → einfache Zwiebel (33%) → volle
 * Doppelzwiebel (66%) → 3D dreht weg, Hero verlässt Viewport (100%)".
 *
 * The active state-label highlights as morph passes its threshold.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [morph, setMorph] = useState(1);
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect WebGL + reduced-motion + viewport once on mount.
  useEffect(() => {
    const ok = hasWebGL() && !prefersReducedMotion();
    setCanRender3D(ok);
    const mq = window.matchMedia('(max-width: 880px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll choreography: map hero's scroll progress to morph 0..1.
  // 0 when hero top hits viewport top; 1 when hero bottom leaves bottom of viewport.
  useEffect(() => {
    if (canRender3D === false) return;
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      // Initial state: doppelzwiebel (1). Reverse so scroll DOWN takes us back to 0.
      // Per brief: 0% scroll = cone, 100% = doppelzwiebel away.
      // We map: scrolled-into-view start → cone (0), 50% past → doppelzwiebel (1).
      const morphP = Math.max(0, Math.min(1, p * 2));
      setMorph(morphP);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [canRender3D]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} surface-deep`}
      aria-labelledby="hero-heading"
    >
      <div className={styles.canvas}>
        <div className={styles.canvasInner}>
          {canRender3D === true ? (
            <Suspense
              fallback={
                <FallbackVisual />
              }
            >
              <HeroScene morph={morph} edgesOpacity={0.18} isMobile={isMobile} />
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

      <div className={styles.stateLabels} aria-hidden="true">
        {STATE_LABELS.map((s, i) => {
          const active =
            morph >= s.threshold &&
            (i === STATE_LABELS.length - 1 || morph < (STATE_LABELS[i + 1]?.threshold ?? 1));
          return (
            <span key={s.label} style={{ display: 'inline-flex', gap: '24px' }}>
              <span
                className={`${styles.stateLabel} ${active ? styles.stateLabelActive : ''}`}
              >
                {s.label}
              </span>
              {i < STATE_LABELS.length - 1 ? (
                <span className={styles.stateLabelDivider}>·</span>
              ) : null}
            </span>
          );
        })}
      </div>
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
