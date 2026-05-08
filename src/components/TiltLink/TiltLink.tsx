import { Link, type LinkProps } from 'react-router-dom';

import { useImageTilt } from '@/lib/useImageTilt';

interface TiltLinkProps extends LinkProps {
  /** Tilt magnitude in degrees at the corners. Default 5. */
  strength?: number;
}

/**
 * `<Link>` with image-tilt applied via `useImageTilt`. Lives in its own
 * file so each rendered card gets its own ref/effect — hooks can't run
 * inside `.map()` without a wrapper component.
 *
 * Consumes CSS variables `--tilt-x` and `--tilt-y` set on the element.
 * The Werk grid's CSS reads these for perspective rotation.
 */
export function TiltLink({ strength = 5, children, ...props }: TiltLinkProps) {
  const ref = useImageTilt<HTMLAnchorElement>(strength);
  return (
    <Link ref={ref} {...props}>
      {children}
    </Link>
  );
}
