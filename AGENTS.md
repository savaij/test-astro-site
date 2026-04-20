# Astro Baseline — Agent Instructions

Minimal HTML-first Astro 5 starter. No UI framework, no Tailwind. See [README.md](README.md) for full project philosophy.

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview built output
npm run check     # TypeScript check via astro check
```

Set `SITE_URL` env var before building (defaults to `https://example.com`).

## Architecture

### Key files

| File | Purpose |
|------|---------|
| `src/content/site.ts` | **Single source of truth** for site name, nav, author, SEO defaults |
| `src/layouts/Base.astro` | Master layout — wraps every page |
| `src/components/SEO.astro` | SEO/OG/JSON-LD head tags |

### Page pattern

Every page uses `Base.astro` and imports `site` for defaults:

```astro
---
import Base from "../layouts/Base.astro";
import { site } from "../content/site";
---
<Base title="Page Title" description="..." canonicalPath="/page">
  <article class="prose">...</article>
</Base>
```

Pass `jsonLd` prop to `Base` for page-specific JSON-LD (see `src/pages/index.astro` for example).

### CSS architecture

No utility classes. Plain CSS with custom properties only.

```
src/styles/
├─ global.css          # imports all partials in order
└─ partials/
   ├─ tokens.css       # CSS variables (--bg, --fg, --space-*, --font-*)
   ├─ reset.css        # base reset
   ├─ fonts.css        # font-face declarations
   ├─ structure.css    # layout primitives (.page, .prose, .block, etc.)
   └─ behaviors.css    # interactive states, focus, transitions
```

Always use tokens from `tokens.css` — never hardcode colors or spacing values.

### Navigation

Nav items are defined in `site.ts` under `nav: SiteNavItem[]`. Adding a nav link = add an entry there **and** create the corresponding page in `src/pages/`.

### BEM-style class naming

Components use BEM: `header`, `header__inner`, `header__brand`, `nav__link`, `is-active`.

### Cloudflare integration

`Cloudfare.astro` injects the Cloudflare Web Analytics snippet. The `CF_TOKEN` in `Base.astro` must be replaced with your real token before deploying.

## Conventions

- **No runtime JS by default.** Add `<script>` tags only when genuinely needed.
- **Semantic HTML first.** Use appropriate elements (`<article>`, `<nav>`, `<section>`) before reaching for divs.
- **All SEO props have defaults** from `site.ts` — override only when a page needs custom values.
- **`robots.txt`** is generated from `src/pages/robots.txt.ts`.
- **OG images** go in `public/images/og/`.
- Fonts live in `public/fonts/`.
