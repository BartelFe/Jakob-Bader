/**
 * Doppelzwiebel — profile math (v3, post-video-review).
 *
 * Felix's reference photo shows a Munich baroque double-onion helm with:
 *   • Lower bulb roughly 1:1 height-to-width (round, not tall)
 *   • Lantern (small drum with arched openings) between bulbs
 *   • Upper bulb similar 1:1 aspect, smaller diameter than lower
 *   • Spire needle ~25-30% of total height
 *
 * v2 used 33%/28% bulb-height fractions which produced 2.7:1 aspect
 * (missile-shaped). v3 compacts the bulbs to ~22%/19% height and bumps
 * the max radii so the bulbs read as round/balloon-shaped from any
 * camera angle.
 *
 * NOTE: This module is intentionally three.js-free so it can ship in
 * the main bundle (used by SVG fallback + loader). Consumers that need
 * a `Vector2[]` should wrap the returned tuples themselves.
 */

export const NUM_POINTS = 48;
export const HEIGHT = 10;

export type ProfileState = 'cone' | 'onion' | 'doppelzwiebel';

/** [radius, height] tuple. */
export type ProfilePoint = readonly [number, number];

/**
 * Onion-bulb radius at parametric t ∈ [0, 1] (0 = base of bulb, 1 = top).
 *
 * Three regions tuned for proper bulb shape:
 *   0.00–0.18  — very rapid expansion to maxR (sin ease-out, sharp shoulders)
 *   0.18–0.45  — wide plateau near maxR (slight 3% bulge in middle)
 *   0.45–1.00  — cubic-eased pinch from maxR to topR
 *
 * Sharp shoulders + wide plateau = visibly round bulb, not tapered.
 */
function bulb(t: number, baseR: number, maxR: number, topR: number): number {
  if (t <= 0) return baseR;
  if (t >= 1) return topR;

  if (t < 0.18) {
    const local = t / 0.18;
    return baseR + (maxR - baseR) * Math.sin((local * Math.PI) / 2);
  }

  if (t < 0.45) {
    const local = (t - 0.18) / 0.27;
    const bump = Math.sin(local * Math.PI) * 0.03;
    return maxR * (1 + bump);
  }

  // Cubic-eased pinch — accelerates toward the top
  const local = (t - 0.45) / 0.55;
  const eased = local * local * (3 - 2 * local);
  return maxR + (topR - maxR) * eased;
}

/* ─── State 3: Doppelzwiebel (1890 / 2025) ─────────────────────────── */
function doppelzwiebelRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  // Tambour — octagonal base with windows
  if (t < 0.10) return 0.85;

  // Cornice — pinch where the bulb springs from
  if (t < 0.13) {
    const local = (t - 0.10) / 0.03;
    return 0.85 + (0.55 - 0.85) * local;
  }

  // LOWER BULB — large, fat, ~22% of height. Aspect ~1.1:1.
  // Width = 2 * 1.20 = 2.40, height = 0.22 * 10 = 2.2
  if (t < 0.35) {
    const local = (t - 0.13) / 0.22;
    return bulb(local, 0.55, 1.20, 0.32);
  }

  // LANTERN — drum with arched openings, ~10% of height
  if (t < 0.45) return 0.42;

  // Cornice into upper bulb
  if (t < 0.48) {
    const local = (t - 0.45) / 0.03;
    return 0.42 + (0.45 - 0.42) * local;
  }

  // UPPER BULB — smaller but similarly round, ~19% of height
  // Width = 2 * 0.78 = 1.56, height = 0.19 * 10 = 1.9. Aspect ~1.2:1.
  if (t < 0.67) {
    const local = (t - 0.48) / 0.19;
    return bulb(local, 0.45, 0.78, 0.18);
  }

  // Spire base — short collar before the needle
  if (t < 0.72) {
    const local = (t - 0.67) / 0.05;
    return 0.18 + (0.10 - 0.18) * local;
  }

  // SPIRE — thin needle to the cross (~28% of height)
  const local = (t - 0.72) / 0.28;
  return 0.10 * Math.pow(1 - local, 2.2);
}

/* ─── State 2: Onion (mid-historical, single bulb) ─────────────────── */
function onionRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  if (t < 0.10) return 0.85;

  if (t < 0.13) {
    const local = (t - 0.10) / 0.03;
    return 0.85 + (0.55 - 0.85) * local;
  }

  // SINGLE BULB — slightly larger than doppelzwiebel's lower, ~38% of height
  // Width = 2 * 1.10 = 2.20, height = 0.38 * 10 = 3.8. Aspect ~1.7:1
  // (taller than ideal but historical onions ARE more elongated when they're
  //  the only bulb — they have to span the visual mass alone).
  if (t < 0.51) {
    const local = (t - 0.13) / 0.38;
    return bulb(local, 0.55, 1.10, 0.14);
  }

  // Spire base
  if (t < 0.56) {
    const local = (t - 0.51) / 0.05;
    return 0.14 + (0.10 - 0.14) * local;
  }

  // Spire (~44% of height — when there's only one bulb the spire fills more space)
  const local = (t - 0.56) / 0.44;
  return 0.10 * Math.pow(1 - local, 2.2);
}

/* ─── State 1: Cone (1924+ pragmatic reduction) ────────────────────── */
function coneRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  if (t < 0.10) return 0.85;

  if (t < 0.13) {
    const local = (t - 0.10) / 0.03;
    return 0.85 + (0.72 - 0.85) * local;
  }

  // Plain conical roof — short, stubby pyramid
  if (t < 0.42) {
    const local = (t - 0.13) / 0.29;
    return 0.72 * (1 - Math.pow(local, 0.85));
  }

  return 0.001;
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
  const xScale = width / 2.6;

  let d = '';
  const ordered = [...points].sort((a, b) => b[1] - a[1]);
  ordered.forEach((p, i) => {
    const sx = cx + p[0] * xScale;
    const sy = (HEIGHT - p[1]) * yScale;
    d += i === 0 ? `M ${sx.toFixed(2)} ${sy.toFixed(2)}` : ` L ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  });
  [...points].forEach((p) => {
    const sx = cx - p[0] * xScale;
    const sy = (HEIGHT - p[1]) * yScale;
    d += ` L ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  });
  d += ' Z';
  return d;
}
