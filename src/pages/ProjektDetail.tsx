import { Suspense, lazy, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PROJEKTE, PROJEKTE_BY_SLUG, type Projekt, type ProjektSlug } from '@/data/projekte';
import { AKADEMIE_EVENTS } from '@/data/akademie';
import { ResponsiveImage } from '@/components/ResponsiveImage/ResponsiveImage';

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
        <ResponsiveImage
          src={projekt.hero}
          alt={`${projekt.code} — ${projekt.short}`}
          loading="eager"
          fetchPriority="high"
        />
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

      {/* Rich editorial: lede, chapters, lineage strip — only when data set */}
      {projekt.rich ? <RichEditorial projekt={projekt} /> : null}

      {Showcase ? <Showcase projekt={projekt} /> : <DefaultGallery projekt={projekt} />}

      {projekt.rich?.relatedAkademie?.length ? (
        <RelatedAkademie slugs={projekt.rich.relatedAkademie} />
      ) : null}

      <div className={styles.related}>
        <p className={styles.relatedTitle}>Weitere Bauten</p>
        <div className={styles.relatedGrid}>
          {related.map((p) => (
            <Link key={p.slug} to={`/werk/${p.slug}`} className={styles.relatedCard}>
              <div className={styles.relatedCardImg}>
                <ResponsiveImage src={p.hero} alt={p.short} loading="lazy" />
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

/** Rich editorial extension — lede + chapters + lineage strip. Only
 *  rendered when `projekt.rich` is set. The chapters use sticky-on-desktop
 *  headings (eyebrow + title) with body text on the right; the lineage
 *  strip shows architectural references + material notes between chapters
 *  and the gallery. */
function RichEditorial({ projekt }: { projekt: Projekt }) {
  const rich = projekt.rich!;
  return (
    <>
      <p className={styles.lede}>{rich.lede}</p>

      <div className={styles.chapters}>
        {rich.chapters.map((c, i) => (
          <article key={i} className={styles.chapter}>
            <header className={styles.chapterHead}>
              <span className={styles.chapterEyebrow}>{c.eyebrow}</span>
              <h2 className={styles.chapterTitle}>{c.title}</h2>
            </header>
            <div className={styles.chapterBody}>
              <p>{c.body}</p>
              {c.pullQuote ? (
                <p className={styles.chapterPullQuote}>{c.pullQuote}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {rich.lineage?.length || rich.materialNotes?.length ? (
        <section className={styles.lineageStrip}>
          {rich.lineage?.length ? (
            <div>
              <p className={styles.lineageStripLabel}>Geistige Familie</p>
              <ul className={styles.lineageList}>
                {rich.lineage.map((name) => (
                  <li key={name} className={styles.lineageItem}>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div />
          )}
          {rich.materialNotes?.length ? (
            <div>
              <p className={styles.lineageStripLabel}>Material · Detail</p>
              <ol className={styles.materialList}>
                {rich.materialNotes.map((note) => (
                  <li key={note} className={styles.materialItem}>
                    {note}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}

/** Cross-link cards to related Akademie events. */
function RelatedAkademie({ slugs }: { slugs: string[] }) {
  const events = slugs
    .map((s) => AKADEMIE_EVENTS.find((e) => e.slug === s))
    .filter((e): e is (typeof AKADEMIE_EVENTS)[number] => !!e);
  if (events.length === 0) return null;
  return (
    <section className={styles.akademieLinks}>
      <p className={styles.akademieLinksLabel}>Verwandte Akademie-Vorträge</p>
      {events.map((e) => (
        <Link
          key={e.slug}
          to={`/akademie/${e.slug}`}
          className={styles.akademieLinkCard}
        >
          <span className={styles.akademieLinkDate}>{e.dateLabel}</span>
          <span className={styles.akademieLinkTitle}>{e.title}</span>
          <span className={styles.akademieLinkArrow}>Werkbericht →</span>
        </Link>
      ))}
    </section>
  );
}

/** Fallback gallery for projects without a treatment-specific showcase. */
function DefaultGallery({ projekt }: { projekt: Projekt }) {
  if (projekt.images.length === 0 && !projekt.plans?.length) return null;
  return (
    <div className={styles.gallery}>
      {projekt.images.map((src, i) => {
        const layoutKey = GALLERY_LAYOUT[i % GALLERY_LAYOUT.length] ?? 'gallerySpan6';
        return (
          <figure key={src} className={`${styles.galleryItem} ${styles[layoutKey]}`}>
            <ResponsiveImage src={src} alt={`${projekt.code} — Bild ${i + 2}`} loading="lazy" />
          </figure>
        );
      })}
      {projekt.plans?.map((src) => (
        <figure key={src} className={`${styles.galleryItem} ${styles.gallerySpan6}`}>
          <ResponsiveImage src={src} alt={`${projekt.code} — Planzeichnung`} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}
