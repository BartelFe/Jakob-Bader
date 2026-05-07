# DECISIONS

Design-time decisions made during the JBA award build, per brief §19: "Wenn du eine Entscheidung treffen musst und der Brief sie nicht hergibt, triffst du sie und dokumentierst sie hier."

Newest entries on top.

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
