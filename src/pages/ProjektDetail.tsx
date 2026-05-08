import { Suspense, lazy, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PROJEKTE, PROJEKTE_BY_SLUG, type Projekt, type ProjektSlug } from '@/data/projekte';

import { NotFound } from './NotFound';
import { AKPL22Showcase } from './treatments/AKPL22Showcase';
import { HausWShowcase } from './treatments/HausWShowcase';
import { LuPoShowcase } from './treatments/LuPoShowcase';
import { T61Showcase } from './treatments/T61Showcase';
import { VS15Showcase } from './treatments/VS15Showcase';

import styles from './ProjektDetail.module.css';

// Heavy + 3D — only load when route is /werk/p48
const P48Detail = lazy(() =>
  import('./treatments/P48Detail').then((m) => ({ default: m.P48Detail })),
);

const SHOWCASES: Partial<Record<ProjektSlug, (props: { projekt: Projekt }) => JSX.Element>> = {
  akpl22: AKPL22Showcase,
  lupo: LuPoShowcase,
  hausw: HausWShowcase,
  t61: T61Showcase,
  vs15: VS15Showcase,
};

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

  if (!projekt) return <NotFound />;

  // P48 gets a fully custom page (sticky 3D stage, milestone scrolling)
  if (projekt.slug === 'p48') {
    return (
      <Suspense fallback={null}>
        <P48Detail projekt={projekt} />
      </Suspense>
    );
  }

  return <StandardProjektDetail projekt={projekt} />;
}

/**
 * Shared layout for all projects except P48: header → hero image → body
 * + prize → treatment-specific showcase → related.
 */
function StandardProjektDetail({ projekt }: { projekt: Projekt }) {
  const related = PROJEKTE.filter((p) => p.slug !== projekt.slug).slice(0, 3);
  const Showcase = SHOWCASES[projekt.slug];

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
        <picture>
          <source srcSet={projekt.hero.replace(/\.jpe?g$/i, '.webp')} type="image/webp" />
          <img src={projekt.hero} alt={`${projekt.code} — ${projekt.short}`} loading="eager" fetchPriority="high" />
        </picture>
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

      {Showcase ? <Showcase projekt={projekt} /> : <DefaultGallery projekt={projekt} />}

      <div className={styles.related}>
        <p className={styles.relatedTitle}>Weitere Bauten</p>
        <div className={styles.relatedGrid}>
          {related.map((p) => (
            <Link key={p.slug} to={`/werk/${p.slug}`} className={styles.relatedCard}>
              <div className={styles.relatedCardImg}>
                <picture>
                  <source srcSet={p.hero.replace(/\.jpe?g$/i, '.webp')} type="image/webp" />
                  <img src={p.hero} alt={p.short} loading="lazy" />
                </picture>
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

const GALLERY_LAYOUT = ['gallerySpan8', 'gallerySpan4', 'gallerySpan6', 'gallerySpan6', 'gallerySpan12', 'gallerySpan8', 'gallerySpan4', 'gallerySpan12'] as const;

/** Fallback gallery for projects without a treatment-specific showcase. */
function DefaultGallery({ projekt }: { projekt: Projekt }) {
  if (projekt.images.length === 0 && !projekt.plans?.length) return null;
  return (
    <div className={styles.gallery}>
      {projekt.images.map((src, i) => {
        const layoutKey = GALLERY_LAYOUT[i % GALLERY_LAYOUT.length] ?? 'gallerySpan6';
        return (
          <figure key={src} className={`${styles.galleryItem} ${styles[layoutKey]}`}>
            <picture>
              <source srcSet={src.replace(/\.jpe?g$/i, '.webp')} type="image/webp" />
              <img src={src} alt={`${projekt.code} — Bild ${i + 2}`} loading="lazy" />
            </picture>
          </figure>
        );
      })}
      {projekt.plans?.map((src) => (
        <figure key={src} className={`${styles.galleryItem} ${styles.gallerySpan6}`}>
          <picture>
            <source srcSet={src.replace(/\.jpe?g$/i, '.webp')} type="image/webp" />
            <img src={src} alt={`${projekt.code} — Planzeichnung`} loading="lazy" />
          </picture>
        </figure>
      ))}
    </div>
  );
}
