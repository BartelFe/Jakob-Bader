import { HERO } from '@/data/manifest';
import styles from './Hero.module.css';

/**
 * HERO — Phase 1 scaffold.
 *
 * Phase 2 replaces .canvas with the R3F Doppelzwiebel (lathe geometry,
 * scroll-driven cone → onion → double-onion morph). Headline + sub +
 * quote layout already match brief §7.1.
 */
export function Hero() {
  return (
    <section className={`${styles.hero} surface-deep`} aria-labelledby="hero-heading">
      <div className={styles.canvas} aria-hidden="true" />
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
        Scroll
      </span>
    </section>
  );
}
