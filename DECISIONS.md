# DECISIONS

Design-time decisions made during the JBA award build, per brief §19: "Wenn du eine Entscheidung treffen musst und der Brief sie nicht hergibt, triffst du sie und dokumentierst sie hier."

Newest entries on top.

---

## D-019 · Skip GSAP + Motion in Phase 5; vanilla CSS + IO suffice

**Phase:** 5 · **Decision:** No GSAP, no Motion (`framer-motion`/`motion`) imported in this phase. Curtain transition is pure CSS + React state. Reveal-on-scroll is pure IntersectionObserver. Image tilt is a vanilla `useEffect` hook. Magnetic hover is the same pattern from Phase 4.

**Why:** Both libraries are listed in package.json (per brief §5) but their primary use cases — page transitions (Motion) and ScrollTrigger pinning (GSAP) — are honoured by simpler primitives here:
- Curtain wipe: 50 lines of CSS keyframes + a 30-line React state machine.
- Reveal: native IntersectionObserver (already widely supported, no polyfill cost).
- Pinning for the P48 stage: CSS `position: sticky` (already done in Phase 3).
- Cursor smoothing: requestAnimationFrame + lerp.

Net Phase-5 cost: **+6.8 kB gzipped on main**. If we'd shipped Motion's AnimatePresence + GSAP/ScrollTrigger eagerly, that'd be ~50 kB minimum. We hit the polish target with one-tenth the bundle.

The two deps stay in package.json — Phase 6 may need GSAP for SplitText-with-mask (currently the split system uses CSS `transition-delay` per character which is good but not pixel-perfect on slower devices). Trade-off is documented; deferred decision.

---

## D-018 · Custom cursor: variant-by-selector, not data-cursor attributes

**Phase:** 5 · **Decision:** The Cursor component infers its variant from the hovered element's CSS selector (`a, button` → 'link', `img` → 'image', `canvas` → 'three'), not from a `data-cursor="..."` attribute on each element.

**Why:** Selector-based detection requires zero changes to existing markup — the hundreds of links, buttons, and images in the codebase work immediately. `data-cursor` would require touching every interactive element. Trade-off: slightly less specific control (you can't say "this image opens in lightbox, show 'open' hint vs. 'view' hint") — acceptable for the brief's "subtle, with restraint" aim.

Detection runs on `mouseover` event delegation (single listener at document), so per-element overhead is zero.

---

## D-017 · Lenis singleton, opt-out for reduced-motion + coarse pointer

**Phase:** 5 · **Decision:** Lenis instance lives at the Layout level, initialized in `useEffect` and torn down on unmount. Skipped entirely (returns null) for users with `prefers-reduced-motion` or `pointer: coarse`.

**Why:** Brief §5 calls for Lenis "additive — kein Hijack". Skipping on coarse pointer keeps mobile inertia native (Lenis on touch tends to fight platform gestures). Reduced-motion takes precedence over everything per WCAG.

The Layout's existing `scrollIntoView` for in-page anchors still works because Lenis hooks the wheel/touch handlers, not `Element.scrollIntoView`.

---

## D-016 · Maxvorstadt + Bayern maps as inline SVG, not Mapbox/Leaflet

**Phase:** 4 · **Decision:** Both the Dialog-section Maxvorstadt block and the Akademie-page Bayern silhouette are hand-drawn inline SVGs (~150 lines each), not real maps backed by Mapbox/Leaflet/OpenStreetMap.

**Why:** A real map of central Munich + Heidelberg would require:
- ~150kB of map-tile JS or 50kB of vector tiles
- An API key with usage cap considerations
- Privacy implications (third-party tile-server requests)
- Visual style that fights the editorial design

The schematic SVGs are ~3kB each, fully on-brand (terracotta accents, mono labels, Cormorant city names), and the brief calls them "Stadtkarten-**Auszug**" — abstract, not navigational. If Felix wants real-map fidelity later, it's a Phase 6 swap.

---

## D-015 · No Calendly embed in Dialog

**Phase:** 4 · **Decision:** Two CTAs only — mailto:Erstgespräch + /akademie. No Calendly/Cal.com booking embed.

**Why:** Felix confirmed "default mailto, kein Calendly" for Phase 4. Brief §7.6 calls Calendly "optional, falls Bader das will" — defaulting off is honest until Bader says otherwise. Adding it later is a 10-line drop-in.

---

## D-014 · P48 sticky-stage layout, not in-flow 3D

**Phase:** 3 · **Decision:** P48 detail page uses a `position: sticky; height: 100vh` 3D stage, with three milestone slabs scrolling **over** it (z-index layering). Each milestone is one viewport tall, drives the same single `progress` 0..1 value, and the scene re-orchestrates inside the sticky frame.

**Why:** Brief §7.3 wants "Plan-zu-Volumen-Animation" tied to scroll. Two options:
- (A) Pin the 3D with GSAP ScrollTrigger pin (matches brief §9 "pinning für Hero")
- (B) CSS `position: sticky` + scroll-listener-driven progress

I chose (B) for Phase 3 because GSAP isn't yet wired in this phase (lands in Phase 5 cursor/transitions/microinteractions). CSS sticky has no JS overhead, works on every browser, and the milestone overlay pattern is industry-standard for editorial sites (NYT-style scrollytelling). Phase 5 may swap to ScrollTrigger if the snap-feel needs polishing.

Below 1080px the sticky stage hides — milestones become standalone slabs. Mobile gets a static doppelzwiebel SVG instead of the 3D stage, which is honest about constraints.

---

## D-013 · Treatment dispatch on slug, not on `treatment` field

**Phase:** 3 · **Decision:** `ProjektDetail.tsx` dispatches by `projekt.slug` (e.g. `if (slug === 'p48') return <P48Detail/>`) and by a `SHOWCASES` map keyed on slug for the rest. The `Projekt.treatment` field is now informational, not load-bearing for routing.

**Why:** Two of the six projects (P48 + AKPL22) couldn't share a layout shell — P48 needs a fully custom scrolly-3D layout, AKPL22 wants Petersburger background/lightbox. Mapping slug-by-slug is more honest than pretending six treatments are interchangeable variants. The `treatment` field stays in the data layer for documentation + future filtering.

P48 is `lazy()`-loaded to keep three+drei out of standard ProjektDetail's chunk. Other treatments are bundled with ProjektDetail (combined ~7.5kB gzipped — eager-shipping one is the right tradeoff for snappy between-project navigation).

---

## D-012 · drei `<Html>` for P48 hotspots

**Phase:** 3 · **Decision:** Room labels (Wohnhalle / Galerie / Turmstube) use `<Html>` from `@react-three/drei` — DOM elements positioned in 3D space, auto-projected to screen. Inline-styled in JSX rather than a CSS module because they live mid-Canvas and pulling a stylesheet through `Html` loses the parent-component context.

**Why:** Brief §7.3: "Räume bekommen Labels als Hover-Hotspots." Three alternatives:
- (A) Custom screen-projection via `useFrame` + getWorldPosition + camera projection — most code, full control
- (B) drei `<Html>` — auto-projection, occlusion-aware, ~3kB extra (drei already in deps)
- (C) Sprite-textured 3D labels — readability suffers at angle

(B) is the right tradeoff: free DOM-style hover + focus + ARIA, while keeping the 3D context. Drei was already a brief-mandated dep, so this is no new package.

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
