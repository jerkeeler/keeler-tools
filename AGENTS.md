# Keeler Tools Agent Guide

This repo powers tools.keeler.dev. Each tool is a single Astro page that runs entirely in the browser.

## Quick start

- `npm install`
- `npm run dev` for local development
- `npm run build` for production build
- `npm run preview` to preview the build

## Structure

- `src/pages/index.astro` is the hand-edited tool index.
- `src/pages/tools/` holds one page per tool, isolated and browser-only.
- `src/layouts/Layout.astro` is the shared layout and metadata.
- `src/styles/global.css` defines global Tailwind layers and base styles.
- `tailwind.config.mjs` contains theme tokens (brand colors, fonts).

## Adding a new tool

1. Create a new page in `src/pages/tools/your-tool.astro`.
2. Add a card/link to the list in `src/pages/index.astro`.
3. Keep the tool self-contained with vanilla JS and small browser libraries only.
4. Update `public/sw.js`:
    - Increment `CACHE_VERSION` (e.g., 'v1' → 'v2')
    - Add the new tool URL to `PRECACHE_URLS` array
5. Update `public/manifest.json`:
    - Add a shortcut entry for the new tool with its description

## Formatting

- Prettier runs on commit via Husky: `npm run format:check`.
- Run `npm run format` to auto-format locally.

## Commits

- Commit messages should be well written, very descriptive, and full.

## Deployment

- Netlify should run `npm run build` and publish `dist/`.
