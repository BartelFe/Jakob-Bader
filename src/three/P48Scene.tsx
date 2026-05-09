import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Group, MathUtils, Vector3 } from 'three';

import { Doppelzwiebel } from './Doppelzwiebel';
import { useIsMobile } from './HeroScene';

interface P48SceneProps {
  /** 0 = flat plan (top-down) · 1 = full volume with helm and hotspots. */
  progress?: number;
}

/**
 * P48 — own scene per brief §7.3.
 *
 * v3 rebuild — based on real-building photos in /public/projekte/p48/:
 *   - L-shape footprint with the OCTAGONAL TOWER projecting upward
 *     from the bend (matches the floor plan where the Turmstube sits
 *     at the corner)
 *   - Hipped slate roofs on both wings (4-sided pyramid approximation)
 *   - Tower has its OWN small hipped roof (octagonal pyramid) before
 *     the lantern, just like the real one
 *   - Octagonal LANTERN in cream plaster with four arched window
 *     openings inset
 *   - Slim terracotta cornice between lantern and helm
 *   - Doppelzwiebel uses the existing profile (lower bulb, neck,
 *     upper bulb, spire — see profile.ts)
 *
 * Coordinate system (WORLD):
 *   Wing A — long facade running east-west, center (5, h/2, 1)
 *   Wing B — short facade running north-south, center (1.75, h/2, -2.5)
 *   Tower  — octagonal at the L's outer corner (3.5, t/2, -0.75)
 */
