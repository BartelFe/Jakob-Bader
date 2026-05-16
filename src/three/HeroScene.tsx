import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Group, MathUtils, PointLight, Vector3 } from 'three';

import { Doppelzwiebel } from './Doppelzwiebel';
import { HEIGHT } from './profile';

interface HeroSceneProps {
  /** Locked at 1 — kept for back-compat with old call sites. */
  morph?: number;
  /** 0..1 scroll-tied camera dive. */
  cameraProgress?: number;
  edgesOpacity?: number;
  isMobile?: boolean;
}

/**
 * Hero scene v4 — helm + supporting structure.
 *
 * Felix's note: previous WebGL hero had the right *feel* but the
 * helm was floating in space and proportions were off. This version:
 *   - Fixes proportions in profile.ts (traced from p48-schnitt.jpg)
 *   - Adds the supporting context: small slate roof platform under the
 *     helm + two cream-plaster gable peaks flanking it. The helm now
 *     sits ON SOMETHING instead of hanging in dark void.
 *   - Camera framing widens to show the whole composition at the
 *     beginning, then dives in at the end of the scroll.
 */
export function HeroScene({
  morph = 1,
  cameraProgress = 0,
  edgesOpacity = 0.18,
  isMobile = false,
}: HeroSceneProps) {
  // Defensive resize trigger — see P48Scene for rationale.
  useEffect(() => {
    const ts = [50, 200].map((d) =>
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), d),
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 38 }}
      dpr={[1, isMobile ? 1.4 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      <DiveCamera morph={cameraProgress} />

      <ambientLight intensity={0.16} color="#ffffff" />
      <directionalLight
        position={[6, 9, 7]}
        color="#ffd9a8"
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={50}
      />
      <pointLight position={[-5, -1, 4]} color="#6c8aa8" intensity={0.55} />
      <CursorReactiveLight basePosition={[0, 4, -8]} color="#ffffff" intensity={0.5} />

      <Suspense fallback={null}>
        <Environment preset="city" background={false} environmentIntensity={0.7} />
      </Suspense>

      <CursorReactiveGroup>
        <HelmComposition
          morph={morph}
          edgesOpacity={edgesOpacity}
          isMobile={isMobile}
        />
      </CursorReactiveGroup>
    </Canvas>
  );
}

/**
 * The helm + the architectural context underneath: a slate roof slab,
 * a small octagonal cap directly under the helm pedestal, and two
 * cream-plaster gable peaks flanking the helm.
 *
 * Coordinate system (group origin = base of pedestal at world (0,0,0)):
 *   Helm lathe spans local Y from 0 to HEIGHT (10 units tall).
 *   Pedestal (lathe segment 0–11%) sits on the small cap below.
 *   Gable peaks rise to ~5 units tall, flanking the helm at ±2.8 units.
 *   Roof slab is wide and thin, slightly below the gables' base.
 */
function HelmComposition({
  morph,
  edgesOpacity,
  isMobile,
}: {
  morph: number;
  edgesOpacity: number;
  isMobile: boolean;
}) {
  return (
    <group position={[0, -HEIGHT / 2, 0]}>
      {/* The helm itself — sculptural, no surrounding building geometry */}
      <group position={[0, HEIGHT / 2, 0]}>
        <Doppelzwiebel
          morph={morph}
          edgesOpacity={edgesOpacity}
          segments={isMobile ? 48 : 80}
        />
      </group>

      {/* Subtle ground reflection — suggests the helm sits on SOMETHING
          without committing to a literal roof. Dark, semi-metallic,
          fading at the edges via the circle geometry. */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color="#1a1612"
          metalness={0.4}
          roughness={0.75}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * Camera trajectory tied to scroll progress 0..1 with widened framing.
 *
 *   0.00–0.40 — wide observation @ (0, 1, 24): full helm + gables + roof
 *   0.40–0.75 — recognition @ (0, 2.5, 16) looking at center
 *   0.75–1.00 — dive @ (0, 4.5, 8) looking at upper bulb
 */
function DiveCamera({ morph }: { morph: number }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new Vector3(), []);
  const targetPos = useMemo(() => new Vector3(), []);
  const targetLook = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const wRecognize = MathUtils.clamp((morph - 0.40) / 0.35, 0, 1);
    const wDive = MathUtils.clamp((morph - 0.75) / 0.25, 0, 1);

    const py = 0 + (2.0 - 0) * wRecognize + (4.0 - 2.0) * wDive;
    const pz = 18 + (12 - 18) * wRecognize + (7 - 12) * wDive;
    targetPos.set(0, py, pz);

    const ly = 0.5 + (2.0 - 0.5) * wRecognize + (4.5 - 2.0) * wDive;
    targetLook.set(0, ly, 0);

    camera.position.lerp(targetPos, 0.08);
    lookAt.lerp(targetLook, 0.08);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
  });

  return null;
}

function CursorReactiveGroup({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientY / window.innerHeight - 0.5) * 0.18;
      const y = (e.clientX / window.innerWidth - 0.5) * 0.22;
      target.current = { x, y };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      target.current.x,
      0.06,
    );
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      target.current.y * 0.4,
      0.06,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

function CursorReactiveLight({
  basePosition,
  color,
  intensity,
}: {
  basePosition: [number, number, number];
  color: string;
  intensity: number;
}) {
  const lightRef = useRef<PointLight>(null);
  const base = useMemo(() => new Vector3(...basePosition), [basePosition]);
  const target = useRef(new Vector3(...basePosition));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 4;
      const y = -(e.clientY / window.innerHeight - 0.5) * 4;
      target.current.set(base.x + x, base.y + y, base.z);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [base]);

  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.position.lerp(target.current, 0.05);
  });

  return <pointLight ref={lightRef} position={base} color={color} intensity={intensity} />;
}

export function useIsMobile(breakpoint = 720): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}
