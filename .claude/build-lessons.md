# Build lessons

Cumulative notebook of what bit me in past `/build` runs. Read this **before** scaffolding the next site. Add new entries as they come up; do not delete entries unless the underlying issue is gone (e.g. an upstream bug is fixed).

---

## Required defaults (non-negotiable unless brief explicitly opts out)

These three apply to every site built from this template. They are project-wide architecture choices, not per-client decisions.

### 1. Sticky / pinned navigation
The nav is always pinned to the top of the viewport on scroll. Implementation: `sticky top-0 z-40` with a translucent background (`bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70`) and a hairline bottom border that appears once the user has scrolled past the hero. Height capped at 64-72px per `design-taste-frontend` Section 4.7. Do NOT use `absolute` positioning for the nav.

**Why:** users need an always-visible way back to the rest of the site. A nav that scrolls out of frame forces them to scroll back up to navigate, kills conversion on long pages, and reads as dated.

**How to apply:** in `src/components/Nav.astro`, use `sticky top-0 z-40` on the wrapping `<header>`. Make sure no parent container has `overflow-hidden` (kills sticky). Add the translucent background and the supports query so older browsers fall back to opaque.

### 2. Multi-page navigation, always
Nav items always link to **separate pages**, never to in-page anchors (`#section`). The nav must always include a **Home** link ("Acasă" in RO, "Home" in EN).

Minimum page set for any landing build:
- `/` Home — hero, brief teasers of other sections, primary CTA
- `/servicii` (or `/services`) — full services / offering, if the brief has any
- `/despre` (or `/about`) — positioning, benefits, team/clinic atmosphere
- `/contact` — always

Home page sections become **teasers**: show 2-3 items, then a "See all" link to the dedicated page. The dedicated page is where the full list / detail lives. The hero CTA still points at the primary action (call, book, etc.) — that doesn't change.

**Exception:** the brief explicitly says `single_page: true` or names "single-page landing" in the vibe. Then collapse to one page with anchor nav. Default is multi-page.

**Why:** in-page anchor nav makes the home page a 4000px scroll wall. Multi-page is faster to scan, better for SEO (each page targets its own keywords), and feels like a real business has a real site rather than a one-page demo.

**How to apply:** factor shared content (services list, benefits, testimonials) into `src/lib/data.ts` so home teasers and full pages read from the same source. Don't duplicate strings across pages.

### 3. Visual richness is the default
Default to **multiple real images** across the site, not just a hero shot. Plain / type-led design is only acceptable when the brief explicitly asks for it (`vibe: type-led`, `vibe: minimal`, or a clear instruction like "no photos").

Minimum image budget per build:
- **Home**: hero photo + at least one atmosphere shot + ideally a third (testimonial portrait, detail).
- **About / Despre**: at least one portrait or interior shot.
- **Services / Servicii**: header photo + optional per-service shots (use if the brief provides them, otherwise one header is enough).
- **Contact**: map is enough; a clinic exterior photo is a plus.

Image sources, in priority order:
1. **Client-provided in `assets/`** — always use first if present.
2. **Stock with descriptive seed**: `https://picsum.photos/seed/{client}-{section}/{w}/{h}` — deterministic, always works, but the photo subject is random. Use `?grayscale` query when you want consistent muted mood (handy for "calm clinical" or "editorial" vibes where the photo is decoration, not specifically the subject).
3. **Hand-picked Unsplash photo URLs** for hero / signature shots only — only use photo IDs you have actually verified with a HEAD request. Write the chosen IDs into `dist/.build-meta.json` so they're reproducible.

When a section uses a stock photo as decoration rather than as the literal subject (e.g. an "atmosphere" block where the photo is mood, not "this is our clinic"), the section's caption / alt text must reflect that — don't pretend a picsum image is a photo of the actual business.

**Why:** local-business landing pages without photos look like template demos, not real businesses. Trust signals from imagery cannot be replaced by typography alone. Even when type carries the main weight, photos anchor the site to a real place.

**How to apply:** before scaffolding, decide the image plan: which slots get client photos, which get picsum-grayscale decoration, which get hand-verified Unsplash IDs. Write the plan to a scratch note. Verify every Unsplash URL with a HEAD request before committing it to a component.

---

## Scaffolding gotchas

### Rollup optional native dep on Windows
After `npm install`, the first `npm run build` may fail with `Cannot find module '@rollup/rollup-win32-x64-msvc'`. This is a long-running npm bug with rollup's optional native binaries on Windows. Fix:
```
npm install @rollup/rollup-win32-x64-msvc --no-save
```
Then rebuild. Don't delete `node_modules` and reinstall — that just reproduces the bug. The `--no-save` keeps `package.json` clean while resolving the platform-specific dep.

