import { useEffect, useRef } from 'react';

import { useCursorStore, type CursorVariant } from '@/store/cursor';

import styles from './Cursor.module.css';

const HINTS: Record<CursorVariant, string> = {
  default: '',
  link: '',
  image: 'Anschauen',
  three: 'Drehen',
  hidden: '',
};

/**
 * Custom cursor — small dot follows immediately, larger ring lerps with
 * smoothing. Variant inferred from the hovered element's selector
 * (links → 'link', img → 'image', canvas → 'three').
 *
 * Brief §12: "subtil — nicht overdone". Mobile / coarse pointer auto-hides.
 */
export function Cursor() {
  const variant = useCursorStore((s) => s.variant);
  const setVariant = useCursorStore((s) => s.setVariant);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      const lerp = reduceMotion ? 1 : 0.18;
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    // Hide cursor when leaving the document
    const onLeave = () => setVariant('hidden');
    const onEnter = () => setVariant('default');

    // Variant inference via mouseover delegation
    const interactiveSel = 'a, button, [role="button"], [role="slider"], [role="tab"], input, select, textarea, [tabindex="0"]';
    const imageSel = 'img, .gallery-item, [data-cursor="image"]';
    const threeSel = 'canvas, [data-cursor="three"]';

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(threeSel)) {
        setVariant('three');
      } else if (target.closest(interactiveSel)) {
        setVariant('link');
      } else if (target.closest(imageSel)) {
        setVariant('image');
      } else {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [setVariant]);

  // Hide cursor on devices where it makes no sense — early-render check
  const isCoarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) return null;

  const variantSuffix = variant.charAt(0).toUpperCase() + variant.slice(1);
  const dotClass = `dot${variantSuffix}`;
  const ringClass = `ring${variantSuffix}`;

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.dot} ${styles[dotClass] ?? ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`${styles.ring} ${styles[ringClass] ?? ''}`}
        aria-hidden="true"
      >
        {HINTS[variant] ? <span className={styles.hint}>{HINTS[variant]}</span> : null}
      </div>
    </>
  );
}
