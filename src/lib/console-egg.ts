/**
 * Console easter egg — fires once on first load.
 *
 * Brief §14: "beim Öffnen der DevTools-Console eine ASCII-Doppelzwiebel
 * + Bader-Zitat + Credits".
 *
 * Wrapped in a let-bound flag so HMR re-imports don't double-print.
 */

let printed = false;

const ASCII = `
                       ✠
                       │
                     ╭─┴─╮
                   ╭─╯   ╰─╮
                  ╱         ╲
                 │  ◯ ◯ ◯ ◯  │      Krachers
                  ╲    │    ╱        Doppelzwiebel.
                   ╲   │   ╱
                    ╲  │  ╱          1890 → 1924 → 2025
                  ╭──┴──┴──╮
                ╭─╯         ╰─╮
              ╭─╯             ╰─╮
             ╱                   ╲
            │   ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯   │
             ╲                   ╱
              ╲                 ╱
               ╲───┬─────┬─────╯
                   │ ▣▣▣ │
                   │ ▣▣▣ │
                   │ ▣▣▣ │
                   ╰─────╯
`;

export function printConsoleEgg(): void {
  if (printed) return;
  if (typeof window === 'undefined') return;
  printed = true;

  /* eslint-disable no-console */
  const head = 'color:#c44e2c;font-family:Cormorant Garamond,serif;font-size:24px;font-style:italic;line-height:1';
  const eyebrow = 'color:rgba(244,237,224,0.62);font-family:JetBrains Mono,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase';
  const body = 'color:#f4ede0;font-family:Cormorant Garamond,serif;font-size:14px;font-style:italic;line-height:1.5';
  const dim = 'color:rgba(244,237,224,0.42);font-family:JetBrains Mono,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase';
  const ascii = 'color:#e89978;font-family:JetBrains Mono,monospace;font-size:11px;line-height:1.18';

  console.log('%cJakob Bader Architektur', head);
  console.log('%cMaxvorstadt München · seit 2002', eyebrow);
  console.log('%c' + ASCII, ascii);
  console.log(
    '%c"Ich kann nur raten, dass man mutig sein sollte. Dass man Architektur voll und ganz lebt und versucht, alles rauszuholen, was in dem Objekt steckt."',
    body,
  );
  console.log('%c— Jakob Bader', eyebrow);
  console.log('');
  console.log('%cHallo Kollege/in. Lust auf Bauen?', body);
  console.log('%cE-Mail: architektur@jakobbader.de', eyebrow);
  console.log('%cAmalienstraße 14a · 80799 München', eyebrow);
  console.log('');
  console.log('%cBuilt with Vite · React · Three.js · Lenis · zero ad-trackers.', dim);
  /* eslint-enable no-console */
}
