import { useEffect } from 'react';

interface JsonLdProps {
  /** Stable id so we replace the same script element across re-renders. */
  id: string;
  /** Plain JS object — will be JSON.stringified. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Inject a `<script type="application/ld+json">` into <head>.
 * Cleans up on unmount so search engines don't see stale data on
 * route change.
 *
 * Each instance keys on `id` so multiple JsonLd components on the
 * same page never collide.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  useEffect(() => {
    const elementId = `jsonld-${id}`;
    let script = document.getElementById(elementId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = elementId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.remove();
    };
  }, [id, data]);

  return null;
}
