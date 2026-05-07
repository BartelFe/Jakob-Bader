/**
 * Doppelzwiebel — profile math.
 *
 * Three keyframe states represent the historical reduction story:
 *   1. cone          — 1924+ post-storm reduction (plump cone)
 *   2. onion         — mid-historical single-bulb form
 *   3. doppelzwiebel — 1890 original / 2025 reconstruction (Bader)
 *
 * All profiles share the same Y-sample grid (NUM_POINTS evenly spaced
 * from base y=0 to top y=HEIGHT) so vertex-by-vertex lerp is clean.
 *
 * NOTE: This module is intentionally three.js-free so it can ship in
 * the main bundle (used by SVG fallback + loader). Consumers that need
 * a `Vector2[]` should wrap the returned tuples themselves.
 */

export const NUM_POINTS = 32;
export const HEIGHT = 10;

export type ProfileState = 'cone' | 'onion' | 'doppelzwiebel';

/** [radius, height] tuple. */
export type ProfilePoint = readonly [number, number];

function coneRadius(t: number): number {
  if (t < 0.12) return 0.7;
  if (t > 0.96) return 0;
  const coneT = (t - 0.12) / 0.84;
  return 0.65 * (1 - coneT);
}

function onionRadius(t: number): number {
  if (t < 0.12) return 0.7;
  if (t > 0.97) return 0;
  if (t < 0.65) {
    const bulbT = (t - 0.12) / 0.53;
    return 0.55 + 0.45 * Math.sin(bulbT * Math.PI);
  }
  const spireT = (t - 0.65) / 0.32;
  return 0.4 * (1 - spireT * spireT);
}

function doppelzwiebelRadius(t: number): number {
  if (t < 0.12) return 0.7;
  if (t > 0.985) return 0;
  if (t < 0.42) {
    const bulbT = (t - 0.12) / 0.30;
    return 0.7 + 0.4 * Math.sin(bulbT * Math.PI);
  }
  if (t < 0.5) return 0.36;
  if (t < 0.78) {
    const bulbT = (t - 0.5) / 0.28;
    return 0.36 + 0.32 * Math.sin(bulbT * Math.PI);
  }
  const spireT = (t - 0.78) / 0.205;
  return 0.32 * (1 - spireT) ** 1.6;
}

const RADIUS_FN: Record<ProfileState, (t: number) => number> = {
  cone: coneRadius,
  onion: onionRadius,
  doppelzwiebel: doppelzwiebelRadius,
};

export function getProfile(state: ProfileState, numPoints = NUM_POINTS): ProfilePoint[] {
  const fn = RADIUS_FN[state];
  const pts: ProfilePoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const y = t * HEIGHT;
    pts.push([Math.max(0.0001, fn(t)), y]);
  }
  return pts;
}

export function morphProfile(progress: number, numPoints = NUM_POINTS): ProfilePoint[] {
  const p = Math.max(0, Math.min(1, progress));

  let from: ProfileState;
  let to: ProfileState;
  let local: number;

  if (p <= 0.5) {
    from = 'cone';
    to = 'onion';
    local = p * 2;
  } else {
    from = 'onion';
    to = 'doppelzwiebel';
    local = (p - 0.5) * 2;
  }

  const a = getProfile(from, numPoints);
  const b = getProfile(to, numPoints);
  const out: ProfilePoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    const pa = a[i]!;
    const pb = b[i]!;
    out.push([pa[0] + (pb[0] - pa[0]) * local, pa[1]]);
  }
  return out;
}

/** Build an SVG path for the profile mirrored across Y. Used by SVG fallback + loader. */
export function profileToSvgPath(state: ProfileState, width = 200, height = 260): string {
  const points = getProfile(state, NUM_POINTS);
  const cx = width / 2;
  const yScale = height / HEIGHT;
  const xScale = width / 2.4;

  // Right side: top → bottom (SVG y inverted)
  let d = '';
  const ordered = [...points].sort((a, b) => b[1] - a[1]);
  ordered.forEach((p, i) => {
    const sx = cx + p[0] * xScale;
    const sy = (HEIGHT - p[1]) * yScale;
    d += i === 0 ? `M ${sx.toFixed(2)} ${sy.toFixed(2)}` : ` L ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  });
  // Mirror left side: bottom → top
  [...points].forEach((p) => {
    const sx = cx - p[0] * xScale;
    const sy = (HEIGHT - p[1]) * yScale;
    d += ` L ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  });
  d += ' Z';
  return d;
}
