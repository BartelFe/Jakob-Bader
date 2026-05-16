import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  EdgesGeometry,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  MeshStandardMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';

import {
  HEIGHT,
  LANTERN_RADIUS,
  Y_LANTERN_BOTTOM,
  Y_LANTERN_TOP,
  getLowerLatheProfile,
  getUpperLatheProfile,
  type ProfilePoint,
} from './profile';

interface DoppelzwiebelProps {
  /**
   * Legacy prop — kept for API compatibility with existing call sites
   * (HeroScene, P48Scene). The split-lathe renderer only fully composes
   * at morph=1; lower morph values render a partial / "becoming"
   * silhouette useful for loader-style reveals. For most production
   * use, leave at 1.
   */
  morph?: number;
  /** Lathe segment count — high desktop, capped on mobile for perf. */
  segments?: number;
  /** Edge-line opacity (0..1). Faded in by the loader's reveal phase. */
  edgesOpacity?: number;
  /** Optional sweep angle for build-live loader effects (default: full circle). */
  phiLength?: number;
  /** Show the spire's cross finial. */
  withCross?: boolean;
}

/**
 * Krachers Doppelzwiebel — refactored as a 3-part assembly:
 *
 *   ┌──────────────┐  spire + upper bulb (LatheGeometry, anthracite zinc)
 *   │   ◯ ◯ ◯ ◯   │  lantern (8 columns + drum + cornices, NOT a lathe)
 *   └──────────────┘  pedestal + lower bulb (LatheGeometry, anthracite zinc)
 *
 * The split is required because the lantern's open-column architecture
 * cannot be represented by a single LatheGeometry. The dome's overall
 * shape (the silhouette) is still controlled by the profile functions
 * in `./profile.ts` — see the comment block there for proportions.
 */
