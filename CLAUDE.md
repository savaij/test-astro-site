# L'elefante — Agent Instructions

Questo progetto è basato su un tema Astro 5 minimale (HTML-first, no UI framework, no Tailwind), adattato per **L'elefante**: un progetto editoriale italiano che racconta le disuguaglianze in Italia attraverso articoli, dati e visualizzazioni interattive.

## Progetto editoriale

- **Nome**: L'elefante
- **Tema**: Disuguaglianze in Italia (reddito, salute, istruzione, territorio, genere, ecc.)
- **Stile**: Semplice, leggibile, autorevole — giornalismo di dati senza eccessi grafici
- **Lingua**: Italiano
- **Pubblico**: Lettori curiosi e informati, non necessariamente tecnici

### Principi editoriali da rispettare nel codice
- Il contenuto viene prima del design: la leggibilità dell'articolo è prioritaria
- Le visualizzazioni dati devono essere accessibili e funzionare anche senza JS (graceful degradation)
- Ogni articolo/pezzo può includere uno o più componenti interattivi (grafici, mappe, tabelle dinamiche)
- Usare JS solo dove aggiunge valore giornalistico reale (visualizzazioni, filtri su dati)

### Visualizzazioni interattive
La regola "no runtime JS by default" del tema base viene **parzialmente superata** per ospitare visualizzazioni. Le linee guida sono:

- I componenti di visualizzazione vivono in `src/components/charts/`
- Usare **D3.js v7** caricato da CDN via ESM (`import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"`) in un `<script type="module">` nel componente
- Non installare D3 come dipendenza npm; caricare dal CDN direttamente nel componente chart
- Ogni visualizzazione deve avere un fallback `<noscript>` con tabella HTML dei dati chiave
- Non installare framework UI (React, Vue, Svelte) salvo necessità eccezionale documentata

#### Convenzioni per i componenti chart
- Struttura: `<figure class="viz-figure">` → `<figcaption>` (titolo + nota) → `<div id="chart-*">` (target D3) → `<noscript><table>`
- Naming: `Chart_[numero_articolo].[numero_chart].astro` (es. `Chart_1.1.astro`)
- Tutti gli stili locali usano token CSS (`var(--bg)`, `var(--border)`, `var(--space-*)`, ecc.) — mai valori hardcoded
- I grafici interattivi possono includere input utente (es. campo reddito) con `aria-live` per accessibilità
- Tipi di grafici usati finora: linee multi-serie (D3 SVG), waffle/bubble chart a cerchi (SVG, ogni cerchio = % della popolazione)

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
| `src/content/articles.ts` | Array di articoli (`Article[]`) con numero, titolo, descrizione, href, `published` |
| `src/layouts/Base.astro` | Master layout — wraps every page |
| `src/components/SEO.astro` | SEO/OG/JSON-LD head tags |
| `src/components/ArticleCard.astro` | Card singola articolo: `<a>` se pubblicato, `<div>` statico se draft |

### Articoli

Gli articoli sono definiti in `src/content/articles.ts`. Il tipo `Article` include: `number`, `title`, `description`, `href`, `published`, e i campi opzionali `image` (ImageMetadata), `imageAlt`, `publishedAt` (Date).

Per aggiungerne uno:
1. Aggiungi un oggetto all'array `articles` con `published: false`
2. Crea la pagina in `src/pages/articoli/[numero].astro`
3. Imposta `published: true` e aggiungi `publishedAt` quando è pronto

Le immagini degli articoli vanno in `src/assets/articles/` (importate staticamente nel frontmatter di `articles.ts` per ottimizzazione Astro).

La home page (`src/pages/index.astro`) mappa automaticamente l'array e renderizza le card in griglia (1→2→3 colonne). Gli stili del grid e delle card sono in `src/styles/partials/structure.css` sotto il commento `/* Article grid */`.

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

- **JS solo per visualizzazioni.** Aggiungere `<script>` solo per componenti interattivi con valore giornalistico; tutto il resto resta HTML statico.
- **Semantic HTML first.** Usare elementi appropriati (`<article>`, `<nav>`, `<section>`, `<figure>`, `<figcaption>`) prima dei `<div>`.
- **All SEO props have defaults** from `site.ts` — override solo quando la pagina richiede valori personalizzati.
- **`robots.txt`** is generated from `src/pages/robots.txt.ts`.
- **OG images** go in `public/images/og/`.
- Fonts live in `public/fonts/`.
- **Dati e dataset** statici (CSV, JSON) vanno in `public/data/` e caricati client-side nelle visualizzazioni.
- **Testi in italiano.** Tutti i contenuti del sito, meta description e label delle visualizzazioni devono essere in italiano.
