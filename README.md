# Project Phoenix — Simphiwe's 2026 Academic & Career Launchpad

A minimalist, multi-page Astro site that transforms detailed analytical reports into an uplifting, interactive personal roadmap. Built mobile-first with Tailwind, React islands, and calm-tech microinteractions.

Live routes (when running locally):
- / — Home dashboard
- /roadmap — 5-phase plan with checklists (persisted in browser)
- /compass — Career Compass with Decision Matrix
- /study-hub — Social-learner study hub
- /funding — Financial guide with NSFAS readiness

Key personalization
- Countdown anchor was set per your instruction to 2025-11-01 08:00 SAST at [src/content/home.ts](src/content/home.ts:46)
- Site background made slightly darker at:
  - [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro:31)
  - [src/styles/tailwind.css](src/styles/tailwind.css:8)


## Tech stack

- Astro 4 (Astro + React islands)
- Tailwind CSS (with custom tokens inspired by careers.html)
- React 18 for interactive islands
- TypeScript-friendly authoring (Astro components; islands in JSX)

Core configuration and tokens:
- [astro.config.mjs](astro.config.mjs)
- [tailwind.config.mjs](tailwind.config.mjs)


## Getting started

Requirements:
- Node.js 18.14+ (LTS recommended)
- npm 9+ (or pnpm/yarn if preferred)

Install and run:
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

Astro defaults:
- Build output: `dist/`


## Project structure (selected)

- [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) — Global HTML scaffold, fonts, navbar/footer include, page container
- [src/styles/tailwind.css](src/styles/tailwind.css) — Base styles, utilities, reduced-motion rules
- [src/components/Navbar.astro](src/components/Navbar.astro)
- [src/components/Footer.astro](src/components/Footer.astro)
- UI kit:
  - [src/components/ui/Card.astro](src/components/ui/Card.astro)
  - [src/components/ui/Alert.astro](src/components/ui/Alert.astro)
  - [src/components/ui/ProgressBar.astro](src/components/ui/ProgressBar.astro)
  - [src/components/ui/StatTile.astro](src/components/ui/StatTile.astro)
  - [src/components/ui/Footnote.astro](src/components/ui/Footnote.astro)
- Interactive islands (React):
  - [src/components/islands/Checklist.jsx](src/components/islands/Checklist.jsx)
  - [src/components/islands/InteractiveTimeline.jsx](src/components/islands/InteractiveTimeline.jsx)
  - [src/components/islands/DecisionMatrixTool.jsx](src/components/islands/DecisionMatrixTool.jsx)
  - [src/components/islands/FilterableCareerCards.jsx](src/components/islands/FilterableCareerCards.jsx)
  - [src/components/islands/Countdown.jsx](src/components/islands/Countdown.jsx)
  - [src/components/islands/NsfasReadiness.jsx](src/components/islands/NsfasReadiness.jsx)
- Content (editable copy and references):
  - [src/content/home.ts](src/content/home.ts)
  - [src/content/roadmap.ts](src/content/roadmap.ts)
  - [src/content/compass.ts](src/content/compass.ts)
  - [src/content/study.ts](src/content/study.ts)
  - [src/content/funding.ts](src/content/funding.ts)
  - [src/content/references.ts](src/content/references.ts)
- Pages:
  - [src/pages/index.astro](src/pages/index.astro)
  - [src/pages/roadmap.astro](src/pages/roadmap.astro)
  - [src/pages/compass.astro](src/pages/compass.astro)
  - [src/pages/study-hub.astro](src/pages/study-hub.astro)
  - [src/pages/funding.astro](src/pages/funding.astro)


## Personalization guide

- Countdown target and labels: [src/content/home.ts](src/content/home.ts:44)
- Colors, typography (Playfair Display for display, Inter for body), and box-shadows are defined in [tailwind.config.mjs](tailwind.config.mjs)
- Global background and text defaults: [src/styles/tailwind.css](src/styles/tailwind.css:8)
- References and footnotes mapping: [src/content/references.ts](src/content/references.ts) with inline usage via [Footnote.astro](src/components/ui/Footnote.astro)

Color tokens (from careers.html aesthetic):
- primary: #1e40af
- secondary: #059669
- accent: #dc2626
- neutral: #374151
- base.100: #ffffff
- base.200: #f8fafc
- base.300: #e2e8f0


## Data persistence

The app stores interactive state in localStorage (per device/browser):
- Checklists (Roadmap, per-phase): [Checklist.jsx](src/components/islands/Checklist.jsx)
- Timeline expansion state: [InteractiveTimeline.jsx](src/components/islands/InteractiveTimeline.jsx)
- Decision Matrix rows and settings: [DecisionMatrixTool.jsx](src/components/islands/DecisionMatrixTool.jsx)
- NSFAS readiness checklist: [NsfasReadiness.jsx](src/components/islands/NsfasReadiness.jsx)


## Accessibility and calm microinteractions

- Reduced motion respected (see prefers-reduced-motion rules in [src/styles/tailwind.css](src/styles/tailwind.css:21))
- Focus-visible rings on interactive elements (links/buttons): [src/styles/tailwind.css](src/styles/tailwind.css:10)
- Navbar provides semantic nav and aria-current for active links: [src/components/Navbar.astro](src/components/Navbar.astro)


## Deployment — Vercel (one-click)

Option A — Import Git repository:
1) Push this repo to GitHub/GitLab/Bitbucket
2) In Vercel, “Add New Project” → Import your repository
3) Framework preset: Astro (auto-detected)
4) Build command: `npm run build`
5) Output directory: `dist`
6) Deploy

Option B — Vercel CLI:
```bash
npm i -g vercel
vercel
vercel --prod
```

Environment variables: none required.


## Alternative deployment — Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Compatibility Flags: not required
- Node 18+ runtime recommended


## Maintenance and future polish

- Further motion polish and page transitions can be added (while respecting reduced motion)
- Add performance budgets and an Astro Image setup if you plan to host local images
- Consider a simple `vercel.json` if you want custom headers (already using `/public/_headers` where supported)


## License

Personal project for Simphiwe (educational use).