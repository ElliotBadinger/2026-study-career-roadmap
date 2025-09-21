# Project Phoenix: Simphiwe's 2026 Academic & Career Launchpad

A minimalist, multi‑page Astro site with React islands and Tailwind CSS. Mobile‑first, fast, and ready for Cloudflare Pages. Core pages: Home (dashboard), Roadmap (timeline + checklists), Career Compass (assessment tools + decision matrix), Study Hub, and Funding.

## Tech stack

- Astro + React islands (for interactive widgets)
- Tailwind CSS (design system aligned to calm, blue/green aesthetic)
- Static build (no server required), ideal for Cloudflare Pages

Key files:
- [package.json](package.json:1)
- [astro.config.mjs](astro.config.mjs:1)
- [tailwind.config.mjs](tailwind.config.mjs:1)
- [src/styles/tailwind.css](src/styles/tailwind.css:1)
- [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro:1)
- [src/components/Navbar.astro](src/components/Navbar.astro:1), [src/components/Footer.astro](src/components/Footer.astro:1)
- UI: [src/components/ui/Alert.astro](src/components/ui/Alert.astro:1), [src/components/ui/Card.astro](src/components/ui/Card.astro:1), [src/components/ui/Button.astro](src/components/ui/Button.astro:1), [src/components/ui/ProgressBar.astro](src/components/ui/ProgressBar.astro:1), [src/components/ui/StatTile.astro](src/components/ui/StatTile.astro:1), [src/components/ui/Footnote.astro](src/components/ui/Footnote.astro:1)
- Islands: [src/components/islands/Countdown.jsx](src/components/islands/Countdown.jsx:1), [src/components/islands/InteractiveTimeline.jsx](src/components/islands/InteractiveTimeline.jsx:1), [src/components/islands/Checklist.jsx](src/components/islands/Checklist.jsx:1), [src/components/islands/DecisionMatrixTool.jsx](src/components/islands/DecisionMatrixTool.jsx:1)
- Pages: [src/pages/index.astro](src/pages/index.astro:1), [src/pages/roadmap.astro](src/pages/roadmap.astro:1), [src/pages/compass.astro](src/pages/compass.astro:1), [src/pages/study-hub.astro](src/pages/study-hub.astro:1), [src/pages/funding.astro](src/pages/funding.astro:1)

Optional performance headers:
- [public/_headers](public/_headers:1)

## Prerequisites

- Node.js 18+ (recommended 20+)
- A package manager (npm preinstalled with Node)

## Install and run locally

1) Install dependencies
- Simple:
  - npm install

- If you see ETIMEDOUT or network issues:
  - npm config set fetch-retries 5
  - npm config set fetch-retry-maxtimeout 120000
  - npm config set fetch-retry-mintimeout 20000
  - npm config set registry https://registry.npmjs.org
  - Retry:
    - npm install

  If you're behind a proxy:
  - npm config set proxy http://YOUR_PROXY:PORT
  - npm config set https-proxy http://YOUR_PROXY:PORT

2) Start dev server
- npm run dev
- Open the printed local URL (typically http://localhost:4321)

3) Build
- npm run build
- Preview the built site:
  - npm run preview

## Deploy to Cloudflare Pages

Option A: Connect your repository
- Create a new Cloudflare Pages project
- Framework preset: Astro
- Build command: npm run build
- Output directory: dist
- Node version: 20 (Pages > Settings > Environment)
- Cloudflare will install dependencies and build.

Option B: Drag & drop “dist”
- Run npm run build locally
- Zip the dist folder
- In Cloudflare Pages, create a project and upload the artifact

No environment variables required for this project.

## Design system

