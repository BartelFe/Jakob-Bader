import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { PROJEKTE, PROJEKTE_BY_SLUG, type ProjektSlug } from '@/data/projekte';
import { NotFound } from './NotFound';

import styles from './ProjektDetail.module.css';

const GALLERY_LAYOUT = ['gallerySpan8', 'gallerySpan4', 'gallerySpan6', 'gallerySpan6', 'gallerySpan12', 'gallerySpan8', 'gallerySpan4', 'gallerySpan12'] as const;

export function ProjektDetail() {
  const { slug } = useParams<{ slug: string }>();
  const projekt = slug ? PROJEKTE_BY_SLUG[slug as ProjektSlug] : undefined;

  useEffect(() => {
    if (projekt) {
      document.title = `${projekt.code} — ${projekt.name} · Jakob Bader Architektur`;
    }
    return () => {
      document.title = 'Jakob Bader Architektur — Mut zum Raum';
    };
  }, [projekt]);

  if (!projekt) {
    return <NotFound />;
  }

  const related = PROJEKTE.filter((p) => p.slug !== projekt.slug).slice(0, 3);

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link to="/#werk" className={styles.back}>
            ← Werk
          </Link>
          <div className={styles.meta}>
            <span>
              {projekt.code} · {projekt.years}
            </span>
            <span>{projekt.location}</span>
            {projekt.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className={styles.headline}>
            {projekt.nameSplit.lead}
            <br />
            <em className={styles.headlineEm}>{projekt.nameSplit.emphasis}</em>
          </h1>
        </div>
      </header>

      <div className={styles.heroImg}>
        <img src={projekt.hero} alt={`${projekt.code} — ${projekt.short}`} loading="eager" />
      </div>

      <section className={styles.body}>
        <p className={styles.bodyLabel}>Werkbericht · {projekt.code}</p>
        <div>
          <p className={styles.bodyText}>{projekt.description}</p>
          <div className={styles.tags}>
            {projekt.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {projekt.prize ? (
        <div className={styles.prizeRow}>
          <span className={styles.prizeLabel}>Ausgezeichnet —</span>
          <a
            className={styles.prizeLink}
            href={projekt.prize.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {projekt.prize.label} →
          </a>
        </div>
      ) : null}

      {projekt.images.length > 0 ? (
        <div className={styles.gallery}>
          {projekt.images.map((src, i) => {
            const layoutKey = GALLERY_LAYOUT[i % GALLERY_LAYOUT.length] ?? 'gallerySpan6';
            return (
              <figure key={src} className={`${styles.galleryItem} ${styles[layoutKey]}`}>
                <img src={src} alt={`${projekt.code} — Bild ${i + 2}`} loading="lazy" />
              </figure>
            );
          })}
          {projekt.plans?.map((src) => (
            <figure key={src} className={`${styles.galleryItem} ${styles.gallerySpan6}`}>
              <img src={src} alt={`${projekt.code} — Planzeichnung`} loading="lazy" />
            </figure>
          ))}
        </div>
      ) : null}

      <div className={styles.related}>
        <p className={styles.relatedTitle}>Weitere Bauten</p>
        <div className={styles.relatedGrid}>
          {related.map((p) => (
            <Link key={p.slug} to={`/werk/${p.slug}`} className={styles.relatedCard}>
              <div className={styles.relatedCardImg}>
                <img src={p.hero} alt={p.short} loading="lazy" />
              </div>
              <h3 className={styles.relatedCardName}>{p.name}</h3>
              <p className={styles.relatedCardMeta}>
                {p.code} · {p.location}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