export function P48Scene({ progress = 0 }: P48SceneProps) {
  const isMobile = useIsMobile();

  // R3F's resize observer occasionally captures 0×0 dimensions when its
  // parent is `position: sticky` inside a lazy-loaded Suspense boundary,
  // leaving the canvas stuck at the 300×150 HTML default. Forcing a
  // window resize after mount makes R3F re-measure the parent. Cheap.
  useEffect(() => {
    const ts = [50, 200, 600].map((d) =>
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), d),
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <Canvas
      camera={{ position: [2, 18, 0.5], fov: 38 }}
      dpr={[1, isMobile ? 1.4 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.45} color="#fff5e8" />
      <directionalLight
        position={[12, 18, 8]}
        color="#ffe6c0"
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
      <directionalLight position={[-8, 6, -8]} color="#a0b8d0" intensity={0.45} />
      <pointLight position={[3, 12, 8]} color="#ffd9a8" intensity={0.45} />

      <Suspense fallback={null}>
        <Environment preset="apartment" background={false} environmentIntensity={0.4} />
      </Suspense>

      <CameraRig progress={progress} />

      <Building progress={progress} isMobile={isMobile} />
    </Canvas>
  );
}

/**
 * Camera lerps from top-down (progress=0) to oblique street-view
 * (progress=1). Lookat tracks the building's mass-center, then drifts
 * upward to frame the helm at the climax.
 */
function CameraRig({ progress }: { progress: number }) {
  useFrame((state) => {
    const cam = state.camera;
    const targetY = MathUtils.lerp(22, 8.5, progress);
    const targetZ = MathUtils.lerp(0.5, 16, progress);
    const targetX =
      MathUtils.lerp(2, 7, progress) +
      Math.sin(state.clock.elapsedTime * 0.18) * progress * 0.6;
    cam.position.x = MathUtils.lerp(cam.position.x, targetX, 0.05);
    cam.position.y = MathUtils.lerp(cam.position.y, targetY, 0.05);
    cam.position.z = MathUtils.lerp(cam.position.z, targetZ, 0.05);
    cam.lookAt(2.5, MathUtils.lerp(0, 6, progress), 0);
  });
  return null;
}

interface BuildingProps {
  progress: number;
  isMobile: boolean;
}

/* ─── Color palette (matching real-building photos) ────────────────── */
const FACADE_LIGHT = '#ede0c8'; // cream plaster — matches the photo
const FACADE_LANTERN = '#f0e6d2'; // lantern is whiter than wing facade
const ROOF_SLATE = '#2c2c30'; // very dark slate, slight blue
const CORNICE_TERRACOTTA = '#c44e2c';
const CORNICE_STONE = '#d6c9b0'; // lighter stone band
const ARCH_DARK = '#1a1612'; // dark to suggest the arched window openings

function Building({ progress, isMobile }: BuildingProps) {
  const groupRef = useRef<Group>(null);

  const buildPhase = MathUtils.clamp(progress / 0.35, 0, 1);
  const helmPhase = MathUtils.clamp((progress - 0.35) / 0.35, 0, 1);
  const hotspotPhase = MathUtils.clamp((progress - 0.7) / 0.3, 0, 1);

  // Heights tuned to match Munich Gründerzeit proportions: ~5 floors
  // visible above ground + tower extending ~2 floors above main roof.
  const wingHeight = buildPhase * 5.0;
  const towerHeight = buildPhase * 7.0;
  const helmScale = helmPhase * 0.50;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.04 * progress * delta;
  });

  // Y-positions for stacked elements (depend on towerHeight)
  const towerRoofY = towerHeight + 0.35;
  const lanternBaseY = towerHeight + 0.75;
  const lanternTopY = lanternBaseY + 0.95;
  const helmBaseY = lanternTopY + 0.05;

  return (
    <group ref={groupRef}>
      {/* Ground reference — subtle disc beneath the building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.01, -1]} receiveShadow>
        <ringGeometry args={[0, 16, 64]} />
        <meshBasicMaterial color="#0d0d0c" transparent opacity={0.42} />
      </mesh>

      {/* ─── Wing A — long horizontal block ─────────────────────────── */}
      {wingHeight > 0.001 ? (
        <mesh position={[5, wingHeight / 2, 1]} castShadow receiveShadow>
          <boxGeometry args={[9, wingHeight, 3.5]} />
          <meshStandardMaterial color={FACADE_LIGHT} roughness={0.78} metalness={0.0} />
        </mesh>
      ) : null}

      {/* ─── Wing B — perpendicular block ───────────────────────────── */}
      {wingHeight > 0.001 ? (
        <mesh position={[1.75, wingHeight / 2, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[3.5, wingHeight, 6.5]} />
          <meshStandardMaterial color={FACADE_LIGHT} roughness={0.78} metalness={0.0} />
        </mesh>
      ) : null}

      {/* ─── Floor cornice bands — slim stone strips at floor levels ── */}
      {wingHeight > 1.5 ? (
        <>
          {/* Wing A bands at heights ~h*0.4 and ~h*0.75 */}
          <mesh position={[5, wingHeight * 0.4, 1]}>
            <boxGeometry args={[9.04, 0.06, 3.54]} />
            <meshStandardMaterial color={CORNICE_STONE} roughness={0.7} metalness={0.0} />
          </mesh>
          <mesh position={[5, wingHeight * 0.75, 1]}>
            <boxGeometry args={[9.04, 0.06, 3.54]} />
            <meshStandardMaterial color={CORNICE_STONE} roughness={0.7} metalness={0.0} />
          </mesh>
          <mesh position={[1.75, wingHeight * 0.4, -2.5]}>
            <boxGeometry args={[3.54, 0.06, 6.54]} />
            <meshStandardMaterial color={CORNICE_STONE} roughness={0.7} metalness={0.0} />
          </mesh>
          <mesh position={[1.75, wingHeight * 0.75, -2.5]}>
            <boxGeometry args={[3.54, 0.06, 6.54]} />
            <meshStandardMaterial color={CORNICE_STONE} roughness={0.7} metalness={0.0} />
          </mesh>
        </>
      ) : null}

      {/* ─── Top cornice ring — terracotta accent at attic level ────── */}
      {wingHeight > 1 ? (
        <>
          <mesh position={[5, wingHeight + 0.05, 1]}>
            <boxGeometry args={[9.2, 0.10, 3.7]} />
            <meshStandardMaterial color={CORNICE_TERRACOTTA} roughness={0.55} metalness={0.05} />
          </mesh>
          <mesh position={[1.75, wingHeight + 0.05, -2.5]}>
            <boxGeometry args={[3.7, 0.10, 6.7]} />
            <meshStandardMaterial color={CORNICE_TERRACOTTA} roughness={0.55} metalness={0.05} />
          </mesh>
        </>
      ) : null}

      {/* ─── Hipped roofs — stretched 4-sided pyramids ──────────────── */}
      {wingHeight > 1 ? (
        <>
          {/* Wing A roof — ridge along X axis */}
          <mesh
            position={[5, wingHeight + 0.6, 1]}
            rotation={[0, Math.PI / 4, 0]}
            scale={[1.7, 1, 0.7]}
            castShadow
          >
            <coneGeometry args={[2.6, 1.0, 4]} />
            <meshStandardMaterial color={ROOF_SLATE} roughness={0.55} metalness={0.18} />
          </mesh>
          {/* Wing B roof — ridge along Z axis */}
          <mesh
            position={[1.75, wingHeight + 0.55, -2.5]}
            rotation={[0, Math.PI / 4, 0]}
            scale={[0.7, 1, 1.4]}
            castShadow
          >
            <coneGeometry args={[2.5, 1.0, 4]} />
            <meshStandardMaterial color={ROOF_SLATE} roughness={0.55} metalness={0.18} />
          </mesh>
        </>
      ) : null}

      {/* ─── OCTAGONAL TOWER — projects up from the L's bend corner ─── */}
      {towerHeight > 0.001 ? (
        <mesh position={[3.5, towerHeight / 2, -0.75]} castShadow receiveShadow>
          {/* 8-segment cylinder = octagonal prism. Slight taper top. */}
          <cylinderGeometry args={[1.45, 1.55, towerHeight, 8]} />
          <meshStandardMaterial color={FACADE_LIGHT} roughness={0.78} metalness={0.0} />
        </mesh>
      ) : null}

      {/* Tower's mid cornice (above wing roof level) */}
      {towerHeight > 5.5 ? (
        <mesh position={[3.5, wingHeight + 0.05, -0.75]}>
          <cylinderGeometry args={[1.55, 1.55, 0.10, 8]} />
          <meshStandardMaterial color={CORNICE_STONE} roughness={0.7} metalness={0.0} />
        </mesh>
      ) : null}

      {/* Tower top cornice (just below the helm assembly) */}
      {helmScale > 0.001 ? (
        <mesh position={[3.5, towerHeight + 0.06, -0.75]}>
          <cylinderGeometry args={[1.6, 1.6, 0.12, 8]} />
          <meshStandardMaterial color={CORNICE_TERRACOTTA} roughness={0.55} metalness={0.05} />
        </mesh>
      ) : null}

      {/* ─── Tower hipped roof — small octagonal pyramid ────────────── */}
      {helmScale > 0.001 ? (
        <mesh position={[3.5, towerRoofY, -0.75]} castShadow>
          <coneGeometry args={[1.5, 0.6, 8]} />
          <meshStandardMaterial color={ROOF_SLATE} roughness={0.55} metalness={0.18} />
        </mesh>
      ) : null}

      {/* ─── LANTERN — octagonal cream drum with arched openings ──── */}
      {helmScale > 0.001 ? (
        <group position={[3.5, lanternBaseY + 0.475, -0.75]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.05, 1.05, 0.95, 8]} />
            <meshStandardMaterial color={FACADE_LANTERN} roughness={0.72} metalness={0.0} />
          </mesh>
          {/* Four arched window openings — small dark inset boxes around
              the lantern at cardinal directions, suggesting the arches.
              Each is a thin tall plane positioned just inside the
              cylinder's surface at radius 1.0. */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2 + Math.PI / 8; // offset to face the corners
            const x = Math.sin(angle) * 1.02;
            const z = Math.cos(angle) * 1.02;
            const ry = angle;
            return (
              <mesh key={i} position={[x, 0, z]} rotation={[0, ry, 0]}>
                <boxGeometry args={[0.42, 0.6, 0.04]} />
                <meshStandardMaterial color={ARCH_DARK} roughness={0.4} metalness={0.0} />
              </mesh>
            );
          })}
        </group>
      ) : null}

      {/* ─── Lantern top cornice — slim terracotta ring ─────────────── */}
      {helmScale > 0.001 ? (
        <mesh position={[3.5, lanternTopY, -0.75]} castShadow>
          <cylinderGeometry args={[1.12, 1.12, 0.08, 8]} />
          <meshStandardMaterial color={CORNICE_TERRACOTTA} roughness={0.5} metalness={0.05} />
        </mesh>
      ) : null}

      {/* ─── Doppelzwiebel — sits on the lantern cornice ───────────── */}
      {helmScale > 0.001 ? (
        <group position={[3.5, helmBaseY, -0.75]} scale={helmScale}>
          <Doppelzwiebel
            morph={1}
            edgesOpacity={0.22}
            segments={isMobile ? 32 : 56}
          />
        </group>
      ) : null}

      {/* Hotspots — fade in during phase 3 */}
      {hotspotPhase > 0.05 ? (
        <Hotspots opacity={hotspotPhase} towerHeight={towerHeight} />
      ) : null}
    </group>
  );
}

