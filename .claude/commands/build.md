---
description: Build the Astro site from brief.yaml + assets/
---

Build the client's site following the workflow in `CLAUDE.md`.

Steps:
1. Read `brief.yaml`. Validate required fields. If anything required is missing, list what's missing and stop — do not guess.
2. List `assets/` so you know which images exist and which need stock fallback.
3. Invoke the `design-taste-frontend` skill with the brief's `industry`, `vibe`, `reference_url`, `brand_color`, and `language`. Decide typography, palette, hero variant, and section rhythm **before** writing components.
4. Scaffold the Astro project at the repo root if it isn't already there (Astro 4 + Tailwind + `@astrojs/sitemap`, no SSR, no MDX unless needed).
5. Generate only the sections whose data is present in the brief, per the Section rules table in `CLAUDE.md`.
6. Run `npm run build`. Then use the `verify` skill to actually open the site and walk through it.
7. Report what was built, what stock images were used (if any), and the Lighthouse-relevant choices you made.

Stay strictly within the Out-of-scope list in `CLAUDE.md`. No forms, no analytics, no blog, no extra pages beyond Hero/Offering/Positioning/Testimonials/Gallery/Contact unless the brief asks.
