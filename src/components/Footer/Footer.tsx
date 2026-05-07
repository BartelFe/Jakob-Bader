import { Link } from 'react-router-dom';
import { JBALogo } from '../JBALogo/JBALogo';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          <JBALogo size={28} />
        </span>
        <span className={styles.copyright}>© Jakob Bader Architektur · MMXXVI</span>
      </div>
      <nav className={styles.links} aria-label="Footer">
        <Link to="/impressum" className={styles.link}>
          Impressum
        </Link>
        <Link to="/datenschutz" className={styles.link}>
          Datenschutz
        </Link>
        <a
          href="https://www.byak.de"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          BAK Bayern
        </a>
      </nav>
    </footer>
  );
}