### Sitemap version pin
`@astrojs/sitemap@3.2.x` crashes against Astro 4.16 with `Cannot read properties of undefined (reading 'reduce')` at the post-build hook. Pin **`3.1.6`** in `package.json` until upstream ships a fix. The build will succeed (HTML lands in `dist/`) but the sitemap step fails and the process exits 1, which looks scarier than it is.

### PowerShell hides UTF-8 bugs
`Invoke-WebRequest ... .Content` decodes the body as Windows-1252 on this machine, so Romanian diacritics look broken (`modernÄ` instead of `modernă`) even when the HTML is fine. When verifying RO content over HTTP, do:
```powershell
$bytes = (Invoke-WebRequest -Uri $url -UseBasicParsing).RawContentStream.ToArray()
$html  = [System.Text.Encoding]::UTF8.GetString($bytes)
```
Don't waste 10 minutes debugging "missing diacritics" before checking the encoding path.

### Dev server doesn't link CSS files
Astro's dev server uses HMR (JS-injected styles) — `<link rel="stylesheet">` is empty in the served HTML. To audit compiled CSS, **run `npm run build` and inspect `dist/_astro/*.css`**. Don't try to validate Tailwind output against the dev-server response.

### Tailwind colors compile to `rgb(...)`, not hex
Searching the built CSS for `#2F5D50` returns nothing. Tailwind emits `rgb(47 93 80 / var(--tw-text-opacity, 1))`. When auditing palette compilation, search for the rgb triplet, not the hex.

### Astro Tailwind integration
- `tailwind({ applyBaseStyles: false })` + manual `@tailwind base; @tailwind components; @tailwind utilities;` in `src/styles/global.css` is the clean pattern. Don't let the integration inject its own preflight; you want explicit control over `@layer base` for the page-level body styles.
- `output: "static"` is mandatory for GitHub Pages. Don't forget it on a fresh scaffold.

---

## GitHub Pages deployment

These all bit me on the first deploy of the Lumen example site. The five lessons interlock — fixing one without the others won't get you a working site.

### 1. Pages defaults to Jekyll — even on a repo with no Jekyll files

If the GitHub Pages **Source** is set to "Deploy from a branch" (the default), Pages runs `actions/jekyll-build-pages` on your repo. Jekyll walks every file and tries to parse anything starting with `---` as YAML front matter. **`.astro` component scripts start with `---`** (TypeScript/JS, not YAML), so Jekyll fails with `mapping values are not allowed in this context` on Nav.astro, Offering.astro, etc.

**Fix:** in repo Settings → Pages → **Source**, switch to **"GitHub Actions"**. This stops Pages from running Jekyll at all and lets your own workflow build and publish.

**Why:** Jekyll is GitHub Pages' historical default for static site generation, and it ignores `.nojekyll` when the build is initiated by Pages itself.

### 2. `.nojekyll` alone does NOT stop the Jekyll build

A common bad guess (mine, the first time): "add `.nojekyll` at the repo root, Jekyll will skip." Wrong. `.nojekyll` only tells Pages "don't run Jekyll on the **deployed** artifact" — it has no effect when Pages is configured to *build* with Jekyll. You still need to flip Source → GitHub Actions.

Keep `.nojekyll` in `dist/` (or the repo root if also serving from a branch) as belt-and-braces — it's a one-line file and prevents future confusion if anyone toggles Pages config — but do not rely on it as the fix.

### 3. Astro deploy workflow recipe

Canonical workflow that works with Pages → "GitHub Actions" source. Save as `.github/workflows/deploy.yml`:

```yaml
name: Deploy Astro site to Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency: { group: pages, cancel-in-progress: false }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Why:** the rollup-win32 bug doesn't hit on Linux, `npm ci` is reproducible against the lockfile, and the two-job split is the pattern GitHub's docs prescribe for the `deploy-pages` action.

### 4. `base:` is required for `<user>.github.io/<repo>/` deploys

CLAUDE.md says "custom domain assumed → don't add `base:`". That holds for the real client deploy (`dentallumen.ro`), but **not** for an example/test deploy under a project subpath like `https://<user>.github.io/dot-lumen-example-website/`. Without `base:`, Astro emits CSS/JS links as `/_astro/foo.css`, which resolves to the github.io root (404 — no CSS, unstyled site).

Decision rule at scaffold time:
- Custom domain (CNAME) → leave `base` out.
- Project page on github.io → set `base: "/<repo-name>"` in `astro.config.mjs`.

When the test deploy graduates to the custom domain, **remove** the `base:` line and (if applicable) update the `url()` helper imports — otherwise links will prefix `/<repo-name>` onto a domain root and 404.

### 5. `import.meta.env.BASE_URL` mirrors `base` exactly — and Astro does NOT auto-prefix author-written hrefs

Two traps in one.

