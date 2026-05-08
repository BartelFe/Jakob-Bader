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
 * The bulb shape uses a control-point onion curve: rapid expansion at
 * the bottom, plateau in the middle, cubic-eased pinch at the top.
 * That gives the proper "balloon-and-stem" silhouette of a real Munich
 * baroque helm, not a smooth sine wave.
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
 * Three regions:
 *   0.00–0.22  — rapid expansion from baseR to maxR (sin ease-out)
 *   0.22–0.50  — plateau near maxR with a slight 5% rise → fall
 *   0.50–1.00  — cubic-eased pinch from maxR down to topR
 *
 * Visual: classic balloon shape. Tight at the bottom, fat at the
 * shoulders, gracefully pinched at the top before whatever is next
 * (lantern or spire).
 */
function bulb(t: number, baseR: number, maxR: number, topR: number): number {
  if (t <= 0) return baseR;
  if (t >= 1) return topR;

  if (t < 0.22) {
    const local = t / 0.22;
    return baseR + (maxR - baseR) * Math.sin((local * Math.PI) / 2);
  }

  if (t < 0.50) {
    // Plateau with subtle bulge — peaks at 1.04 * maxR around t=0.36
    const local = (t - 0.22) / 0.28;
    const bump = Math.sin(local * Math.PI) * 0.04;
    return maxR * (1 + bump);
  }

  // Cubic ease-in-out for the pinch — accelerates the taper near the top
  const local = (t - 0.5) / 0.5;
  const eased = local * local * (3 - 2 * local); // smoothstep
  return maxR + (topR - maxR) * eased;
}

/* ─── State 3: Doppelzwiebel (1890 / 2025) ─────────────────────────── */
function doppelzwiebelRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  // Tambour — octagonal base with windows (rendered as cylinder)
  if (t < 0.10) return 0.78;

  // Cornice — small flare/pinch where the bulb springs
  if (t < 0.13) {
    const local = (t - 0.10) / 0.03;
    return 0.78 + (0.50 - 0.78) * local;
  }

  // LOWER BULB — the big one, 33% of total height
  if (t < 0.46) {
    const local = (t - 0.13) / 0.33;
    return bulb(local, 0.50, 1.05, 0.30);
  }

  // LANTERN — small drum with arched openings (cylindrical approximation)
  if (t < 0.56) return 0.42;

  // UPPER BULB — smaller, ~30% of height, sits on the lantern
  if (t < 0.84) {
    const local = (t - 0.56) / 0.28;
    return bulb(local, 0.42, 0.60, 0.10);
  }

  // SPIRE — thin needle to the cross (cross itself rendered as separate mesh)
  const local = (t - 0.84) / 0.16;
  return 0.06 * Math.pow(1 - local, 2.4);
}

/* ─── State 2: Onion (mid-historical, single bulb) ─────────────────── */
function onionRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  // Tambour same as doppelzwiebel
  if (t < 0.10) return 0.78;

  // Cornice
  if (t < 0.13) {
    const local = (t - 0.10) / 0.03;
    return 0.78 + (0.50 - 0.78) * local;
  }

  // SINGLE BULB — fills the bulb-and-lantern range with one larger onion
  if (t < 0.78) {
    const local = (t - 0.13) / 0.65;
    return bulb(local, 0.50, 0.92, 0.10);
  }

  // Short spire
  const local = (t - 0.78) / 0.22;
  return 0.06 * Math.pow(1 - local, 2.4);
}

/* ─── State 1: Cone (1924+ pragmatic reduction) ────────────────────── */
function coneRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  // Tambour same
  if (t < 0.10) return 0.78;

  // Cornice — less aggressive flare for cone
  if (t < 0.13) {
    const local = (t - 0.10) / 0.03;
    return 0.78 + (0.65 - 0.78) * local;
  }

  // Plain conical roof — short, stubby. Period of reduction was practical.
  if (t < 0.55) {
    const local = (t - 0.13) / 0.42;
    return 0.65 * (1 - Math.pow(local, 0.85));
  }

  // Nothing above — just a tiny apex
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
