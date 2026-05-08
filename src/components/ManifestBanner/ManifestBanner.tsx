import { useEffect, useRef, useState, type CSSProperties } from 'react';

import styles from './ManifestBanner.module.css';

interface ManifestBannerProps {
  lead: string;
  bold: string;
  coda?: string;
}

/**
 * Full-bleed pinned manifest moment.
 *
 *   .section (160vh, deep + grain)
 *     └── .sticky (100vh, top:0, content centered)
 *           └── .text
 *                 ├── .lead    — soft paper, plain serif
 *                 ├── .bold    — full paper, serif italic 500, larger
 *                 └── .coda    — mono uppercase eyebrow
 *
 * Reveal sequence: lead first (base-delay 0), bold next (480ms), coda
 * last (1080ms). Inside each, characters stagger by 18ms via the
 * existing splitTextIntoChars + .reveal-split system.
 *
 * A 1-pixel terracotta progress line on the left grows as the user
 * scrolls through the section — gives a sense of pin duration.
 */
export function ManifestBanner({ lead, bold, coda }: ManifestBannerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top hits viewport top; 1 when section bottom hits viewport bottom
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const leadStyle: CSSProperties = { ['--base-delay' as keyof CSSProperties]: '0ms' };
  const boldStyle: CSSProperties = { ['--base-delay' as keyof CSSProperties]: '480ms' };
  const codaStyle: CSSProperties = { ['--base-delay' as keyof CSSProperties]: '1080ms' };

  // Progress line height — grows from 0 to 240px in middle 60% of pin
  const lineHeight = Math.max(0, Math.min(1, (progress - 0.2) / 0.6)) * 240;

  return (
    <section ref={sectionRef} className={styles.section} aria-hidden="false">
      <div
        className={styles.progressLine}
        style={{ height: `${lineHeight}px`, transform: `translateY(-${lineHeight / 2}px)` }}
        aria-hidden="true"
      />
      <div className={styles.sticky}>
        <p className={styles.text}>
          <span
            className={`${styles.lead} reveal reveal-split`}
            style={leadStyle}
          >
            {lead}
          </span>
          <span
            className={`${styles.bold} reveal reveal-split`}
            style={boldStyle}
          >
            {bold}
          </span>
          {coda ? (
            <span
              className={`${styles.coda} reveal reveal-split`}
              style={codaStyle}
            >
              {coda}
            </span>
          ) : null}
        </p>
      </div>
    </section>
  );
}