**Trap A — slash mirroring.** Whatever you write in `base:` is what `import.meta.env.BASE_URL` returns. `base: "/foo"` → BASE_URL = `"/foo"`; `base: "/foo/"` → BASE_URL = `"/foo/"`. Naïve concatenation breaks one way or the other. Write the helper so it works either way.

**Trap B — author hrefs.** Astro auto-rewrites internal asset URLs (CSS bundles, `<Image>` src) under the base path, but it does **not** rewrite hand-written `href="/servicii"`, `<link rel="icon" href="/favicon.svg">`, or `<img src="/foo.jpg">`. Those stay literal and break.

**Canonical form on GitHub Pages.** Pages serves directory-style URLs with a trailing slash: `/servicii/` not `/servicii`. Set `base: "/<repo>/"` (with trailing slash) and emit routes with trailing slashes so internal links match the canonical URLs Pages redirects to. File assets (anything with an extension) stay extension-bare.

**Fix:** ship a tiny helper in `src/lib/data.ts` (alongside `site`, `services`, etc.) and route every author-written internal `href`/`src` through it:

```ts
export const url = (path: string = "/"): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return `${base}/`;
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  return isFile ? `${base}/${clean}` : `${base}/${clean}/`;
};
```

Files to thread it through, every build: `layouts/Base.astro` (favicon), `components/Nav.astro` (items array + logo link), `components/Footer.astro` (nav links), every section component with an internal CTA (`Hero`, `AtmosphereBlock`, `FinalCta`, `PageHero`, ...), every `src/pages/*.astro` with an internal `<a>`. Mechanical audit before declaring done:

```
grep -rE 'href="/[a-z]' src/
grep -rE 'src="/[a-z]'  src/
```

Both must return zero matches. If they don't, you'll ship a site that works on `npm run dev` (where `base` is `/`) but breaks under `base:` on Pages.

---

## Pre-flight audit hot spots

These are the Section 14 checks I have actually missed in the wild. Audit them mechanically — grep, don't eyeball.

### Em/en-dash
The single most-violated rule. Romanian time/date ranges are the trap (`Luni–Vineri 9:00–19:00`, `Lun–Vin 9–19`). My fingers type the en-dash automatically. Mechanical check:
```
grep -rE '[—–]' src/
```
Must return zero matches before declaring done. Use ` - ` (hyphen with spaces) for ranges.

### Hero stack > 4 elements
Easy to drift past 4 by adding "useful info" below CTAs (program/address dl, trust micro-strip, value props). That's the banned "tiny tagline below CTAs" pattern. The hero is **eyebrow + headline + subtext + CTAs**. Anything else moves to its own section directly below.

### Hero top padding
`pt-32` exceeds the `pt-24` cap. The nav being absolute-positioned doesn't excuse it — the content still floats too low. Default ceiling: `pt-24`. If the hero needs more breathing room, bump font scale or asset size, not padding.

### Italic descender clearance
Words with `g j p q y` in italic spans need `leading-[1.1]` minimum + `pb-1` on the span. In Romanian, `g` shows up in common emphasis words (`grabă`, `gata`, `garanție`, `prelungit`). Don't ship `leading-none` or `leading-[1.05]` on a display headline with an italic span.

---

## Romanian-specific

### Time/date formats
- Day ranges: `Luni - Vineri` (hyphen with spaces), not `Luni–Vineri`.
- Hours: `9:00 - 19:00`, not `9:00–19:00`.
- Months/days short: `Lun - Vin`, `Sâm`, `Dum`.
- "Sâmbătă" needs the `â` and `ă` — don't shorten to "Sambata" in body copy.

### Font subsetting
`Cormorant Garamond` and `Inter` both serve the Romanian Latin Extended subset via Google Fonts when the request comes from a RO browser. The Google Fonts URL in `Base.astro` does not need an explicit `&subset=latin-ext` — Google auto-detects. Verified: Cormorant `cv09`/`ss01` features render `ț ș ă â î` correctly.

### Copy register
Romanian marketing copy tolerates slightly longer sentences than English; the 20-word subtext cap still holds but `max-w-prose` (65ch) at `text-lg` reads well. Avoid English-isms in CTA labels ("Hai!", "Începe acum" are fine; "Get started" obviously not).

---

## Component architecture

### Brief-driven props vs hardcoded values
**Lesson from the Lumen dry-run:** I hardcoded the Unsplash hero URL, the phone number, the address, and the testimonials directly into the `.astro` components. That worked for the dry-run but is wrong for a real `/build` flow — every clone would have to manually edit 5+ files.

