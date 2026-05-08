/**
 * Reveal-on-scroll system.
 *
 * Single global IntersectionObserver. Anything with class `reveal`
 * gets observed; first time it crosses the threshold, `is-revealed`
 * is added and the element is unobserved.
 *
 * Brief §9: "Niemals: simple opacity fade-in. Das ist 2018." So the
 * reveal CSS uses a translate-y + opacity combo, with the *option* to
 * upgrade specific elements to character-by-character via splitText().
 */

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer?.unobserve(entry.target);
      }
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    },
  );
  return observer;
}

/**
 * Scan the given root (or document) and start observing all `.reveal`
 * elements that haven't fired yet. Call after each route change.
 *
 * Honours `prefers-reduced-motion` by immediately revealing everything
 * without animation.
 */
export function scanReveals(root: ParentNode = document): void {
  if (typeof window === 'undefined') return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = root.querySelectorAll<HTMLElement>('.reveal:not(.is-revealed)');

  if (reduce) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const obs = getObserver();
  if (!obs) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  // For elements already past the trigger zone (above the fold), reveal
  // immediately so they don't show empty when the user scrolls down.
  const vh = window.innerHeight;
  elements.forEach((el) => {
    // If element opted into split-text via class, do it now (idempotent).
    if (el.classList.contains('reveal-split')) {
      splitTextIntoChars(el);
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.85) {
      el.classList.add('is-revealed');
    } else {
      obs.observe(el);
    }
  });
}

/**
 * Split a text node into per-character spans for staggered reveal.
 * Each span gets `--char-i` set to its index so CSS can stagger
 * `transition-delay`.
 *
 * Accessibility: the parent gets aria-label with the original text, and
 * each span is aria-hidden to avoid each character being announced.
 */
export function splitTextIntoChars(el: HTMLElement): void {
  if (el.dataset['split'] === '1') return;
  const original = el.textContent ?? '';
  el.dataset['split'] = '1';
  el.setAttribute('aria-label', original);
  el.textContent = '';

  const chars = [...original];
  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? ' ' : char;
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--char-i', String(i));
    span.className = 'split-char';
    el.appendChild(span);
  });
}
