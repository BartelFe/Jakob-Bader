import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EdgesGeometry,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  MeshStandardMaterial,
  Vector2,
} from 'three';

import { HEIGHT, morphProfile } from './profile';

interface DoppelzwiebelProps {
  /** 0 = cone (1924 reduced) · 0.5 = onion · 1 = doppelzwiebel (1890/2025) */
  morph?: number;
  /** Lathe segment count — high desktop, capped on mobile. */
  segments?: number;
  /** Edge-line opacity (0..1). Faded in by the loader's reveal phase. */
  edgesOpacity?: number;
  /** Optional sweep angle in radians for loader's "build live" effect (default: full circle). */
  phiLength?: number;
  /** Show the spire's cross finial. */
  withCross?: boolean;
}

/**
 * The doppelzwiebel itself.
 *
 * Two materials:
 *   1. MeshStandardMaterial — aged zinc, dark anthracite + warm metalness
 *   2. LineSegments via EdgesGeometry — warm-gold falz suggestions
 *
 * The lathe is centered so its visual mid-point sits at world-y=0.
 */
export function Doppelzwiebel({
  morph = 1,
  segments = 72,
  edgesOpacity = 0.18,
  phiLength = Math.PI * 2,
  withCross = true,
}: DoppelzwiebelProps) {
  const groupRef = useRef<Group>(null);

  // Profile + LatheGeometry rebuild on morph or segments change.
  const { lathe, edges, edgesMaterial, latheMaterial } = useMemo(() => {
    const points = morphProfile(morph).map(([x, y]) => new Vector2(x, y));
    const latheGeo = new LatheGeometry(points, segments, 0, phiLength);
    latheGeo.computeVertexNormals();
    const edgesGeo = new EdgesGeometry(latheGeo, 8);
    const mat = new MeshStandardMaterial({
      color: '#2a2826',
      metalness: 0.78,
      roughness: 0.42,
      flatShading: false,
    });
    const lineMat = new LineBasicMaterial({
      color: '#c9b896',
      transparent: true,
      opacity: edgesOpacity,
    });
    return { lathe: latheGeo, edges: edgesGeo, edgesMaterial: lineMat, latheMaterial: mat };
    // edgesOpacity intentionally NOT a dep — set imperatively below to avoid geo rebuild
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morph, segments, phiLength]);

  // Update edge opacity without rebuilding geometry.
  useEffect(() => {
    edgesMaterial.opacity = edgesOpacity;
  }, [edgesMaterial, edgesOpacity]);

  // Dispose on unmount.
  useEffect(() => {
    return () => {
      lathe.dispose();
      edges.dispose();
      latheMaterial.dispose();
      edgesMaterial.dispose();
    };
  }, [lathe, edges, latheMaterial, edgesMaterial]);

  // Slow idle Y-rotation + subtle floating sine.
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.18 * delta;
    groupRef.current.position.y =
      MathUtils.lerp(
        groupRef.current.position.y,
        Math.sin(state.clock.elapsedTime * 0.6) * 0.04 - HEIGHT / 2,
        0.08,
      );
  });

  return (
    <group ref={groupRef} position={[0, -HEIGHT / 2, 0]}>
      <mesh geometry={lathe} material={latheMaterial} castShadow receiveShadow />
      <primitive
        object={new LineSegments(edges, edgesMaterial)}
        // Tiny outward scale so edges never z-fight with the surface.
        scale={[1.0008, 1.0008, 1.0008]}
      />
      {withCross && morph > 0.4 ? <SpireCross y={HEIGHT - 0.05} /> : null}
    </group>
  );
}

/**
 * Tiny cross finial above the doppelzwiebel — two thin orthogonal boxes.
 * Renders only when morph is past the cone state (>0.4) so the cone keyframe
 * stays bare (it lost its cross historically).
 */
function SpireCross({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[0.04, 0.55, 0.04]} />
        <meshStandardMaterial color="#c9b896" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.32, 0.04, 0.04]} />
        <meshStandardMaterial color="#c9b896" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}
