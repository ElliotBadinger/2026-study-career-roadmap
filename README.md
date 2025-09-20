# Your 2026 Study & Career Roadmap — Minimalist Interactive Site

This project turns a single static document into a minimalist, fully fledged interactive website tailored for a Grade-12 rewriter in South Africa (2025–2026), with honest guidance and useful tools.

Key features
- Decision Matrix (editable, autosum, CSV export, saved locally)
- APS Calculator & Pass Advisor (estimates pass band; shows what to raise next)
- Weekly Study Planner (templates; persists; print view)
- Funding Wizard (NSFAS eligibility and checklist; Funza Lushaka guidance)
- Action Checklist (track tasks; persists)
- Resource Library (SA-focused curated links)
- Privacy-first: all personalization uses localStorage only

Structure
- Pages
  - [index.html](index.html)
  - Legacy source (for reference): [career.html](career.html)
- Assets
  - CSS: [assets/css/styles.css](assets/css/styles.css)
  - JS bootstrap: [assets/js/app.js](assets/js/app.js)
  - Modules: [assets/js/storage.js](assets/js/storage.js), [assets/js/matrix.js](assets/js/matrix.js), [assets/js/passcalc.js](assets/js/passcalc.js), [assets/js/planner.js](assets/js/planner.js), [assets/js/wizard.js](assets/js/wizard.js)
  - Data: [assets/data/resources.json](assets/data/resources.json), [assets/data/programs.json](assets/data/programs.json)

How to run locally
- Open [index.html](index.html) in a modern browser (Chrome, Edge, Firefox) and scroll; tools lazy-init as you reach each section
- No build step required

Deployment — Cloudflare Pages (recommended)
Option A — Git integration (zero-CLI)
1) Push this repo to GitHub or GitLab
2) Cloudflare Dashboard > Workers & Pages > Create application > Pages > Connect to Git
3) Select your repository
4) Build Settings:
   - Framework: None (static site)
   - Build command: exit 0 (or leave empty)
   - Build output directory: . (root) or set to / if UI requires a value. If you keep sources in root, Pages will serve index.html at /
5) Deploy. CF Pages will build and serve your site on a *.pages.dev domain. Add a custom domain if needed

Notes:
- If you choose a subfolder as your site root, set “Build output directory” to that folder
- You can disable auto-deploys and manually trigger builds later

Option B — Direct Upload with Wrangler (CI/CD or local)
Prerequisites:
- Cloudflare account and a Pages project created (Direct Upload type)
- Node.js LTS installed

Install Wrangler:
- npm install -g @cloudflare/wrangler

Deploy static assets from the project root:
- npx wrangler pages deploy . --project-name=<YOUR_PROJECT_NAME>

Environment:
- A Cloudflare “Account ID” and API token may be required for CI or when prompted by Wrangler

GitHub Actions (optional)
Add a deployment workflow (.github/workflows/pages.yml):

```
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # No build step needed for pure static
      # - name: Build
      #   run: echo "No build"

      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name=<YOUR_PROJECT_NAME>
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

Set GitHub secrets:
- CLOUDFLARE_API_TOKEN (with Pages write permission)
- CLOUDFLARE_ACCOUNT_ID (from your Cloudflare dashboard)

Security & headers (optional)
- For static-only sites, Pages can use a top-level _headers file placed next to index.html or inside the output directory to set caching and security headers
- Example _headers (optional):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=()
  Cache-Control: public, max-age=3600
```

Content notes (tailored to the end user)
- All guidance reflects the PDFs in this repo (2025–2026 SA context)
- Links are curated to South African resources (DBE/WCED, NSFAS, Funza Lushaka, Siyavula, Woza Matrics, TVET and university programs)
- The site is minimalist and avoids frameworks, keeping Tailwind CDN and small modular JS

Data and privacy
- Personal inputs are stored in localStorage under the “roadmap:” namespace
- Use the “Clear” buttons in tools to remove local data
- No analytics or trackers

Accessibility and performance
- Tailwind CDN only; minimal custom CSS
- Keyboard accessible controls, focus styles for inputs, semantic HTML sections
- Mermaid is loaded via CDN; interactive diagram controls avoid heavy dependencies

Troubleshooting
- Tools do not appear? Scroll to each section; modules are lazy-initialized when visible
- Resources not loading? Ensure [assets/data/resources.json](assets/data/resources.json) is served (in local file mode, some browsers restrict fetch of local JSON)
  - Workaround: use a localhost static server (e.g., `python3 -m http.server` then open http://localhost:8000)

License
- Educational/open content; verify third-party resource licenses before redistribution