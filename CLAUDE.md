# Static landing-page generator (Astro + GitHub Pages)

This repo is **cloned per client**. The single source of truth is `brief.yaml` at the root. Assets live in `assets/`. The site is built into an Astro project at the repo root and deployed as static files to GitHub Pages.

## Workflow

When the user runs `/build` (or asks you to "build the site"):

0. **Read `.claude/build-lessons.md` first.** It's a cumulative notebook of what bit me in past builds — version pins, rules I keep missing, design choices to rotate, scaffolding pitfalls. Skipping it means re-paying for lessons already paid for.
1. **Read `brief.yaml`** end-to-end. Treat empty fields and empty lists as "hide that section". Validate that `identity.name`, `identity.tagline`, `identity.language`, `contact.phone` or `contact.email`, and at least one of `offering.items` / `positioning.benefits` are filled. If anything required is missing, list it and stop.
2. **Scan `assets/`** to know which images exist. For any field that references a missing asset, plan a stock fallback (Unsplash) appropriate to `identity.industry` + `visual.vibe`.
3. **Make design decisions** before writing code. Use the `design-taste-frontend` skill. Inputs: `industry`, `vibe`, `reference_url`, `brand_color`, `language`. Outputs: typography pair, palette, layout density, hero variant (image-led / type-led / split), section rhythm. Write the decisions down briefly before coding.
4. **Scaffold Astro** at the repo root if it doesn't exist yet: Astro 4 + Tailwind + `@astrojs/sitemap`. No SSR, no API routes, no MDX unless needed. Set `<html lang>` from `identity.language`. Pick fonts that support Romanian diacritics when `language: ro`.
5. **Generate sections** from the brief (see Section rules below).
6. **Build** with `npm run build`. Output goes to `dist/`.
7. **Verify** with the `verify` skill: start the dev server, open the site, walk the page, check hero, CTAs, mobile layout, and contact links (`tel:`, `mailto:`, WhatsApp URL). Report what you actually saw, not what should have worked.

## Section rules

All sections render in this order. Each one renders only if its data is present.

| Section | Render when |
|---|---|
| Hero | always (uses `identity` + first benefit + primary CTA) |
| Offering | `offering.items` non-empty **or** `offering.intro` filled |
| Pricing chip | any item has `price` — render inline within Offering, not a separate section |
| Positioning / "Why us" | `positioning.benefits` non-empty |
| Testimonials | `trust.testimonials` non-empty |
| Gallery | `trust.gallery` points to a folder with images |
| Contact | always — static page, no form. Render phone as `tel:`, email as `mailto:`, WhatsApp as `https://wa.me/<digits>`. Embed map iframe if `contact.address` filled. |
| Footer | always — name, socials, copyright, current year |

## Design discipline

- **Type-led when no photos.** If `assets/` is sparse, lean into typography and color instead of generic stock.
- **Avoid templated look.** No center-aligned hero with three identical icon cards unless the vibe explicitly calls for it. Vary alignment, density, and rhythm.
- **Romanian sites:** verify the chosen fonts render `ă â î ș ț` correctly. Inter, Manrope, Fraunces, DM Sans, Space Grotesk all work; many display fonts don't.
- **Lighthouse target:** 95+ across Performance, Accessibility, Best Practices, SEO. Astro's defaults get you most of the way — don't break them by importing heavy JS.
- **No analytics, no cookie banner, no chat widgets** unless the brief explicitly asks.

## Tech constraints

- Static output only. No SSR, no API routes, no forms with a backend. Contact page is read-only info plus `tel:` / `mailto:` / `wa.me` links.
- Custom domain assumed → no GitHub Pages base path config needed. Don't add `base:` to `astro.config.mjs`.
- Single language per site (RO or EN). No i18n routing, no language switcher.
- No CMS, no blog, no auth, no e-commerce.

## File layout after build

```
/
├── brief.yaml              # source of truth — never edit during build
├── assets/                 # client-provided images
├── CLAUDE.md
├── .claude/
│   └── commands/build.md
├── astro.config.mjs        # created by /build
├── package.json
├── public/                 # copied from assets/ at build time
├── src/
│   ├── components/         # section components
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   └── contact.astro
│   └── styles/
└── dist/                   # build output — deploy this to Pages
```

## Skills to use

- `design-taste-frontend` — before writing any component, to set the visual direction from the brief.
- `verify` — after building, to actually open the site and confirm it works.
- `run` — if the user wants to see the dev server.
- `shadcn` — only if a brief explicitly asks for shadcn components. Default is hand-rolled Tailwind for a less templated feel.

## Out of scope (don't propose these unless asked)

- Backend forms, server endpoints, databases.
- Blog, CMS, MDX content collections.
- Authentication, gated content.
- Multi-language sites, language switchers.
- Analytics, A/B testing, feature flags.
- Animations beyond subtle scroll/hover — no Lottie, no Framer Motion unless the vibe demands it.

## When in doubt

The brief is the spec. If the brief is ambiguous, ask **one** focused question rather than guessing — these are paid client sites, not experiments.
