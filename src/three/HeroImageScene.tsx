import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { prefersReducedMotion } from '@/lib/webgl';

import { ParticleField } from './ParticleField';
import styles from './HeroImageScene.module.css';

interface HeroImageSceneProps {
  /** 0..1 scroll progress through the hero — drives scale + fade out. */
  cameraProgress?: number;
  /** Reduce particle count and disable mouse parallax on mobile. */
  isMobile?: boolean;
}

const HELM_SRC = '/doppelzwiebel.png';

/**
 * Image-driven atmospheric hero (v4 refactor). Replaces the WebGL helm
 * on the landing page with a static PNG embedded in 8 layered effects:
 * vignette · skyline · cloud · helm · glints · reflection · glow · particles.
 * The 3D helm still lives in HeroScene.tsx and is used by P48Scene.
 */
export function HeroImageScene({
  cameraProgress = 0,
  isMobile = false,
}: HeroImageSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const helmRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glintsRef = useRef<SVGSVGElement>(null);

  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouse = useRef({ x: 0.5, y: 0.5 });

  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isMobile]);

  useEffect(() => {
    if (reduceMotion.current) return;

    let raf = 0;
    let tick = 0;

    const animate = () => {
      tick++;

      mousePos.current.x += (targetMouse.current.x - mousePos.current.x) * 0.06;
      mousePos.current.y += (targetMouse.current.y - mousePos.current.y) * 0.06;

      const float = Math.sin(tick * 0.012) * 6;
      const helmX = (mousePos.current.x - 0.5) * (isMobile ? 0 : 14);
      const helmY = (mousePos.current.y - 0.5) * (isMobile ? 0 : 8) + float;
      if (helmRef.current) {
        helmRef.current.style.transform = `translate3d(${helmX}px, ${helmY}px, 0)`;
      }

      if (cloudRef.current && !isMobile) {
        const cx = (mousePos.current.x - 0.5) * 22;
        const cy = (mousePos.current.y - 0.5) * 12;
        cloudRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }

      if (skylineRef.current && !isMobile) {
        const sx = (mousePos.current.x - 0.5) * 5;
        skylineRef.current.style.transform = `translate3d(${sx}px, 0, 0)`;
      }

      if (glowRef.current && !isMobile) {
        const gx = mousePos.current.x * 100;
        const gy = mousePos.current.y * 100;
        glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 200, 140, 0.18) 0%, rgba(255, 180, 120, 0.08) 18%, rgba(255, 180, 120, 0) 42%)`;
      }

      if (glintsRef.current) {
        const driftX = Math.sin(tick * 0.005) * 30;
        const driftY = Math.cos(tick * 0.004) * 20;
        glintsRef.current.style.transform = `translate3d(${driftX}px, ${driftY}px, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  useEffect(() => {
    if (!containerRef.current) return;
    const p = Math.min(1, Math.max(0, cameraProgress));
    const scale = 1 - p * 0.12;
    const ty = -p * 80;
    const opacity = 1 - p * 0.6;
    containerRef.current.style.setProperty('--scroll-scale', `${scale}`);
    containerRef.current.style.setProperty('--scroll-y', `${ty}px`);
    containerRef.current.style.setProperty('--scroll-opacity', `${opacity}`);
  }, [cameraProgress]);

  useEffect(() => {
    if (!helmRef.current || !cloudRef.current) return;
    if (reduceMotion.current) return;
    const ctx = gsap.context(() => {
      gsap.from(helmRef.current, {
        scale: 0.94,
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
      });
      gsap.from(cloudRef.current, {
        opacity: 0,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.2,
      });
      gsap.from(`.${styles.skyline}`, {
        opacity: 0,
        duration: 2.0,
        ease: 'power1.out',
        delay: 0.1,
      });
      gsap.from(`.${styles.reflection}`, {
        opacity: 0,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.scene}>
      <div className={styles.vignette} />
      <div ref={skylineRef} className={styles.skyline} />
      <div ref={cloudRef} className={styles.cloud} />

      <div ref={helmRef} className={styles.helm}>
        <img
          src={HELM_SRC}
          alt="Doppelzwiebel-Helm des Wohngebäudes P48 von Jakob Bader"
          draggable={false}
        />

        <svg
          ref={glintsRef}
          className={styles.glints}
          viewBox="0 0 100 200"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="glint1" cx="50%" cy="35%" r="35%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glint2" cx="55%" cy="75%" r="25%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="70" rx="35" ry="50" fill="url(#glint1)" />
          <ellipse cx="55" cy="150" rx="30" ry="40" fill="url(#glint2)" />
        </svg>
      </div>

      <div className={styles.reflection} />
      <div ref={glowRef} className={styles.glow} />
      <ParticleField count={isMobile ? 8 : 22} />
    </div>
  );
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
