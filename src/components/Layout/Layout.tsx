import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Loader } from '../Loader/Loader';

import styles from './Layout.module.css';

/**
 * Root shell — header, main outlet, footer.
 *
 * Scroll restoration: on path change, jump to top unless the URL has a
 * hash anchor (then leave it to the browser's default anchor scroll).
 * Brief §6: "Scroll-Restoration: Bei Back-Navigation Position
 * wiederherstellen, sonst top." React Router's default Browser history
 * already restores on Back/Forward — we just guard the forward case.
 */
export function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  return (
    <div className={styles.shell}>
      <Loader />
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
