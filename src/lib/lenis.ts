import Lenis from 'lenis';

/**
 * Lenis smooth-scroll singleton.
 *
 * Brief §5: "Lenis 1.x — Smooth scroll (kein Hijack — additive)".
 * It augments wheel/touch easing without intercepting anchor jumps.
 *
 * Skipped entirely on prefers-reduced-motion so users get native, snappy
 * scroll. Skipped on touch because mobile browsers' inertia is already
 * the platform language.
 */

let instance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (instance) return instance;
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (window.matchMedia('(pointer: coarse)').matches) return null;

  instance = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1.0,
  });

  let raf = 0;
  const tick = (time: number) => {
    instance?.raf(time);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  // Expose teardown for HMR / unmount
  (instance as Lenis & { __teardown?: () => void }).__teardown = () => {
    cancelAnimationFrame(raf);
    instance?.destroy();
    instance = null;
  };

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function destroyLenis(): void {
  const inst = instance as (Lenis & { __teardown?: () => void }) | null;
  inst?.__teardown?.();
}
