import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
  const upcoming = nextEvent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
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
    </header>
  );
}
