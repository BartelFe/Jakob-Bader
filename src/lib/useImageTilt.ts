import { useEffect, useRef } from 'react';

/**
 * Subtle 3D tilt on hover. Brief §9 microinteractions:
 * "Image-Hover: Subtle 3D-tilt (rotateX/Y based on mouse position
 *  relative to center)".
 *
 * Sets CSS variables `--tilt-x` and `--tilt-y` on the element. The
 * element's own CSS is responsible for consuming them in a transform.
 * Auto-disabled on coarse pointer + reduced-motion.
 */
export function useImageTilt<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--tilt-x', `${(-y * strength).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(x * strength).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
