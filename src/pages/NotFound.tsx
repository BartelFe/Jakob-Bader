import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { NOT_FOUND } from '@/data/manifest';
import styles from './NotFound.module.css';

/**
 * 404 — Doppelzwiebel silhouette + Bader quote per brief §14.
 * The silhouette path is derived from the P48 cross-section profile;
 * Phase 2 replaces this static SVG with the actual rendered model.
 */
export function NotFound() {
  useEffect(() => {
    document.title = 'Nicht gefunden · Jakob Bader Architektur';
    return () => {
      document.title = 'Jakob Bader Architektur — Mut zum Raum';
    };
  }, []);

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <DoppelzwiebelSilhouette className={styles.silhouette} />
        <p className={`${styles.code} reveal`}>404 · nicht gefunden</p>
        <h1 className={`${styles.headline} reveal`}>
          „{NOT_FOUND.headline}"<span className={styles.attrib}>— {NOT_FOUND.attrib}</span>
        </h1>
        <p className={`${styles.body} reveal`}>{NOT_FOUND.body}</p>
        <Link to="/" className={`${styles.cta} reveal`}>
          {NOT_FOUND.cta} →
        </Link>
      </div>
    </article>
  );
}

function DoppelzwiebelSilhouette({ className }: { className?: string }) {
  // Profile: vertical center axis. Two onions stacked, spire on top.
  // Coordinates approximate the P48 helm proportions.
  return (
    <svg
      className={className}
      viewBox="0 0 180 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {/* Tambour (drum base) */}
        <line x1="55" y1="220" x2="55" y2="180" />
        <line x1="125" y1="220" x2="125" y2="180" />
        <line x1="55" y1="180" x2="125" y2="180" />
        {/* Lower onion */}
        <path d="M 55 180 C 30 165, 30 130, 50 115 C 60 110, 75 108, 90 108 C 105 108, 120 110, 130 115 C 150 130, 150 165, 125 180" />
        {/* Neck */}
        <line x1="78" y1="108" x2="78" y2="92" />
        <line x1="102" y1="108" x2="102" y2="92" />
        <line x1="78" y1="92" x2="102" y2="92" />
        {/* Upper onion */}
        <path d="M 78 92 C 60 80, 60 56, 78 48 C 84 45, 90 44, 90 44 C 90 44, 96 45, 102 48 C 120 56, 120 80, 102 92" />
        {/* Spire */}
        <line x1="90" y1="44" x2="90" y2="22" />
        {/* Cross */}
        <line x1="86" y1="22" x2="94" y2="22" />
        <line x1="90" y1="18" x2="90" y2="26" />
      </g>
    </svg>
  );
}
