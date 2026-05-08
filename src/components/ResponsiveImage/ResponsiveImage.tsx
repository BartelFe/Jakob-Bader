import { useState, type ImgHTMLAttributes } from 'react';

import { LQIP } from '@/data/lqip';

import styles from './ResponsiveImage.module.css';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  alt: string;
  /**
   * If true, the wrapper takes its parent's exact box (object-fit: cover).
   * Default true. Set false for inline-flow images that should size to
   * their natural aspect ratio.
   */
  fill?: boolean;
};

const RE = /\.(jpe?g|png)$/i;

/**
 * Three-source `<picture>` (AVIF → WebP → original) with an inline
 * LQIP blur-up reveal.
 *
 * Pipeline mate: `pnpm images` writes the .avif and .webp twins next to
 * the JPG, plus a base64 LQIP into `src/data/lqip.ts` keyed by the
 * /public-relative URL. Lookup is by the JPG path the caller passes.
 *
 * Decisions:
 *   D-021 sharp script over vite-imagetools (works with /public/-served images)
 *   D-024 LQIP shown as wrapper background; img fades from opacity 0 → 1
 */
export function ResponsiveImage({ src, alt, fill = true, className, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!RE.test(src)) {
    // Already a webp/svg/etc — render plain <img>, no blur-up
    return <img src={src} alt={alt} className={className} {...rest} />;
  }

  const avif = src.replace(RE, '.avif');
  const webp = src.replace(RE, '.webp');
  const lqip = LQIP[src];

  return (
    <picture
      className={`${styles.wrapper} ${loaded ? styles.loaded : ''} ${className ?? ''}`}
      style={{
        ...(lqip ? { backgroundImage: `url(${lqip})` } : null),
        ...(fill ? null : { display: 'inline-block', width: 'auto', height: 'auto' }),
      }}
    >
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${loaded ? styles.loaded : ''}`}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </picture>
  );
}
