interface JBALogoProps {
  size?: number;
  ariaLabel?: string;
}

/**
 * JBA monogram — circle + two stylized "J" "B" curves.
 * Stroke color inherits from currentColor so it works on deep + paper.
 */
export function JBALogo({ size = 38, ariaLabel = 'JBA Monogramm' }: JBALogoProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="translate(120 120)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="0" cy="0" r="115" strokeWidth="3.5" />
        <path
          strokeWidth="4.5"
          d="M -28 -62 C -10 -72, 12 -68, 6 -48 C 2 -32, -4 -10, -12 18 C -18 42, -28 62, -48 60 C -62 58, -64 46, -52 42"
        />
        <path
          strokeWidth="4.5"
          d="M 6 -48 C 22 -58, 52 -56, 58 -32 C 60 -14, 42 -6, 22 -8 C 50 -8, 70 8, 64 36 C 58 62, 22 72, 0 58"
        />
      </g>
    </svg>
  );
}
