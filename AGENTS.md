# AGENTS.md — Elden Site of Wisdom

Project guide for AI agents and contributors working on **Elden Site of Wisdom**, an Elden Ring fan archive for lore, bosses, items, regions, and media.

- **Repository:** `https://github.com/Phantom-Con-Artist/eldensiteofwisdom` (`main`)
- **Hosting:** Cloudflare Pages (Static) — build command `pnpm build`, output directory `dist/` (`output: "static"` in Astro; avoid SSR-only adapters or server runtime APIs)
- **Package Manager:** `pnpm` (do not mix `npm` or `yarn` lockfiles)

---

## Development

When starting the dev server, use background mode:

```bash
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Build & verify before finishing changes:

```bash
pnpm build
```

---

## Tech Stack & Architecture

| Layer | Technology | Entry / Config |
| :--- | :--- | :--- |
| **Framework** | Astro 7 (`static` output) + TypeScript (`strict`) | [astro.config.mjs](file:///home/subhradeep/Development/eldensiteofwisdom/astro.config.mjs), [tsconfig.json](file:///home/subhradeep/Development/eldensiteofwisdom/tsconfig.json) |
| **Interactive UI** | React 19 (`@astrojs/react`) islands | `src/components/*.tsx` |
| **Content & Lore** | Astro Content Collections + MDX (`@astrojs/mdx`) | [src/content.config.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/content.config.ts), `src/content/lore/` |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) + `@tailwindcss/typography` | [src/styles/global.css](file:///home/subhradeep/Development/eldensiteofwisdom/src/styles/global.css) |
| **Motion & Transitions** | GSAP + ScrollTrigger, Lenis, Barba.js (`@barba/core`) | [src/lib/motion.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/lib/motion.ts), [BaseLayout.astro](file:///home/subhradeep/Development/eldensiteofwisdom/src/layouts/BaseLayout.astro) |
| **Icons** | `astro-icon` (`game-icons`, `lucide`), `lucide-react`, local SVGs | `src/icons/` |
| **Search & SEO** | `fuse.js`, `@astrojs/sitemap` | [astro.config.mjs](file:///home/subhradeep/Development/eldensiteofwisdom/astro.config.mjs) |
| **Media (Images/Videos)** | Cloudinary CLI (`cld`) + `cloudinary` Node SDK | [src/lib/cloudinary.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/lib/cloudinary.ts) |
| **Utilities** | `clsx`, `tailwind-merge` (`cn()`) | [src/lib/utils.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/lib/utils.ts) |

Path alias: `@/*` maps to `./src/*` (configured in `tsconfig.json`).

---

## Environment Variables

Local secrets live in `.env` (gitignored via `.gitignore`; template in [.env.example](file:///home/subhradeep/Development/eldensiteofwisdom/.env.example)). **Never commit `.env` or hardcode secrets in source files.**
For Cloudflare Pages deployment, configure `PUBLIC_CLOUDINARY_CLOUD_NAME` and `PUBLIC_ELDEN_RING_API_BASE` in the Cloudflare Pages environment settings; keep `CLOUDINARY_URL` strictly for local CLI / build-time usage.

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `CLOUDINARY_URL` | Server / Build / CLI | Full Cloudinary API credentials (`cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>`). Used by the Node `cloudinary` SDK. |
| `PUBLIC_CLOUDINARY_CLOUD_NAME` | Client & Server | Public cloud name (`dec03onf`) used by `getCloudinaryUrl()` to construct optimized delivery URLs. |
| `PUBLIC_ELDEN_RING_API_BASE` | Client & Server | Base URL for the Elden Ring Fan API (`https://eldenring.fanapis.com/api`). |

---

## Cloudinary Media Workflow (Images & Videos)

The Cloudinary CLI (`cld` `1.18.0`) is installed at `~/.local/bin/cld` and pre-configured with `dec03onf` as the default profile.

### Common `cld` CLI Commands for Agents & Developers

```bash
# Verify connection
cld admin ping

# Upload an image or video to a structured folder
cld uploader upload ./local-asset.png folder="elden-ring/bosses"
cld uploader upload ./clip.mp4 resource_type="video" folder="elden-ring/videos"

# List uploaded assets
cld admin resources type="upload" prefix="elden-ring/"
cld admin resources resource_type="video" type="upload"
```

### Fetching Media in Code

Always use `getCloudinaryUrl()` from [src/lib/cloudinary.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/lib/cloudinary.ts) rather than hardcoding raw URLs. It automatically applies `f_auto,q_auto` and optional width/height/crop transforms:

```ts
import { getCloudinaryUrl } from '@/lib/cloudinary';

const heroImg = getCloudinaryUrl('elden-ring/bosses/malenia', 'image', { width: 1200 });
const bossClip = getCloudinaryUrl('elden-ring/videos/radahn-phase2', 'video');
```

---

## Free, No-Signup Elden Ring APIs & Lore Datasets

### 1. Elden Ring Fan API (REST & GraphQL)
- **Base URL:** `https://eldenring.fanapis.com/api` (no API key, CORS enabled)
- **GraphQL:** `https://eldenring.fanapis.com/api/graphql`
- **Typed Helper:** `fetchEldenRingList()` in [src/lib/eldenRingApi.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/lib/eldenRingApi.ts)
- **Categories:** `ammos`, `armors`, `ashes`, `bosses`, `classes`, `creatures`, `incantations`, `items`, `locations`, `npcs`, `shields`, `sorceries`, `spirits`, `talismans`, `weapons`
- **Query Params:** `?limit=<n>`, `?page=<n>`, `?name=<query>`

### 2. Community Lore & Dialogue Datasets (Base Game + Shadow of the Erdtree)
- **ERDB (`EldenRingDatabase/erdb`):** Structured game data schemas & REST API.
- **Impalers-Archive (`ividyon/Impalers-Archive`):** *Shadow of the Erdtree* text & dialogue dumps.
- **Carian-Archive (`AsteriskAmpersand/Carian-Archive`) & `elden-ring-data/msg`:** Base-game item descriptions, loading tips, and NPC dialogue.
- **Elden Ring Text Explorer (`EldenRingExplorer/EldenRingTextExplorer`):** Categorized `elden_ring_text.json`.

---

## Design Tokens, Fonts & Icons

Defined in [src/styles/fonts.css](file:///home/subhradeep/Development/eldensiteofwisdom/src/styles/fonts.css) and [src/styles/global.css](file:///home/subhradeep/Development/eldensiteofwisdom/src/styles/global.css):

- **Font Classes:**
  - `font-display` → `Cinzel Decorative` (major titles, boss names — closest open-source match to Mantinia)
  - `font-heading` → `Cinzel` (section headers, UI labels)
  - `font-lore` → `Cormorant Garamond` (item descriptions, quotes, long-form lore)
  - `font-sans` → `Inter` (stats, tables, filters, metadata)
- **Color Tokens:**
  - `er-obsidian` (`#0b0a09`), `er-charcoal` (`#151311`), `er-slate` (`#1f1c18`)
  - `er-gold` (`#c8a253`), `er-gold-bright` (`#e5c67b`), `er-gold-dim` (`#7c6433`)
  - `er-parchment` (`#e4dccb`), `er-ash` (`#9e9689`), `er-crimson` (`#8f2424`)
- **Icons:**
  - In `.astro` files: `<Icon name="game-icons:..." />` or `<Icon name="lucide:..." />` via `astro-icon`, or custom SVGs placed in `src/icons/`.
  - In `.tsx` React islands: `lucide-react`.

---

## Motion, Smooth Scroll & Page Transitions

- [BaseLayout.astro](file:///home/subhradeep/Development/eldensiteofwisdom/src/layouts/BaseLayout.astro) wraps pages with `data-barba="wrapper"` and `<main data-barba="container" data-barba-namespace={namespace}>`.
- [src/lib/motion.ts](file:///home/subhradeep/Development/eldensiteofwisdom/src/lib/motion.ts) initializes **Lenis**, syncs it with **GSAP ScrollTrigger**, and configures **Barba.js** (`grace-fade` transition).
- When adding GSAP animations inside React islands, always wrap them in `gsap.context(() => { ... }, ref)` and call `ctx.revert()` on unmount so Barba transitions and React strict mode stay leak-free.

---

## Documentation

Full Astro documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