The right pattern (do this next time):
1. Create `src/lib/brief.ts` that reads `brief.yaml` (use `yaml` or `js-yaml` package) and exports a typed `Brief` object.
2. Components take props from that object: `<Hero brief={brief} />`, `<Offering items={brief.offering.items} />`, etc.
3. `src/pages/index.astro` does the single read and threads `brief` to all sections.
4. Stock-fallback logic for images lives in the lib, not in the component — `getHeroImage(brief)` returns either the local `assets/` path or an industry-appropriate stock URL.

This keeps "edit per client" to one file (`brief.yaml`) and "edit per design" to the components, with no overlap.

### Section visibility
The CLAUDE.md "Section rules" table is the source of truth. Sections hide based on data presence — encode that as conditional rendering in `index.astro`, not by deleting component imports. Future briefs may toggle gallery on/off without touching component files.

### Stock fallback bookkeeping
When I pick a stock photo URL for a missing client asset, **write the chosen URL into a build artifact** (e.g. `dist/.build-meta.json`). Reasons: (a) the client may want the same image next time, (b) Unsplash photo IDs occasionally vanish, (c) we need to know what we pulled to credit Unsplash properly.

---

## Design choices to rotate

### Typography pool
Cormorant Garamond + Inter worked for Lumen but if I default-reach for them on the next 3 builds I'll have made the template's own slop signature. Rotate from this Romanian-supporting pool per brief:

- **Display serifs** (Latin Extended): Cormorant Garamond, EB Garamond, Crimson Pro, Lora, Source Serif Pro, Playfair Display (use sparingly — overused).
- **Display sans**: Manrope, Plus Jakarta Sans, DM Sans, Outfit, Space Grotesk.
- **Body**: Inter (only when accessibility-critical override applies), Manrope, DM Sans, Geist.

Match the body to the display: serif display → clean grotesque body (Manrope / Inter); sans display → either same family or a contrasting mono for accents.

### Palette discipline
Sage worked. For the next site:
- If `brand_color` is given, derive a 7-step palette from it (brand, brand-deep, brand-light, paper, elevated, ink, muted, hairline). Don't add a warm accent unless the brief explicitly asks.
- If `brand_color` is empty, pick from these tested directions per industry:
  - Medical/dental: deep sage `#2F5D50`, deep navy `#1E3A52`, oxblood `#5A2A2A` (rare), warm clay `#A35A3F` (warmer brands only).
  - Restaurant: rotate — terracotta+slate, olive+cream, off-black+single-pop. Avoid the AI-default beige+brass.
  - Law/notary: deep navy or burgundy + cream + ink.
  - Salon/wellness: dusty rose, sage, off-black + cream. Avoid lila glow.

---

## Workflow

### Order matters
1. Read `brief.yaml` end-to-end. **Validate required fields first; stop if anything is missing.**
2. Scan `assets/`. List what's there and what will need stock fallback.
3. Run `design-taste-frontend` **before writing any component**. Write down the dials, palette, typography, hero variant.
4. Scaffold Astro project files (`package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`).
5. Write `src/lib/brief.ts` (typed read) **before** components — components consume the brief, they don't redefine it.
6. Build the layout + nav + footer first; sections second. The shell is the rhythm.
7. After build, run the em/en-dash grep + a Pre-Flight sweep (Section 14 of `design-taste-frontend`). Fix what's flagged. Re-build.
8. Use `verify` skill. Don't skip — visual issues that look fine in code break in render.

### Don't trust the first hero pass
The hero is where I most often slip into templated mode. After writing it, re-read against:
- Hero stack ≤ 4 text elements?
- `pt-24` max?
- Italic descender clearance?
- CTA labels ≤ 3 words?
- One primary + at most one secondary CTA?

If any check fails, fix in-place, don't move on.

---

## Things that did NOT go wrong (don't over-correct)

- YAML brief was readable and fillable. Sticking with YAML over Markdown was the right call.
- Single flexible template (no industry presets) produced a coherent site without preset machinery. Keep this approach.
- The "hide section when brief data empty" pattern is clean and obvious — no need for a feature-flag system.
- `output: "static"`, no SSR, no API routes → GitHub Pages deploy is `dist/` → done. No need to over-engineer.

---

## Open questions for the next build

These came up during Lumen and weren't resolved:

- **Stock photo sourcing.** Unsplash direct URLs are fine but their photo IDs occasionally vanish. Worth exploring picsum.photos seeds (deterministic but lower quality) or generating images via an MCP image tool if one is connected. For now: Unsplash + save the chosen URL to a build artifact (see "Stock fallback bookkeeping" above).
- **Form-less contact**. The Lumen contact page is read-only info + map. If a future client genuinely needs a working form, the user already said `mailto:` fallback is fine — but worth deciding once and for all in `CLAUDE.md` whether forms are entirely banned or a `mailto:`-only minimal form is allowed.
- **Sitemap pinning.** Re-test sitemap each new Astro minor; un-pin when 3.2.x stops crashing.
