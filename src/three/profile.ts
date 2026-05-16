/**
 * Doppelzwiebel — profile math (v4, traced from Bader's section drawing).
 *
 * Reference: cropped helm portion of /public/projekte/p48/p48-schnitt.jpg
 * (saved as p48-helm-context.png). Proportions measured directly from
 * the drawing, top-of-cross to base-of-pedestal:
 *
 *   Pedestal (octagonal base)         11%
 *   Pedestal-to-bulb cornice           2%
 *   Lower bulb (largest, fattest)     23%
 *   Lower cornice                      4%
 *   Lantern (with arched openings)    15%
 *   Lantern-to-upper cornice           3%
 *   Upper bulb (smaller, similar)     15%
 *   Pinched neck                       3%
 *   Spire needle                      19%
 *   Cross finial (separate mesh)       5%
 *
 * The previous v3 had the lower bulb too SHORT (22% height with
 * max radius 1.20) — felt missile-shaped. Real lower bulb in
 * the drawing is FATTER (max ~1.30) and similar height. Upper
 * bulb is also slightly fatter (max 0.75 vs 0.60) and a touch
 * taller. Pedestal is taller (11% vs 10%) so the helm "stands"
 * more visibly on its base.
 */

export const NUM_POINTS = 56;
export const HEIGHT = 10;

export type ProfileState = 'cone' | 'onion' | 'doppelzwiebel';
export type ProfilePoint = readonly [number, number];

/**
 * Onion-bulb radius. v4 tightens the shoulders (rapid expansion at the
 * bottom) and SOFTENS the pinch (smoother taper near the top) so the
 * silhouette reads as a fat balloon, not a missile.
 */
function bulb(t: number, baseR: number, maxR: number, topR: number): number {
  if (t <= 0) return baseR;
  if (t >= 1) return topR;

  if (t < 0.20) {
    // Sharp shoulder — sin ease-out, expansion happens in lower 20%
    const local = t / 0.20;
    return baseR + (maxR - baseR) * Math.sin((local * Math.PI) / 2);
  }

  if (t < 0.42) {
    // Plateau with a soft 4% bulge — gives the bulb its fat middle
    const local = (t - 0.20) / 0.22;
    const bump = Math.sin(local * Math.PI) * 0.04;
    return maxR * (1 + bump);
  }

  // Cubic-eased pinch — softer than v3 so the bulb tapers gently
  const local = (t - 0.42) / 0.58;
  const eased = local * local * (3 - 2 * local);
  return maxR + (topR - maxR) * eased;
}

/* ─── Doppelzwiebel ─ traced from p48-schnitt.jpg ────────────────── */
function doppelzwiebelRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  // Octagonal pedestal — wider than the bulb, gives the helm a base
  if (t < 0.11) return 0.92;

  // Cornice — pinch from pedestal to lower-bulb base
  if (t < 0.13) {
    const local = (t - 0.11) / 0.02;
    return 0.92 + (0.58 - 0.92) * local;
  }

  // LOWER BULB — biggest, fat. Aspect ~1.0:1 (height 23% × max diam 2.6 / HEIGHT 10 = wide)
  if (t < 0.36) {
    const local = (t - 0.13) / 0.23;
    return bulb(local, 0.58, 1.30, 0.36);
  }

  // Lower cornice ring (lantern base)
  if (t < 0.40) return 0.42;

  // LANTERN — drum with arched openings. Slightly wider than ribbon-thin
  if (t < 0.55) return 0.46;

  // Lantern-to-upper-bulb cornice
  if (t < 0.58) {
    const local = (t - 0.55) / 0.03;
    return 0.46 + (0.44 - 0.46) * local;
  }

  // UPPER BULB — smaller version of lower
  if (t < 0.73) {
    const local = (t - 0.58) / 0.15;
    return bulb(local, 0.44, 0.78, 0.12);
  }

  // Pinched neck before spire
  if (t < 0.76) {
    const local = (t - 0.73) / 0.03;
    return 0.12 + (0.07 - 0.12) * local;
  }

  // SPIRE — long thin needle (cross finial added as separate mesh)
  const local = (t - 0.76) / 0.24;
  return 0.07 * Math.pow(1 - local, 1.9);
}

