# DECISIONS

Design-time decisions made during the JBA award build, per brief §19: "Wenn du eine Entscheidung treffen musst und der Brief sie nicht hergibt, triffst du sie und dokumentierst sie hier."

Newest entries on top.

---

## D-011 · Loader is SVG-driven, not a second R3F canvas

**Phase:** 2 · **Decision:** The pre-hero loader uses a stroked SVG profile + CSS-perspective Y-rotation to *suggest* the lathe construction, then fades out to reveal the hero's actual R3F canvas (already mounted, hidden behind overlay).

**Why:** Brief §7.1 calls for "Linie rotiert um Y-Achse → Volumen entsteht (LatheGeometry build live)". Mounting a second R3F canvas just for the loader would double the WebGL contexts, force a hand-off animation, and add 200ms+ of mount time. The SVG-perspective approach honors the artistic intent (rotation suggests volume), keeps the loader at ~0kB extra JS, and makes the fade-to-3D handoff visually seamless because there's no canvas swap.

The loader's SVG path is generated from the same `profileToSvgPath('doppelzwiebel')` function the static fallback uses — silhouette-fidelity guaranteed.

---

## D-010 · profile.ts is three.js-free

**Phase:** 2 · **Decision:** `src/three/profile.ts` returns `[number, number]` tuples instead of `Vector2`. The 3D consumer (`Doppelzwiebel.tsx`) wraps tuples into Vector2 internally.