interface HotspotData {
  position: [number, number, number];
  label: string;
  detail: string;
}

function Hotspots({ opacity, towerHeight }: { opacity: number; towerHeight: number }) {
  const hotspots: HotspotData[] = useMemo(
    () => [
      {
        position: [5.0, 1.5, 2.4],
        label: 'Wohnhalle',
        detail: 'Zweigeschossig · mit Galerie',
      },
      {
        position: [5.0, 3.5, 2.4],
        label: 'Galerie',
        detail: 'Mezzanine, frontal zur Frauenkirche',
      },
      {
        position: [3.5, towerHeight - 0.6, 0.6],
        label: 'Turmstube',
        detail: 'Unter der Doppelzwiebel',
      },
    ],
    [towerHeight],
  );

  return (
    <group>
      {hotspots.map((h) => (
        <Hotspot key={h.label} {...h} opacity={opacity} />
      ))}
    </group>
  );
}

function Hotspot({
  position,
  label,
  detail,
  opacity,
}: HotspotData & { opacity: number }) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const target = useMemo(() => new Vector3(...position), [position]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.lerp(target, 0.1);
  });

  return (
    <group ref={ref} position={position}>
      <Html
        center
        distanceFactor={10}
        style={{
          pointerEvents: 'auto',
          opacity,
          transition: 'opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <button
          type="button"
          className="p48-hotspot"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 14px 8px 8px',
            borderRadius: 999,
            border: '1px solid rgba(196, 78, 44, 0.55)',
            background: hovered ? 'rgba(196, 78, 44, 0.92)' : 'rgba(13, 13, 12, 0.78)',
            color: hovered ? '#f4ede0' : '#e89978',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            transition: 'background-color 240ms, color 240ms',
            whiteSpace: 'nowrap',
          }}
          aria-label={`${label} · ${detail}`}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#c44e2c',
              boxShadow: '0 0 0 4px rgba(196, 78, 44, 0.18)',
              flexShrink: 0,
            }}
          />
          <span>{label}</span>
          <span
            style={{
              opacity: hovered ? 1 : 0,
              maxWidth: hovered ? 240 : 0,
              overflow: 'hidden',
              transition: 'opacity 240ms, max-width 240ms',
              fontStyle: 'italic',
              fontFamily: 'var(--serif)',
              fontSize: 13,
              letterSpacing: 0,
              textTransform: 'none',
            }}
          >
            {detail}
          </span>
        </button>
      </Html>
    </group>
  );
}