export function Doppelzwiebel({
  segments = 64,
  edgesOpacity = 0.18,
  phiLength = Math.PI * 2,
  withCross = true,
}: DoppelzwiebelProps) {
  const groupRef = useRef<Group>(null);

  // ─── Geometries (memoized; rebuild only on segments/phiLength change) ─
  const { lowerLathe, upperLathe, lowerEdges, upperEdges } = useMemo(() => {
    const lowerPts = getLowerLatheProfile(36).map(([x, y]) => new Vector2(x, y));
    const upperPts = getUpperLatheProfile(36).map(([x, y]) => new Vector2(x, y));
    const lower = new LatheGeometry(lowerPts, segments, 0, phiLength);
    const upper = new LatheGeometry(upperPts, segments, 0, phiLength);
    lower.computeVertexNormals();
    upper.computeVertexNormals();
    return {
      lowerLathe: lower,
      upperLathe: upper,
      lowerEdges: new EdgesGeometry(lower, 12),
      upperEdges: new EdgesGeometry(upper, 12),
    };
  }, [segments, phiLength]);

  // ─── Materials ──────────────────────────────────────────────────────
  const zincMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#5c636a',
        metalness: 0.88,
        roughness: 0.32,
        envMapIntensity: 1.25,
      }),
    [],
  );

  const edgeMat = useMemo(
    () =>
      new LineBasicMaterial({
        color: '#c9b896',
        transparent: true,
        opacity: edgesOpacity,
      }),
    // intentionally not depending on edgesOpacity — updated imperatively below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    edgeMat.opacity = edgesOpacity;
  }, [edgeMat, edgesOpacity]);

  // ─── Disposal (avoid GPU memory leaks on HMR or unmount) ────────────
  useEffect(() => {
    return () => {
      lowerLathe.dispose();
      upperLathe.dispose();
      lowerEdges.dispose();
      upperEdges.dispose();
      zincMat.dispose();
      edgeMat.dispose();
    };
  }, [lowerLathe, upperLathe, lowerEdges, upperEdges, zincMat, edgeMat]);

  // ─── Idle rotation + subtle float (slower than v1 — gives detail time) ─
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.10 * delta;
    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      Math.sin(state.clock.elapsedTime * 0.6) * 0.04 - HEIGHT / 2,
      0.08,
    );
  });

  return (
    <group ref={groupRef} position={[0, -HEIGHT / 2, 0]}>
      {/* LOWER half — pedestal + lower bulb + neck taper */}
      <mesh geometry={lowerLathe} material={zincMat} castShadow receiveShadow />
      <primitive
        object={new LineSegments(lowerEdges, edgeMat)}
        scale={[1.0008, 1.0008, 1.0008]}
      />
      {/* Stehfalze on the lower bulb — 20 ribs (matches reference image density) */}
      <DomeRibs profile={getLowerLatheProfile(48)} ribCount={20} />

      {/* LANTERN — separate octagonal pavilion (cannot be a lathe) */}
      <Lantern
        y={Y_LANTERN_BOTTOM}
        radius={LANTERN_RADIUS}
        height={Y_LANTERN_TOP - Y_LANTERN_BOTTOM}
        drumSegments={Math.min(segments, 64)}
      />

      {/* UPPER half — small bulb + spire */}
      <mesh geometry={upperLathe} material={zincMat} castShadow receiveShadow />
      <primitive
        object={new LineSegments(upperEdges, edgeMat)}
        scale={[1.0008, 1.0008, 1.0008]}
      />
      {/* Stehfalze on the upper bulb — 16 ribs (smaller circumference,
          reference shows higher density than initial v3 estimate) */}
      <DomeRibs profile={getUpperLatheProfile(48)} ribCount={16} />

      {withCross ? <WeatherVane y={HEIGHT - 0.05} /> : null}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * LANTERN — octagonal pillared pavilion
 *
 * Architectural anatomy (bottom to top):
 *   1. Bottom cornice ring — dark zinc, octagonal, slightly wider than columns
 *   2. Inner drum (limestone/cream) visible BEHIND the columns
 *   3. Eight cream columns standing in a circle at radius=LANTERN_RADIUS
 *   4. Top cornice ring — dark zinc, octagonal, mirror of bottom
 *
 * The columns are rotated by π/8 (22.5°) so they sit at the octagonal
 * cornices' corners rather than centered on the flat sides — matches
 * the photographic reference.
 * ═══════════════════════════════════════════════════════════════════ */
function Lantern({
  y,
  radius,
  height,
  drumSegments,
}: {
  y: number;
  radius: number;
  height: number;
  drumSegments: number;
}) {
  const COLUMN_COUNT = 8;
  const COLUMN_RADIUS = 0.045;
  const BASE_CORNICE_HEIGHT = 0.10;
  const TOP_CORNICE_HEIGHT = 0.12;
  const columnHeight = height - BASE_CORNICE_HEIGHT - TOP_CORNICE_HEIGHT;
  const columnY = y + BASE_CORNICE_HEIGHT + columnHeight / 2;

  return (
    <group>
      {/* Bottom cornice — dark zinc, octagonal, with slight outward taper */}
      <mesh
        position={[0, y + BASE_CORNICE_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[radius + 0.04, radius + 0.06, BASE_CORNICE_HEIGHT, 8]}
        />
        <meshStandardMaterial
          color="#5c636a"
          metalness={0.88}
          roughness={0.32}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Inner core — very small + dark, suggests depth behind the open
          columns. The point is to read as "void" behind the colonnade,
          not as a wall. */}
      <mesh position={[0, columnY, 0]} receiveShadow>
        <cylinderGeometry
          args={[radius - 0.32, radius - 0.32, columnHeight * 0.85, drumSegments]}
        />
        <meshStandardMaterial color="#1a1c20" metalness={0.2} roughness={0.9} />
      </mesh>

      {/* 8 columns — cream painted limestone, evenly spaced */}
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => {
        const angle = (i / COLUMN_COUNT) * Math.PI * 2 + Math.PI / 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, columnY, z]} castShadow>
            <cylinderGeometry
              args={[COLUMN_RADIUS, COLUMN_RADIUS, columnHeight, 12]}
            />
            <meshStandardMaterial
              color="#e8e2d4"
              metalness={0.05}
              roughness={0.85}
            />
          </mesh>
        );
      })}

      {/* Capitals — small cream blocks above each column, suggesting
          where the arches would spring from. Gives the colonnade
          architectural weight at the top. */}
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => {
        const angle = (i / COLUMN_COUNT) * Math.PI * 2 + Math.PI / 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh
            key={`cap-${i}`}
            position={[x, y + height - TOP_CORNICE_HEIGHT - 0.04, z]}
            castShadow
          >
            <boxGeometry args={[0.11, 0.06, 0.11]} />
            <meshStandardMaterial color="#e8e2d4" metalness={0.05} roughness={0.85} />
          </mesh>
        );
      })}

      {/* Top cornice — dark zinc, octagonal, slightly wider than bottom */}
      <mesh
        position={[0, y + height - TOP_CORNICE_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[radius + 0.08, radius + 0.04, TOP_CORNICE_HEIGHT, 8]}
        />
        <meshStandardMaterial
          color="#5c636a"
          metalness={0.88}
          roughness={0.32}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * DOME RIBS — vertical zinc seams (Stehfalze)
 *
 * The defining surface detail of a real Bavarian onion dome. Each rib
 * is a thin TubeGeometry following the lathe's profile curve at a
 * single radial angle. The rib stands slightly outward from the
 * surface (controlled by `protrusion`), simulating where two zinc
 * sheets fold together into a raised seam.
 *
 * Rib material is slightly lighter and more reflective than the dome
 * surface, so the seams catch highlights along their crests — the
 * effect that makes the dome read as "constructed metal" rather than
 * "molded surface."
 *
 * Profile points where r < 0.06 are filtered out — at the spire tip
 * the surface is thinner than the rib itself, and a tube there would
 * just be a degenerate overlap.
 * ═══════════════════════════════════════════════════════════════════ */
function DomeRibs({
  profile,
  ribCount,
  ribRadius = 0.022,
  protrusion = 1.025,
}: {
  profile: ProfilePoint[];
  ribCount: number;
  ribRadius?: number;
  protrusion?: number;
}) {
  const geometries = useMemo(() => {
    const usablePoints = profile.filter(([r]) => r > 0.06);
    if (usablePoints.length < 2) return [];

    return Array.from({ length: ribCount }).map((_, i) => {
      const angle = (i / ribCount) * Math.PI * 2;
      const points = usablePoints.map(
        ([r, y]) =>
          new Vector3(
            Math.cos(angle) * r * protrusion,
            y,
            Math.sin(angle) * r * protrusion,
          ),
      );
      const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
      return new TubeGeometry(curve, 48, ribRadius, 6, false);
    });
  }, [profile, ribCount, ribRadius, protrusion]);

  const ribMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#5a5d62',
        metalness: 0.94,
        roughness: 0.22,
        envMapIntensity: 1.35,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometries.forEach((g) => g.dispose());
      ribMaterial.dispose();
    };
  }, [geometries, ribMaterial]);

  return (
    <>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo} material={ribMaterial} castShadow />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * WEATHER VANE — finial atop the upper bulb's spire
 *
 * Historically correct for the P48 building: a 1890 residential
 * Wohnhaus by Ludwig Kracher, not a church, so a Wetterfahne (not a
 * Christian cross) crowns the helm. The `withCross` prop name is
 * kept for API compat with existing call sites (HeroScene, P48Scene).
 * ═══════════════════════════════════════════════════════════════════ */
function WeatherVane({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      {/* Vertical pole */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.018, 0.85, 12]} />
        <meshStandardMaterial color="#c9b896" metalness={0.92} roughness={0.28} />
      </mesh>
      {/* Small finial ball ~60% up the pole */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        <meshStandardMaterial color="#c9b896" metalness={0.92} roughness={0.28} />
      </mesh>
      {/* Compass-rose crossbar (4 arms) */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.34, 0.025, 0.025]} />
        <meshStandardMaterial color="#c9b896" metalness={0.92} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.025, 0.025, 0.34]} />
        <meshStandardMaterial color="#c9b896" metalness={0.92} roughness={0.28} />
      </mesh>
      {/* Top ornament */}
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.035, 12, 8]} />
        <meshStandardMaterial color="#c9b896" metalness={0.92} roughness={0.28} />
      </mesh>
    </group>
  );
}
