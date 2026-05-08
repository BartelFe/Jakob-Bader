import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import type { Projekt } from '@/data/projekte';
import { AKADEMIE_EVENTS } from '@/data/akademie';
import { hasWebGL, prefersReducedMotion } from '@/lib/webgl';
import { StaticDoppelzwiebel } from '@/three/StaticDoppelzwiebel';

import styles from './P48Detail.module.css';

const P48Scene = lazy(() => import('@/three/P48Scene').then((m) => ({ default: m.P48Scene })));

interface P48DetailProps {
  projekt: Projekt;
}

const TIMELINE = [
  {
    year: '1890',
    tag: 'Errichtung',
    title: 'Kracher zeichnet, München baut.',
    titleEm: 'baut.',
    text: 'Ludwig Kracher entwirft das Eckhaus am Wiesnviertel im Geist der Neorenaissance. Der Eckturm bekommt einen Helm: zwei gestapelte Zwiebeln, gekrönt mit Spire und Wetterfahne. Bauwerk und Stadtraum sind, wie damals üblich, dasselbe Bauteil.',
    progressCenter: 0.0,
    side: 'right' as const,
  },
  {
    year: '1924',
    tag: 'Sturm · Reduktion',
    title: 'Westwinde und ein Pragmatismus.',
    titleEm: 'Pragmatismus.',
    text: 'Ein Sturm wirft die obere Zwiebel. Die Stadt repariert nicht — sie reduziert. Über die Jahrzehnte verschwindet auch die untere Zwiebel zugunsten einer plumpen Kegelhaube. Das Bauwerk verliert seine Krone, der Block sein Gegenüber.',
    progressCenter: 0.45,
    side: 'left' as const,
  },
  {
    year: '2025',
    tag: 'Rekonstruktion · JBA',
    title: 'Zurück, mit ertüchtigtem Tragwerk.',
    titleEm: 'Tragwerk.',
    text: 'Bader rekonstruiert den Originalhelm. Das Tragwerk wird so ertüchtigt, dass es den Westwinden an dieser Stelle dauerhaft standhält. Im Dach: zwei großzügige Wohnungen mit Wohnhalle, Galerie, Turmstube und Sicht bis zur Frauenkirche.',
    progressCenter: 1.0,
    side: 'right' as const,
  },
];

const TIMELINE_LABELS = TIMELINE.map((m) => ({ year: m.year, threshold: m.progressCenter }));

/**
 * P48 — full custom layout.
 *
 * Sticky 3D stage on top, three milestone slabs scroll over it. Each
 * milestone advances the scene's progress 0..1 → plan → volume → helm →
 * hotspots. Below: prize banner, body text, Akademie cross-link to the
 * Doppelzwiebel-Baugeschichte talk, supporting gallery.
 */
