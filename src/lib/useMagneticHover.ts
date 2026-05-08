import { useEffect, useRef } from 'react';

/**
 * Magnetic-hover effect: when the cursor enters the element, the element
 * translates toward the cursor by a damped fraction of the offset.
 *
 * Performance: rAF-throttled, transform-only (no layout thrash). Disabled
 * automatically on touch and prefers-reduced-motion.
 */
export function useMagneticHover<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      if (reduce || coarse) return;
    }

    let raf = 0;
    let active = false;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };

    const onEnter = () => {
      active = true;
      el.style.transition = 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)';
    };

    const onLeave = () => {
      active = false;
      cancelAnimationFrame(raf);
      el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = '';
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      // Guard against unmount during hover
      if (active) el.style.transform = '';
    };
  }, [strength]);

  return ref;
}