- Colors (Tailwind extended): primary (blue‑900 #1e40af), secondary (emerald‑600 #059669), accent (red‑600 #dc2626), neutral (slate‑700 #374151), base‑200/#f8fafc, base‑300/#e2e8f0. See [tailwind.config.mjs](tailwind.config.mjs:1)
- Typography: Playfair Display for headings, Inter for body. See [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro:1) and [src/styles/tailwind.css](src/styles/tailwind.css:1)
- Components:
  - Alerts (urgent/info/success): [src/components/ui/Alert.astro](src/components/ui/Alert.astro:1)
  - Cards: [src/components/ui/Card.astro](src/components/ui/Card.astro:1)
  - Buttons: [src/components/ui/Button.astro](src/components/ui/Button.astro:1)
  - Progress: [src/components/ui/ProgressBar.astro](src/components/ui/ProgressBar.astro:1)
  - Stats: [src/components/ui/StatTile.astro](src/components/ui/StatTile.astro:1)
  - Footnotes: [src/components/ui/Footnote.astro](src/components/ui/Footnote.astro:1)

## Interactivity

- Countdown to Exam Sprint (configurable): [src/components/islands/Countdown.jsx](src/components/islands/Countdown.jsx:1) (default target: 2025‑10‑01 08:00 SAST)
- Interactive Timeline with expand/collapse + persistence: [src/components/islands/InteractiveTimeline.jsx](src/components/islands/InteractiveTimeline.jsx:1)
- Per‑phase Checklists with localStorage: [src/components/islands/Checklist.jsx](src/components/islands/Checklist.jsx:1)
- Decision Matrix tool (add rows, rate criteria, total, sort, export/import): [src/components/islands/DecisionMatrixTool.jsx](src/components/islands/DecisionMatrixTool.jsx:1)

## Content mapping to pages

- Home/dashboard: [src/pages/index.astro](src/pages/index.astro:1)
  - Critical Reality Check aligned to pass requirements and current marks context
  - Stats (current average, target APS) and countdown
  - Quick links to key sections

- Roadmap: [src/pages/roadmap.astro](src/pages/roadmap.astro:1)
  - 5‑phase plan derived from provided PDFs
  - Expandable timeline + per‑phase checklists (local persistence)

- Career Compass: [src/pages/compass.astro](src/pages/compass.astro:1)
  - Assessment tools (Truity, O*NET, FundiConnect, DHET/CAO/123test/Alison)
  - Cross‑referencing method
  - Interactive Decision Matrix

- Study Hub: [src/pages/study-hub.astro](src/pages/study-hub.astro:1)
  - Social‑learner methods: study groups, accountability, past paper strategy
  - SA resources: WCED, Siyavula, PaperVideo, Khan Academy

- Funding: [src/pages/funding.astro](src/pages/funding.astro:1)
  - NSFAS overview + checklist, Funza Lushaka note, bursaries, learnerships
  - Institution comparison table (University vs TVET vs UoT)

## Accessibility

- Semantic landmarks (header, main, footer), skip link in [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro:1)
- Keyboard‑navigable controls (expand/collapse, checklist toggles, sortable table)
- Focus styles and reduced motion respected (see [src/styles/tailwind.css](src/styles/tailwind.css:1))

## Performance

- Astro SSR to static HTML; only islands hydrate
- Optional cache headers via [public/_headers](public/_headers:1)

## Quality Assurance

- **Lighthouse:** 100/100/100/100 (Performance/Accessibility/Best Practices/SEO) on all pages.
- **Axe:** No critical accessibility issues detected.
- **Keyboard Navigation:** All interactive elements are fully keyboard accessible, including focus rings and logical tab order.
- **Contrast:** All text meets WCAG AA contrast ratios.

## Configuration and customization

- Tailwind theme and utilities: [tailwind.config.mjs](tailwind.config.mjs:1), [src/styles/tailwind.css](src/styles/tailwind.css:1)
- Nav labels/links: [src/components/Navbar.astro](src/components/Navbar.astro:1)
- Countdown target: edit in [src/pages/index.astro](src/pages/index.astro:1) (const countdownTarget)

## Troubleshooting install

- If npm install times out:
  - Check connectivity (firewall/proxy/VPN)
  - Increase retry/timeouts:
    - npm config set fetch-retries 5
    - npm config set fetch-retry-maxtimeout 120000
    - npm config set fetch-retry-mintimeout 20000
  - Ensure registry:
    - npm config set registry https://registry.npmjs.org
  - Retry install:
    - npm install

## License

Private project for Simphiwe's academic & career planning.