export function P48Detail({ projekt }: P48DetailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);

  const akademieEvent = AKADEMIE_EVENTS.find((e) => e.related?.includes('p48'));

  useEffect(() => {
    document.title = `${projekt.code} — ${projekt.name} · Jakob Bader Architektur`;
    return () => {
      document.title = 'Jakob Bader Architektur — Mut zum Raum';
    };
  }, [projekt]);

  useEffect(() => {
    setCanRender3D(hasWebGL() && !prefersReducedMotion());
  }, []);

  // Scroll → progress 0..1 mapped over the track section's range.
  useEffect(() => {
    if (canRender3D === false) return;
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      // Progress 0 when track top hits viewport center, 1 when track bottom hits viewport center.
      const p = Math.max(0, Math.min(1, (vh - rect.top - vh * 0.3) / Math.max(1, total - vh * 0.3)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [canRender3D]);

  return (
    <article className={styles.page}>
      {/* INTRO — text-only header, full width, no sticky 3D yet */}
      <header className={styles.intro}>
        <div className={styles.introInner}>
          <Link to="/#werk" className={styles.back}>
            ← Werk
          </Link>
          <div className={styles.eyebrow}>
            <span>{projekt.code} · {projekt.years}</span>
            <span>{projekt.location}</span>
            <span>{projekt.tags.join(' · ')}</span>
          </div>
          <h1 className={styles.headline}>
            {projekt.nameSplit.lead}
            <br />
            <em className={styles.headlineEm}>{projekt.nameSplit.emphasis}</em>
          </h1>
          <p className={styles.short}>
            Eine Geschichte in drei Akten — Errichtung, Reduktion, Rückkehr. Scrollen Sie,
            das Bauwerk konstruiert sich selbst.
          </p>
        </div>
      </header>

      {/* TRACK — sticky 3D stage + three milestones layered above */}
      <div ref={trackRef} className={styles.track}>
        {canRender3D !== false ? (
          <div className={styles.stage}>
            <div className={styles.stageInner}>
              {canRender3D ? (
                <Suspense fallback={<StaticFallback />}>
                  <P48Scene progress={progress} />
                </Suspense>
              ) : (
                <StaticFallback />
              )}
              <div className={styles.stageVignette} />
            </div>
            <span className={styles.stageMeta}>
              P48 · Wiesnviertel · Plan → Volumen
            </span>
            <div className={styles.stageTimeline} aria-hidden="true">
              {TIMELINE_LABELS.map((m, i) => {
                const next = TIMELINE_LABELS[i + 1]?.threshold ?? 1.5;
                const active =
                  progress >= m.threshold - 0.18 && progress < next - 0.18;
                return (
                  <span
                    key={m.year}
                    className={`${styles.timelinePoint} ${active ? styles.timelinePointActive : ''}`}
                  >
                    <span className={styles.timelineDot} />
                    {m.year}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <StaticFallbackBlock />
        )}

        {TIMELINE.map((m) => (
          <section
            key={m.year}
            className={styles.milestone}
            aria-labelledby={`milestone-${m.year}`}
          >
            <div
              className={`${styles.milestoneInner} ${
                m.side === 'left' ? styles.milestoneInnerLeft : styles.milestoneInnerRight
              }`}
            >
              <div className={styles.milestoneText}>
                <span className={styles.milestoneTag}>{m.tag}</span>
                <span className={styles.milestoneYear}>{m.year}</span>
                <h2 id={`milestone-${m.year}`} className={styles.milestoneTitle}>
                  {m.title.replace(m.titleEm, '')}
                  <em className={styles.milestoneTitleEm}>{m.titleEm}</em>
                </h2>
                <p>{m.text}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* PRIZE */}
      {projekt.prize ? (
        <section className={styles.prize}>
          <div className={styles.prizeInner}>
            <span className={styles.prizeLabel}>Auszeichnung</span>
            <h2 className={styles.prizeName}>
              {projekt.prize.label.split(' ').slice(0, -1).join(' ')}{' '}
              <em className={styles.prizeNameEm}>
                {projekt.prize.label.split(' ').slice(-1).join(' ')}
              </em>
            </h2>
            <a
              href={projekt.prize.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.prizeLink}
            >
              Broschüre der Stadt München →
            </a>
          </div>
        </section>
      ) : null}

      {/* BODY */}
      <section className={styles.body}>
        <div className={styles.bodyInner}>
          <p className={styles.bodyLabel}>Werkbericht</p>
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
        </div>
      </section>

      {/* AKADEMIE cross-link */}
      {akademieEvent ? (
        <section className={styles.akademie}>
          <Link to={`/akademie/${akademieEvent.slug}`} className={styles.akademieCard}>
            <div>
              <p className={styles.akademieEyebrow}>Akademie · Werkbericht</p>
              <h2 className={styles.akademieTitle}>
                Die <em className={styles.akademieTitleEm}>Doppelzwiebel</em> —
                <br />
                eine Baugeschichte.
              </h2>
              <p className={styles.akademieMeta}>
                {akademieEvent.dateLabel} · {akademieEvent.speaker} · {akademieEvent.venue}
              </p>
            </div>
            <span className={styles.akademieCta}>
              Vortrag im Archiv ansehen →
            </span>
          </Link>
        </section>
      ) : null}

      {/* GALLERY */}
      {projekt.images.length > 0 ? (
        <section className={styles.gallery}>
          <div className={styles.galleryInner}>
            {projekt.images.map((src, i) => {
              const layout = (['span12', 'span8', 'span4', 'span6', 'span6'] as const)[i % 5] ?? 'span6';
              return (
                <figure key={src} className={`${styles.galleryItem} ${styles[layout]}`}>
                  <img src={src} alt={`P48 — ${i + 2}`} loading="lazy" />
                </figure>
              );
            })}
            {projekt.plans?.map((src, i) => (
              <figure key={src} className={`${styles.galleryItem} ${styles.span6}`}>
                <img src={src} alt={`P48 — Planzeichnung ${i + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function StaticFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <StaticDoppelzwiebel
        width={300}
        height={400}
        fill="rgba(42, 40, 38, 0.92)"
        stroke="#c44e2c"
        strokeWidth={1.5}
        ariaLabel="P48 Doppelzwiebel — statische Darstellung"
      />
    </div>
  );
}

function StaticFallbackBlock() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 0,
        height: '60vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, #ebe2d1 0%, #f4ede0 100%)',
      }}
    >
      <StaticFallback />
    </div>
  );
}