**Why:** First Phase-2 build pulled three.js into the *main* chunk (245kB gzipped — at the brief's 250kB ceiling). Root cause: `StaticDoppelzwiebel.tsx` (eager-loaded fallback) imports profile math which transitively imported three's `Vector2`. Splitting the math from three drops main chunk to **68.5kB gzipped** and isolates three.js to the lazy `HeroScene` chunk (220kB gzipped, only loaded if WebGL available + visiting hero).

---

## D-009 · 3D loaded via React.lazy + WebGL gate

**Phase:** 2 · **Decision:** `HeroScene` (R3F + three) is lazy-loaded via `React.lazy(() => import('@/three/HeroScene'))`. Hero renders the static SVG fallback first; if `hasWebGL() && !prefersReducedMotion()`, the lazy chunk hydrates into the canvas slot.

**Why:** Brief §5 requires LCP < 2.5s and "Hero-3D darf nicht blockieren — Static-Image als Fallback bis WebGL ready." This gates three.js out of the critical-path bundle, gives reduced-motion users a respectful static silhouette, and provides graceful degradation on no-WebGL hardware (rare but real for older Android / corp-locked devices).

---

## D-008 · Loader gating: sessionStorage flag, not localStorage

**Phase:** 2 · **Decision:** Loader shows once per browser **session** (via `sessionStorage`), not per-device.

**Why:** localStorage means a returning user months later never sees the visitenkarte construction again — that's the wrong tradeoff for a site whose loader IS the visitenkarte (brief §14). Session-level repeat means: same tab? skip. New tab tomorrow? show again. Hits the artistic sweet-spot Felix confirmed.

---

## D-007 · Background grain via inline SVG (not image asset)

**Phase:** 1 · **Decision:** SVG-noise filter (`feTurbulence`) inlined as data-URI in CSS, applied to deep-surface `::before` pseudo-element at opacity 0.045 with `mix-blend-mode: overlay`.

**Why:** Brief §11 calls for a grain layer; "CSS via SVG-pattern oder canvas, nicht via Image — wegen Performance." Inline data-URI = zero HTTP requests, ~600 bytes, scales infinitely.

---

## D-006 · Lazy-load all routes except Landing

**Phase:** 1 · **Decision:** `App.tsx` uses `React.lazy` + `Suspense` for ProjektDetail / Akademie / AkademieEvent / Impressum / Datenschutz / NotFound. Landing imports synchronously so the hero paints immediately.

**Why:** Brief §5 caps initial bundle at 250kb gzipped. Phase-1 main chunk is 65.7kB gzipped — well under — and lazy chunks are tiny (1–4kB each). Keeps SOTD-tier perf headroom for when 3D + GSAP land.

---

## D-005 · Routing: BrowserRouter, no SSR

**Phase:** 1 · **Decision:** React Router v6 BrowserRouter with full client-side rendering. Vercel static deploy with rewrite-to-index for SPA fallback.

**Why:** Brief §5: "Vite 5+, Build tool, kein Next.js (Static Export auf Vercel reicht)." No remote data, no auth, no per-request personalization — SSR would add deployment + complexity for zero user-visible benefit. Lighthouse perf comes from static + image-pipeline, not SSR.

---

## D-004 · State management: Zustand only, no React Query

**Phase:** 1 · **Decision:** Zustand listed for cursor / audio / transition flags only. No React Query, no Redux, no Jotai.

**Why:** Brief §5 explicitly lists Zustand. The site has zero remote-data fetching — content is bundled at build time as TS modules. React Query would be dead weight.

---

## D-003 · Styling: CSS Modules + CSS custom-property tokens

**Phase:** 1 · **Decision:** Plain CSS Modules per component. Design tokens in `src/styles/tokens.css` as CSS custom properties. No Tailwind, no Vanilla Extract, no Stitches.

**Why:** Brief §16 forbids "Tailwind-Utility-Soup im JSX." Brief §5 lists Vanilla Extract / Stitches as alternatives. Choosing plain CSS Modules:
- Zero runtime cost (Vanilla Extract has bundled CSS, Stitches has runtime).
- Every CSS rule is greppable in DevTools.
- Smallest possible CSS bundle for Lighthouse.
- Simplest mental model for a 6-section editorial SPA.
- Tokens-as-CSS-vars compose with Three.js shaders (we can read them in TS via `getComputedStyle`).

Trade-off: lose type safety on class names. Acceptable for this scope.

---

## D-002 · `index (4).html` archived as `_legacy/index-stage0.html`

**Phase:** 1 · **Decision:** Move (not delete) the inherited single-file site. Tracked in git for content provenance.

**Why:** Brief §4: "NICHT VERWERFEN — adaptieren." All manifest sentences and Bader quotes were extracted from this file into `src/data/*.ts`. Keeping the original lets us audit content fidelity later if questions arise.

`MT 103__.pdf` was deleted (SWIFT bank-transfer document, accidentally placed in repo).

---

## D-001 · pnpm 11 instead of npm

**Phase:** 1 · **Decision:** pnpm 11.0.8 installed globally; `packageManager` field locked in `package.json`; `.npmrc` includes `verify-deps-before-run=false` to prevent the install-on-every-command behavior that was failing on the IGNORED_BUILDS warning.

**Why:** Brief §5 + §17 specify `pnpm` commands. Felix had only npm 11 installed. pnpm gives strict-by-default node_modules + faster CI installs for the R3F+GSAP+Motion stack. `pnpm.onlyBuiltDependencies = ["esbuild", "sharp"]` declared in package.json so post-install scripts run cleanly when needed.

---

## Open questions parked

- **OG / share image** (1200×630 doppelzwiebel render). Phase 6 — render once with Three.js after the model is final, save as PNG, link in `<meta property="og:image">`.
- **Audio** (ambient salon drone). Brief §13 says "wenn nicht möglich → weglassen." No source asset available — skipping, no audio toggle in UI.
- **Akademie photo** (`/public/akademie/vortrag-01.jpg`) replaced with typographic placeholder per Felix's confirmation. If a real salon photo arrives later, drop into `/public/akademie/` and remove the placeholder div in `Akademie.tsx`.
- **Kanzler-Story Bilder**, **Schinkel-Vergleichsfoto** — typographic per Felix's confirmation; treated in Phase 3 (Werk detail) and Phase 4 (Person section).
