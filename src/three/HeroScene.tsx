import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Group, MathUtils, PointLight, Vector3 } from 'three';

import { Doppelzwiebel } from './Doppelzwiebel';

interface HeroSceneProps {
  /** 0..1 — locked at 1 in the new hero (no morph). Kept for back-compat. */
  morph?: number;
  /** 0..1 — drives the camera dive trajectory. */
  cameraProgress?: number;
  /** Edge-line opacity (loader fades from 0 → 0.18). */
  edgesOpacity?: number;
  /** Reduced lathe density on mobile. */
  isMobile?: boolean;
}

/**
 * Hero scene — Canvas + 3-point lighting + cursor-reactive group.
 *
 * The morph value drives BOTH the lathe shape AND a scroll-tied camera
 * dive: at morph=0 we see the doppelzwiebel from afar; at morph=1 the
 * camera is close to the spire, looking up at the cross. Felt like
 * "diving into the tower" per Felix's brief.
 */
export function HeroScene({
  morph = 1,
  cameraProgress = 0,
  edgesOpacity = 0.18,
  isMobile = false,
}: HeroSceneProps) {
  // Defensive resize trigger — see P48Scene for rationale. Cheap insurance
  // against R3F mounting before its parent's sticky height is computed.
  useEffect(() => {
    const ts = [50, 200].map((d) =>
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), d),
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <Canvas
      // Initial camera — DiveCamera takes over on first frame
      camera={{ position: [0, 0, 22], fov: 38 }}
      dpr={[1, isMobile ? 1.4 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
    >
      <DiveCamera morph={cameraProgress} />

      <ambientLight intensity={0.14} color="#ffffff" />
      <directionalLight
        position={[5, 8, 6]}
        color="#ffd9a8"
        intensity={1.3}
        castShadow={false}
      />
      <pointLight position={[-5, -2, 4]} color="#6c8aa8" intensity={0.55} />
      <CursorReactiveLight basePosition={[0, 4, -8]} color="#ffffff" intensity={0.5} />

      {/* HDRI environment for subtle aged-zinc reflections. */}
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} environmentIntensity={0.55} />
      </Suspense>

      <CursorReactiveGroup>
        <Doppelzwiebel
          morph={morph}
          edgesOpacity={edgesOpacity}
          segments={isMobile ? 48 : 80}
        />
      </CursorReactiveGroup>
    </Canvas>
  );
}

/**
 * Three-phase camera trajectory tied to morph progress 0..1:
 *
 *   morph 0.00–0.40  — wide observation @ (0, 0, 20), looks at center.
 *   morph 0.40–0.75  — recognition lerp to (0, 1.5, 13) looking slightly
 *                      up — the helm fills more of the frame.
 *   morph 0.75–1.00  — dive lerp to (0, 2.8, 8) looking at (0, 4.5, 0).
 *                      Frame composition: upper bulb + lantern + spire +
 *                      cross all visible. Felt cinematic without the
 *                      camera being so close that we lose the silhouette.
 *
 * v2 review (post-video): Phase 3 anchor was z=4.5 which zoomed the
 * camera too close to the spire — at the climax the lathe filled almost
 * none of the frame and we saw a tiny line. v3 pulls back to z=8 so the
 * climax shows the helm's full upper portion in glory.
 */
function DiveCamera({ morph }: { morph: number }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new Vector3(), []);
  const targetPos = useMemo(() => new Vector3(), []);
  const targetLook = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const wRecognize = MathUtils.clamp((morph - 0.40) / 0.35, 0, 1);
    const wDive = MathUtils.clamp((morph - 0.75) / 0.25, 0, 1);

    // Phase 1 anchor: (0, 0, 20)
    // Phase 2 anchor: (0, 1.5, 13)
    // Phase 3 anchor: (0, 2.8, 8)
    const px = 0;
    const py = 0 + (1.5 - 0) * wRecognize + (2.8 - 1.5) * wDive;
    const pz = 20 + (13 - 20) * wRecognize + (8 - 13) * wDive;
    targetPos.set(px, py, pz);

    // Phase 1 look: (0, 0, 0)
    // Phase 2 look: (0, 1.0, 0)
    // Phase 3 look: (0, 4.5, 0) — at upper bulb / spire base
    const lx = 0;
    const ly = 0 + (1.0 - 0) * wRecognize + (4.5 - 1.0) * wDive;
    targetLook.set(lx, ly, 0);

    camera.position.lerp(targetPos, 0.08);
    lookAt.lerp(targetLook, 0.08);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
  });

  return null;
}

/**
 * Group that lerps a small cursor-driven X/Y rotation on top of the
 * Doppelzwiebel's own idle Y-rotation. Subtle — clamped to ±0.18 rad.
 */
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
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, target.current.x, 0.06);
    // Note: Y is owned by the inner Doppelzwiebel's idle rotation. We add cursor offset only.
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      target.current.y * 0.4,
      0.06,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Rim light whose position follows the cursor with lerp damping.
 * Amplitude clamped to ±2 units per brief §8.
 */
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
      const x = (e.clientX / window.innerWidth - 0.5) * 4; // ±2
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

// Lightweight viewport-width hook for mobile dpr / segment downgrade.
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
