import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
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
 * Plan-zu-Volumen choreography:
 *   progress 0.00–0.35 — building extrudes upward (wings + tower)
 *   progress 0.35–0.70 — tambour + doppelzwiebel scale in atop the tower
 *   progress 0.70–1.00 — camera tilts oblique, hotspots fade in
 *
 * Coordinate system: corner of the L-shape sits near origin.
 *   Wing A runs along +X (8 long, 3 deep)
 *   Wing B runs along -Z (5 long, 3 wide)
 *   Tower sits at the inner corner (2.4 × 2.4)
 */
export function P48Scene({ progress = 0 }: P48SceneProps) {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [0, 14, 14], fov: 38 }}
      dpr={[1, isMobile ? 1.4 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.32} color="#fff8ee" />
      <directionalLight position={[8, 12, 6]} color="#ffe7c4" intensity={1.4} />
      <directionalLight position={[-6, 6, -4]} color="#7a92ad" intensity={0.45} />
      <pointLight position={[2, 8, 8]} color="#ffd9a8" intensity={0.9} />

      <CameraRig progress={progress} />

      <Building progress={progress} isMobile={isMobile} />
    </Canvas>
  );
}

/**
 * Camera lerps from top-down (progress=0) to oblique (progress=1).
 * Stops orbiting at progress=1 — replaced by a slow lateral drift.
 */
function CameraRig({ progress }: { progress: number }) {
  useFrame((state) => {
    const cam = state.camera;
    // Top-down position: y high, z near 0
    // Oblique: y moderate, z back
    const targetY = MathUtils.lerp(18, 6.5, progress);
    const targetZ = MathUtils.lerp(0.5, 14, progress);
    const targetX = MathUtils.lerp(2, 6, progress) + Math.sin(state.clock.elapsedTime * 0.18) * progress * 0.6;
    cam.position.x = MathUtils.lerp(cam.position.x, targetX, 0.05);
    cam.position.y = MathUtils.lerp(cam.position.y, targetY, 0.05);
    cam.position.z = MathUtils.lerp(cam.position.z, targetZ, 0.05);
    cam.lookAt(2, MathUtils.lerp(0, 4, progress), 0);
  });
  return null;
}

interface BuildingProps {
  progress: number;
  isMobile: boolean;
}

function Building({ progress, isMobile }: BuildingProps) {
  const groupRef = useRef<Group>(null);

  // Choreography: split progress into named phases
  const buildPhase = MathUtils.clamp(progress / 0.35, 0, 1); // 0..0.35
  const helmPhase = MathUtils.clamp((progress - 0.35) / 0.35, 0, 1); // 0.35..0.70
  const hotspotPhase = MathUtils.clamp((progress - 0.7) / 0.3, 0, 1); // 0.7..1.0

  const wingHeight = buildPhase * 4.4;
  const towerHeight = buildPhase * 6.4;
  const helmScale = helmPhase * 0.32;

  // Slow Y rotation of the whole scene only after assembly is "done"
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.05 * progress * delta;
  });

  return (
    <group ref={groupRef}>
      {/* Ground reference — subtle disc that the building sits on */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.01, -1.5]} receiveShadow>
        <ringGeometry args={[0, 14, 64]} />
        <meshBasicMaterial color="#0d0d0c" transparent opacity={0.42} />
      </mesh>

      {/* Wing A — runs along +X */}
      {wingHeight > 0.001 ? (
        <mesh position={[4, wingHeight / 2, 0.5]} castShadow>
          <boxGeometry args={[7.2, wingHeight, 3.2]} />
          <meshStandardMaterial color="#bdaf99" roughness={0.86} metalness={0.06} />
        </mesh>
      ) : null}

      {/* Wing B — runs along -Z */}
      {wingHeight > 0.001 ? (
        <mesh position={[-0.4, wingHeight / 2, -3]} castShadow>
          <boxGeometry args={[3, wingHeight, 5.2]} />
          <meshStandardMaterial color="#b3a691" roughness={0.86} metalness={0.06} />
        </mesh>
      ) : null}

      {/* Tower at the inner corner — taller than wings */}
      {towerHeight > 0.001 ? (
        <mesh position={[0.6, towerHeight / 2, 0.6]} castShadow>
          <boxGeometry args={[2.6, towerHeight, 2.6]} />
          <meshStandardMaterial color="#a89c87" roughness={0.86} metalness={0.06} />
        </mesh>
      ) : null}

      {/* Cornice ring at top of wings — terracotta hint */}
      {wingHeight > 1 ? (
        <>
          <mesh position={[4, wingHeight + 0.05, 0.5]}>
            <boxGeometry args={[7.4, 0.12, 3.4]} />
            <meshStandardMaterial color="#c44e2c" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[-0.4, wingHeight + 0.05, -3]}>
            <boxGeometry args={[3.2, 0.12, 5.4]} />
            <meshStandardMaterial color="#c44e2c" roughness={0.6} metalness={0.1} />
          </mesh>
        </>
      ) : null}

      {/* Pyramidal roof on long wing */}
      {wingHeight > 1 ? (
        <mesh position={[4, wingHeight + 0.7, 0.5]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[3.6, 1.2, 4]} />
          <meshStandardMaterial color="#3a312a" roughness={0.65} metalness={0.18} />
        </mesh>
      ) : null}

      {/* Hipped block on short wing */}
      {wingHeight > 1 ? (
        <mesh position={[-0.4, wingHeight + 0.55, -3]}>
          <boxGeometry args={[3.1, 1.1, 5.3]} />
          <meshStandardMaterial color="#3a312a" roughness={0.65} metalness={0.18} />
        </mesh>
      ) : null}

      {/* Tambour (drum) on top of tower */}
      {helmScale > 0.001 ? (
        <mesh position={[0.6, towerHeight + 0.4, 0.6]}>
          <cylinderGeometry args={[1.35, 1.5, 0.8, 32]} />
          <meshStandardMaterial color="#7a6f5e" metalness={0.3} roughness={0.6} />
        </mesh>
      ) : null}

      {/* Doppelzwiebel — reused from the hero! */}
      {helmScale > 0.001 ? (
        <group position={[0.6, towerHeight + 0.85, 0.6]} scale={helmScale}>
          <Doppelzwiebel morph={1} edgesOpacity={0.22} segments={isMobile ? 32 : 56} />
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
        position: [4.0, 1.2, 1.7],
        label: 'Wohnhalle',
        detail: 'Zweigeschossig · mit Galerie',
      },
      {
        position: [4.0, 3.0, 1.7],
        label: 'Galerie',
        detail: 'Mezzanine, frontal zur Frauenkirche',
      },
      {
        position: [0.6, towerHeight - 0.6, 1.9],
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
