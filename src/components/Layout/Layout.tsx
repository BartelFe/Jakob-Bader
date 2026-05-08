import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Loader } from '../Loader/Loader';
import { Cursor } from '../Cursor/Cursor';
import { HeroExitVeil } from '../HeroExitVeil/HeroExitVeil';
import { PageTransition, PAGE_WIPE_CLASS } from '../PageTransition/PageTransition';

import { initLenis, destroyLenis } from '@/lib/lenis';
import { scanReveals } from '@/lib/reveal';

import styles from './Layout.module.css';

/**
 * Root shell — header, main outlet, footer, and Phase-5 polish (Lenis,
 * custom cursor, page-transition curtain, IntersectionObserver reveals).
 *
 * The `<main>` keys on `location.pathname` so each route remounts and
 * re-runs the curtain reveal animation (PAGE_WIPE_CLASS).
 */
export function Layout() {
  const location = useLocation();

  // Lenis singleton — outlives route changes
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  // Scroll restoration + reveal scanner on each route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        // small delay so the page-wipe doesn't fight the scrollIntoView
        const t = window.setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320);
        return () => window.clearTimeout(t);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    return undefined;
  }, [location.pathname, location.hash]);

  // Re-scan reveals after each route + after the wipe clears
  useEffect(() => {
    const t = window.setTimeout(() => scanReveals(), 320);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      <Loader />
      <Cursor />
      <PageTransition />
      <HeroExitVeil />
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <Header />
      <main
        id="main"
        className={`${styles.main} ${PAGE_WIPE_CLASS}`}
        key={location.pathname}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
