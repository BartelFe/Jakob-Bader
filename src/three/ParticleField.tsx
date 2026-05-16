import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '@/lib/webgl';

interface ParticleFieldProps {
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  flicker: number;
}

/**
 * Lightweight Canvas 2D ember field — slow upward drift with subtle
 * flicker. Used by HeroImageScene as the topmost atmospheric layer.
 * Honors prefers-reduced-motion by drawing a single static frame.
 */
export function ParticleField({ count = 22 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.15 - Math.random() * 0.25,
        r: 0.4 + Math.random() * 1.2,
        life: Math.random(),
        flicker: 0.5 + Math.random() * 0.5,
      }));
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const alpha = Math.sin(p.life * Math.PI) * p.flicker * 0.55;
        if (alpha <= 0) continue;
        ctx.fillStyle = `rgba(255, 175, 110, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.004;
        if (p.y < -10 || p.life > 1.0) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.life = 0;
          p.r = 0.4 + Math.random() * 1.2;
          p.flicker = 0.5 + Math.random() * 0.5;
        }
      }
      drawFrame();
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      seed();
      if (reduced) drawFrame();
    };

    resize();
    seed();

    if (reduced) {
      drawFrame();
    } else {
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8,
      }}
      aria-hidden="true"
    />
  );
}
