# Jakob Bader Architektur — Mut zum Raum

Award-stack site for **Jakob Bader Architektur (JBA)**, Munich. Editorial-magazine-hybrid studio site with the **Doppelzwiebel** (P48 hero project) as structural leitmotif. Target: Awwwards Site of the Day + FWA, 2026.

## Stack

- Vite 5 · React 18 · TypeScript (strict)
- React Router v6 (BrowserRouter, multi-page with code-split lazy routes)
- @react-three/fiber + drei + three (Doppelzwiebel-3D — Phase 2)
- GSAP 3.12 + ScrollTrigger (scroll choreographies — Phase 2/5)
- motion (UI animation, layout transitions — Phase 5)
- Lenis (additive smooth-scroll — Phase 5)
- Zustand (cursor / audio / transition flags — Phase 5)
- @vercel/analytics (opt-out, cookie-free)

CSS Modules + CSS-custom-property tokens. No Tailwind. No CSS-in-JS at runtime.

## Development

```bash
pnpm install      # install (use --ignore-scripts on first run if pnpm prompts about builds)
pnpm dev          # http://localhost:5173
pnpm build        # tsc -b && vite build → dist/
pnpm preview      # serve dist/
pnpm type-check   # tsc -b --noEmit
```

Node 22+, pnpm 11+.

## Project layout

```
src/
├── main.tsx             # entry, BrowserRouter, Analytics
├── App.tsx              # route table
├── data/                # content source-of-truth (locked manifest sentences)
│   ├── manifest.ts
│   ├── projekte.ts
│   ├── akademie.ts
│   └── person.ts
├── styles/              # global CSS
│   ├── tokens.css       # color, type, spacing, easing
│   ├── reset.css
│   ├── typography.css
│   └── global.css
├── components/          # reusable shell
│   ├── JBALogo/
│   ├── Header/
│   ├── Footer/
│   ├── Layout/
│   └── ManifestBanner/
├── sections/            # landing-page sections
│   ├── Hero/
│   ├── Diagnose/
│   ├── Werk/
│   ├── Akademie/
│   ├── Person/
│   └── Dialog/
├── pages/               # routed pages
│   ├── Landing.tsx
│   ├── ProjektDetail.tsx
│   ├── Akademie.tsx
│   ├── AkademieEvent.tsx
│   ├── Impressum.tsx
│   ├── Datenschutz.tsx
│   └── NotFound.tsx
└── three/               # R3F scenes (Phase 2)

public/
├── jba-logo.svg
├── portraits/           # bader-salon.jpg, bader-kueche.jpg
└── projekte/            # 38 photos + 3 plans across 6 projects

_legacy/
└── index-stage0.html    # original single-file site — content-source provenance
```

## Build phases

Per build brief §19:

1. ✅ **Setup + Routing + Design-Tokens** ← current
2. ⏳ Hero with Doppelzwiebel-3D + Loader
3. ⏳ Werk incl. P48 detail page (own 3D scene)
4. ⏳ Akademie + Person + Dialog full art-direction
5. ⏳ Cursor system, page transitions, microinteractions
6. ⏳ A11y pass, perf pass, submission material

Each phase ends in a clean commit + status note.

## Content as source-of-truth

All Bader manifest sentences and quotes live in `src/data/*.ts`. They were hand-curated from the legacy single-file site at `_legacy/index-stage0.html` and are **locked content** — change `CONTENT.md` first, then mirror to TS modules.

## Deploy

Static build — deploys cleanly to Vercel (default zero-config). Push to a Vercel-connected repo or run `vercel deploy --prebuilt` from `dist/`.

## Decisions

See [DECISIONS.md](./DECISIONS.md) for design-time choices made during the build.
