import styles from './ManifestBanner.module.css';

interface ManifestBannerProps {
  lead: string;
  bold: string;
  coda?: string;
}

export function ManifestBanner({ lead, bold, coda }: ManifestBannerProps) {
  return (
    <div className={`${styles.banner} surface-deep reveal`}>
      <p className={styles.text}>
        {lead}
        <br />
        <span className={styles.bold}>{bold}</span>
        {coda ? <span className={styles.coda}>{coda}</span> : null}
      </p>
    </div>
  );
}