/* ─── Single-onion (mid-historical) ────────────────────────────── */
function onionRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  if (t < 0.11) return 0.92;
  if (t < 0.13) {
    const local = (t - 0.11) / 0.02;
    return 0.92 + (0.58 - 0.92) * local;
  }

  // Single bulb taking the bulb-and-lantern range
  if (t < 0.55) {
    const local = (t - 0.13) / 0.42;
    return bulb(local, 0.58, 1.20, 0.16);
  }

  if (t < 0.58) {
    const local = (t - 0.55) / 0.03;
    return 0.16 + (0.10 - 0.16) * local;
  }

  // Spire
  const local = (t - 0.58) / 0.42;
  return 0.10 * Math.pow(1 - local, 1.9);
}

/* ─── Cone (1924+ reduction) — tall steeple ─────────────────────── */
function coneRadius(t: number): number {
  if (t < 0.001 || t > 0.999) return 0.001;

  if (t < 0.11) return 0.92;
  if (t < 0.13) {
    const local = (t - 0.11) / 0.02;
    return 0.92 + (0.78 - 0.92) * local;
  }

  // Tall steeple from r=0.78 down to 0
  const local = (t - 0.13) / 0.87;
  return 0.78 * Math.pow(1 - local, 1.1);
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

/* ═══════════════════════════════════════════════════════════════════
 * SPLIT-LATHE GEOMETRY for the doppelzwiebel hero
 *
 * The doppelzwiebel is rendered as THREE separate parts to enable the
 * lantern's open-column architecture, which is impossible inside a
 * single LatheGeometry (a lathe surface is a continuous rotational
 * solid and cannot have holes).
 *
 *   y range            | rendered as
 *   ───────────────────┼─────────────────────────────────────────
 *   0 → Y_LANTERN_BOT  | LOWER lathe — pedestal + lower bulb + neck
 *   Y_LANTERN_BOT → Y_LANTERN_TOP | LANTERN — separate group (Doppelzwiebel.tsx)
 *   Y_LANTERN_TOP → HEIGHT | UPPER lathe — small bulb + spire
 *
 * The lantern radius is wider than the necks at its base/top, so a
 * visible cornice "shelf" appears at each end — that's the correct
 * architectural read.
 * ═══════════════════════════════════════════════════════════════════ */

/** Y-coordinate (world units) where the lantern's bottom cornice sits. */
export const Y_LANTERN_BOTTOM = 4.0;

/** Y-coordinate where the lantern's top cornice sits. */
export const Y_LANTERN_TOP = 5.5;

/** Outer radius of the lantern's columns (column-center radius). */
export const LANTERN_RADIUS = 0.52;

/**
 * Profile for the LOWER lathe — pedestal + lower bulb + neck taper.
 *
 * Spans y = 0 to Y_LANTERN_BOTTOM (4.0 units). Designed wider than tall
 * to give the bulb its characteristic Bavarian fatness (~1.4:1 ratio).
 */
export function getLowerLatheProfile(numPoints = 36): ProfilePoint[] {
  const pts: ProfilePoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const y = t * Y_LANTERN_BOTTOM;
    let r: number;

    if (t < 0.275) {
      r = 0.94;
    } else if (t < 0.32) {
      const local = (t - 0.275) / 0.045;
      r = 0.94 + (0.55 - 0.94) * local;
    } else if (t < 0.88) {
      const local = (t - 0.32) / 0.56;
      r = bulb(local, 0.55, 1.50, 0.30);
    } else {
      const local = (t - 0.88) / 0.12;
      r = 0.30 + (0.16 - 0.30) * local;
    }

    pts.push([Math.max(0.001, r), y]);
  }
  return pts;
}

/**
 * Profile for the UPPER lathe — small upper bulb + spire needle.
 *
 * Spans y = Y_LANTERN_TOP to HEIGHT (4.5 units). Same ogee shape as
 * the lower bulb, scaled to ~58% (max r=0.88 vs lower's 1.50).
 */
export function getUpperLatheProfile(numPoints = 36): ProfilePoint[] {
  const pts: ProfilePoint[] = [];
  const ySpan = HEIGHT - Y_LANTERN_TOP;
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const y = Y_LANTERN_TOP + t * ySpan;
    let r: number;

    if (t < 0.06) {
      const local = t / 0.06;
      r = 0.16 + (0.42 - 0.16) * local;
    } else if (t < 0.42) {
      const local = (t - 0.06) / 0.36;
      r = bulb(local, 0.42, 0.88, 0.14);
    } else if (t < 0.48) {
      const local = (t - 0.42) / 0.06;
      r = 0.14 + (0.05 - 0.14) * local;
    } else {
      const local = (t - 0.48) / 0.52;
      r = 0.05 * Math.pow(1 - local, 1.9);
    }

    pts.push([Math.max(0.001, r), y]);
  }
  return pts;
}

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
