import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { JBALogo } from '../JBALogo/JBALogo';
import { nextEvent } from '@/data/akademie';

import styles from './Header.module.css';

const NAV_LINKS = [
  { to: '/#werk', label: 'Werk' },
  { to: '/#akademie', label: 'Akademie' },
  { to: '/#person', label: 'Person' },
  { to: '/#dialog', label: 'Dialog' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const upcoming = nextEvent();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on every route change (and hash change)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ''} ${
          mobileOpen ? styles.headerMobileOpen : ''
        }`}
        id="siteHeader"
      >
        <Link className={styles.brand} to="/" aria-label="Jakob Bader Architektur — Startseite">
          <span className={styles.brandMark} aria-hidden="true">
            <JBALogo size={38} />
          </span>
          <span>
            <span className={styles.brandText}>Jakob Bader</span>
            <span className={styles.brandSub}>Architektur · München</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {upcoming ? (
          <Link className={styles.next} to="/#akademie">
            <span className={styles.pulse} aria-hidden="true" />
            <span>
              Nächster Salon · {upcoming.dateLabel.slice(0, 5).replace('.', '. ')}
            </span>
          </Link>
        ) : null}

        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span
            className={`${styles.mobileToggleIcon} ${mobileOpen ? styles.mobileToggleIconOpen : ''}`}
            aria-hidden="true"
          />
        </button>
      </header>

      {/* Mobile menu — full-bleed overlay, only mounted/visible below 600px */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className={styles.mobileNav} aria-label="Hauptnavigation mobil">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={styles.mobileNavLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        {upcoming ? (
          <Link to="/#akademie" className={styles.mobileNext}>
            <span className={styles.pulse} aria-hidden="true" />
            <span>Nächster Salon · {upcoming.dateLabel}</span>
          </Link>
        ) : null}
        <span className={styles.mobileMenuFoot}>
          Amalienstraße 14a · 80799 München
        </span>
      </div>
    </>
  );
}
