import { Link } from 'react-router-dom';
import { HERO_PROJEKT, PROJEKTE } from '@/data/projekte';
import styles from './Werk.module.css';

const CARD_LAYOUT = [
  { spanClass: 'span7', imgClass: 'imgWide' },
  { spanClass: 'span5', imgClass: 'imgTall' },
  { spanClass: 'offset1', imgClass: 'imgWide' },
  { spanClass: 'span4', imgClass: 'imgTall' },
  { spanClass: 'span5', imgClass: 'imgSquare' },
] as const;

export function Werk() {
  const heroPart = HERO_PROJEKT;
  const otherProjects = PROJEKTE.filter((p) => p.slug !== 'p48');

  return (
    <section className={styles.werk} id="werk" aria-labelledby="werk-heading">
      <div className={styles.intro}>
        <div className="reveal">
          <p className={styles.eyebrow}>Werk · 02</p>
          <h2 id="werk-heading" className={styles.title}>
            Sechs Bauten,
            <br />
            <em className={styles.titleEm}>sechs Haltungen.</em>
          </h2>
        </div>
        <p className={`${styles.blurb} reveal`}>
          Jedes Bauwerk ist ein Prototyp — einzigartig in seiner Aufgabe, seinem Ort, seinem Maß.
          Eine Auswahl aus über zwei Jahrzehnten.
        </p>
      </div>

      <article className={`${styles.heroProject} reveal`}>
        <Link to={`/werk/${heroPart.slug}`} className={styles.heroProjectImg}>
          <img
            src={heroPart.hero}
            alt="P48 Doppelzwiebel — Wohnhaus am Wiesnviertel, ausgezeichnet mit dem Fassadenpreis München 2025"
            loading="eager"
            decoding="async"
          />
        </Link>
        <div>
          <div className={styles.projectMeta}>
            <span>
              {heroPart.code} · {heroPart.years}
            </span>
            <span>{heroPart.location}</span>
            <span>{heroPart.tags[0]}</span>
          </div>
          <h3 className={styles.projectName}>
            {heroPart.nameSplit.lead}
            <br />
            <em className={styles.projectNameEm}>{heroPart.nameSplit.emphasis}</em>
          </h3>
          <p className={styles.projectDesc}>{heroPart.description}</p>
          {heroPart.prize ? (
            <a
              className={styles.prize}
              href={heroPart.prize.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroPart.prize.label} →
            </a>
          ) : null}
        </div>
      </article>

      <div className={styles.grid}>
        {otherProjects.map((p, i) => {
          const layout = CARD_LAYOUT[i % CARD_LAYOUT.length];
          if (!layout) return null;
          return (
            <Link
              key={p.slug}
              to={`/werk/${p.slug}`}
              className={`${styles.card} ${styles[layout.spanClass]} reveal`}
            >
              <div className={`${styles.cardImg} ${styles[layout.imgClass]}`}>
                <img src={p.hero} alt={`${p.code} — ${p.short}`} loading="lazy" decoding="async" />
              </div>
              <div className={styles.cardMeta}>
                {p.code} · {p.years} · {p.location}
              </div>
              <h3 className={styles.cardName}>
                {p.nameSplit.lead} <em className={styles.cardNameEm}>{p.nameSplit.emphasis}</em>
              </h3>
              <p className={styles.cardDesc}>{p.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
