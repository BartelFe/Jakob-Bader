import { profileToSvgPath } from './profile';

interface StaticDoppelzwiebelProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * SVG fallback used when WebGL is unavailable, or when prefers-reduced-motion
 * is on. Shape derived from the same profile math as the 3D mesh, so the
 * silhouette matches.
 */
export function StaticDoppelzwiebel({
  width = 220,
  height = 280,
  fill = '#2a2826',
  stroke = '#c9b896',
  strokeWidth = 1,
  className,
  ariaLabel = 'Doppelzwiebel — Profil',
}: StaticDoppelzwiebelProps) {
  const path = profileToSvgPath('doppelzwiebel', width, height);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}
