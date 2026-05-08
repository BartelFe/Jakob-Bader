import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Group, MathUtils, PointLight, Vector3 } from 'three';

import { Doppelzwiebel } from './Doppelzwiebel';

interface HeroSceneProps {
  /** 0..1 — drives the cone → onion → doppelzwiebel morph. */
  morph?: number;
  /** Edge-line opacity (loader fades from 0 → 0.18). */
  edgesOpacity?: number;
  /** Reduced lathe density on mobile. */
  isMobile?: boolean;
}

/**
 * Hero scene — Canvas + 3-point lighting + cursor-reactive group.
 *
 * Position right-of-center so headline can sit on the left.
 * Camera fov 35deg, slight downward tilt.
 */
export function HeroScene({ morph = 1, edgesOpacity = 0.18, isMobile = false }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 35 }}
      dpr={[1, isMobile ? 1.4 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.12} color="#ffffff" />
      <directionalLight
        position={[5, 8, 6]}
        color="#ffd9a8"
        intensity={1.2}
        castShadow={false}
      />
      <pointLight position={[-5, -2, 4]} color="#6c8aa8" intensity={0.55} />
      <CursorReactiveLight basePosition={[0, 4, -8]} color="#ffffff" intensity={0.5} />

      {/* HDRI environment for subtle aged-zinc reflections.
          'studio' is clean + neutral — keeps the doppelzwiebel readable
          against our dark editorial backdrop. background={false} means
          it contributes only to lighting/reflections, not visible sky. */}
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} environmentIntensity={0.6} />
      </Suspense>

      <CursorReactiveGroup>
        <Doppelzwiebel
          morph={morph}
          edgesOpacity={edgesOpacity}
          segments={isMobile ? 32 : 72}
        />
      </CursorReactiveGroup>
    </Canvas>
  );
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
