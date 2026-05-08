import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { DIAGNOSE } from '@/data/manifest';
import styles from './Diagnose.module.css';

export function Diagnose() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enterP, setEnterP] = useState(1);

  // Drive the "82" entrance from the section's rect.top.
  // 0 when section top is at viewport bottom (just entering).
  // 1 when section top has reached 30% from viewport top (settled).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    let raf = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Map rect.top from vh (just entering) → vh*0.3 (settled) to enterP 0..1
      const settledAt = vh * 0.3;
      const start = vh;
      const p =
        rect.top >= start
          ? 0
          : rect.top <= settledAt
            ? 1
            : 1 - (rect.top - settledAt) / (start - settledAt);
      setEnterP(p);
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

  const enterStyle: CSSProperties = {
    ['--enter-p' as keyof CSSProperties]: enterP.toFixed(3),
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.diagnose} surface-deep`}
      id="diagnose"
      aria-labelledby="diagnose-heading"
      style={enterStyle}
    >
      <div className={styles.grid}>
        <div className="reveal">
          <p className={styles.eyebrow}>{DIAGNOSE.eyebrow}</p>
          <span className={styles.number} aria-hidden="true">
            {DIAGNOSE.number}
          </span>
          <span className={styles.numberUnit}>{DIAGNOSE.numberUnit}</span>
        </div>
        <div className="reveal">
          <h2 id="diagnose-heading" className={styles.text}>
            Die wenigsten wissen, was ein Architekt{' '}
            <em className={styles.textEm}>wirklich</em> tut.
          </h2>
          <p className={styles.coda}>{DIAGNOSE.coda}</p>
        </div>
      </div>
    </section>
  );
}
